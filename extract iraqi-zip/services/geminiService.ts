
import { GoogleGenAI, Type } from "@google/genai";
import type { City, Category, AISuggestionResponse, LocalizedString } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we'll alert the developer.
  console.error("Gemini API key is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// This function generates the event details and an image based on a user prompt.
export const generateEventDetailsFromPrompt = async (
  prompt: string,
  cities: City[],
  categories: Category[]
): Promise<AISuggestionResponse> => {
  try {
    const cityList = cities.map(c => `- ID: "${c.id}", Name: "${c.name.en}"`).join('\n');
    const categoryList = categories
      .filter(c => c.id !== 'all')
      .map(c => `- ID: "${c.id}", Name: "${c.name.en}"`).join('\n');

    const schema = {
      type: Type.OBJECT,
      properties: {
        title_en: { type: Type.STRING, description: "A catchy and descriptive event title in English." },
        title_ar: { type: Type.STRING, description: "The event title translated into Arabic." },
        title_ku: { type: Type.STRING, description: "The event title translated into Kurdish (Sorani)." },
        description_en: { type: Type.STRING, description: "A detailed event description in English (2-3 sentences)." },
        description_ar: { type: Type.STRING, description: "The event description translated into Arabic." },
        description_ku: { type: Type.STRING, description: "The event description translated into Kurdish (Sorani)." },
        suggestedCityId: { type: Type.STRING, description: "The most appropriate city ID from the provided list." },
        suggestedCategoryId: { type: Type.STRING, description: "The most appropriate category ID from the provided list." },
        imagePrompt: { type: Type.STRING, description: "A creative, visually rich prompt for an image generation model to create a cover photo for this event. Describe a scene, not just objects. e.g. 'A vibrant, energetic concert with a large crowd cheering under colorful stage lights.'" }
      },
      required: ["title_en", "title_ar", "title_ku", "description_en", "description_ar", "description_ku", "suggestedCityId", "suggestedCategoryId", "imagePrompt"]
    };

    // First API call: Generate structured text data (title, description, etc.)
    const textGenerationResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the user's event idea, generate the required details in JSON format.
        User Idea: "${prompt}"

        Available Cities:
        ${cityList}

        Available Categories:
        ${categoryList}
        
        Analyze the user's prompt to determine the best city and category. Create a compelling title and description, and translate them. Also, create a detailed image prompt.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        }
    });
    
    const jsonResponseText = textGenerationResponse.text.trim();
    const generatedData = JSON.parse(jsonResponseText);

    if (!generatedData.imagePrompt) {
        throw new Error("AI failed to generate an image prompt.");
    }

    // Second API call: Generate an image using the prompt from the first call
    const imageGenerationResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: generatedData.imagePrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '16:9',
        },
    });

    const image = imageGenerationResponse.generatedImages[0];
    if (!image || !image.image.imageBytes) {
      throw new Error("AI failed to generate an image.");
    }
    const imageBase64 = image.image.imageBytes;

    const title: LocalizedString = {
        en: generatedData.title_en,
        ar: generatedData.title_ar,
        ku: generatedData.title_ku,
    };

    const description: LocalizedString = {
        en: generatedData.description_en,
        ar: generatedData.description_ar,
        ku: generatedData.description_ku,
    };

    return {
      title: title,
      description: description,
      suggestedCategoryId: generatedData.suggestedCategoryId,
      suggestedCityId: generatedData.suggestedCityId,
      generatedImageBase64: imageBase64,
    };

  } catch (error) {
    console.error("Error in Gemini service:", error);
    throw new Error("Failed to get AI suggestions. Please try again.");
  }
};


export const translateEventDetails = async (
  sourceText: { title: string; description: string; },
  sourceLang: 'en' | 'ar' | 'ku'
): Promise<{
  title_en: string; title_ar: string; title_ku: string;
  description_en: string; description_ar: string; description_ku: string;
}> => {
  const langMap = {
      en: 'English',
      ar: 'Arabic',
      ku: 'Kurdish (Sorani)'
  };

  const schema = {
      type: Type.OBJECT,
      properties: {
        title_en: { type: Type.STRING, description: "The event title in English." },
        title_ar: { type: Type.STRING, description: "The event title translated into Arabic." },
        title_ku: { type: Type.STRING, description: "The event title translated into Kurdish (Sorani)." },
        description_en: { type: Type.STRING, description: "The event description in English." },
        description_ar: { type: Type.STRING, description: "The event description translated into Arabic." },
        description_ku: { type: Type.STRING, description: "The event description translated into Kurdish (Sorani)." },
      },
      required: ["title_en", "title_ar", "title_ku", "description_en", "description_ar", "description_ku"]
  };
  
  // Create a more robust, explicit prompt for the AI.
  const instructions: { [key in 'en' | 'ar' | 'ku']: string } = {
    en: `Translate the original ${langMap[sourceLang]} text into English.`,
    ar: `Translate the original ${langMap[sourceLang]} text into Arabic.`,
    ku: `Translate the original ${langMap[sourceLang]} text into Kurdish (Sorani).`
  };

  // Override the instruction for the source language to ensure it returns the original text.
  instructions[sourceLang] = `Use the original ${langMap[sourceLang]} text provided without any changes.`;

  const prompt = `You are a translation assistant. You will be given event details in ${langMap[sourceLang]}.
Your task is to provide the same details in three languages: English, Arabic, and Kurdish (Sorani), following these instructions precisely:
- For the English fields (title_en, description_en): ${instructions.en}
- For the Arabic fields (title_ar, description_ar): ${instructions.ar}
- For the Kurdish fields (title_ku, description_ku): ${instructions.ku}

Original Event Details (in ${langMap[sourceLang]}):
Source Title: "${sourceText.title}"
Source Description: "${sourceText.description}"

Provide the result as a single JSON object that conforms to the schema.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    const jsonResponseText = response.text.trim();
    const translatedData = JSON.parse(jsonResponseText);
    
    return translatedData;
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("Failed to translate event details.");
  }
};