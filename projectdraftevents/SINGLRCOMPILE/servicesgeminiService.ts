services/geminiService.tsimport { GoogleGenAI, Type } from "@google/genai";
import type { City, Category, AISuggestionResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateEventDetailsFromPrompt = async (
    prompt: string,
    cities: City[],
    categories: Category[]
): Promise<AISuggestionResponse> => {
    if (!API_KEY) {
        throw new Error("API key is not configured.");
    }

    const cityContext = cities.map(c => ({ id: c.id, name: c.name.en }));
    const categoryContext = categories
      .filter(c => c.id !== 'all')
      .map(c => ({ id: c.id, name: c.translation_key?.replace(/_/g, ' ') || c.name.en }));

    try {
        const textModel = 'gemini-2.5-flash';
        const systemInstruction = `You are an expert event planner for Iraq and the Kurdistan Region. Your task is to take a user's rough idea and transform it into a structured event object.
        - Generate a compelling, professional-sounding title and a detailed, engaging description.
        - You MUST provide the title and description in three languages: English (en), Arabic (ar), and Kurdish (ku).
        - Based on the user's prompt, select the most appropriate cityId and categoryId from the provided lists.
        - Create a simple, descriptive prompt suitable for an AI image generator like DALL-E to create a cover photo for the event.
        - Respond ONLY with a valid JSON object that adheres to the provided schema.

        Available cities: ${JSON.stringify(cityContext)}
        Available categories: ${JSON.stringify(categoryContext)}
        `;

        const textResponse = await ai.models.generateContent({
            model: textModel,
            contents: `User's event idea: "${prompt}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.OBJECT,
                            properties: {
                                en: { type: Type.STRING },
                                ar: { type: Type.STRING },
                                ku: { type: Type.STRING }
                            },
                            required: ["en", "ar", "ku"]
                        },
                        description: {
                            type: Type.OBJECT,
                            properties: {
                                en: { type: Type.STRING },
                                ar: { type: Type.STRING },
                                ku: { type: Type.STRING }
                            },
                            required: ["en", "ar", "ku"]
                        },
                        suggestedCategoryId: { type: Type.STRING },
                        suggestedCityId: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING }
                    },
                    required: ["title", "description", "suggestedCategoryId", "suggestedCityId", "imagePrompt"]
                },
            },
        });
        
        const suggestions = JSON.parse(textResponse.text.trim());
        const { title, description, suggestedCategoryId, suggestedCityId, imagePrompt } = suggestions;
        
        const imageModel = 'imagen-4.0-generate-001';
        const imageResponse = await ai.models.generateImages({
            model: imageModel,
            prompt: imagePrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
            },
        });

        const generatedImageBase64 = imageResponse.generatedImages[0].image.imageBytes;

        if (!generatedImageBase64) {
            throw new Error("Image generation failed.");
        }

        return {
            title,
            description,
            suggestedCategoryId,
            suggestedCityId,
            generatedImageBase64,
        };
    } catch (error) {
        console.error("Error getting AI suggestions:", error);
        throw new Error("Failed to generate AI suggestions. Please try again.");
    }
};