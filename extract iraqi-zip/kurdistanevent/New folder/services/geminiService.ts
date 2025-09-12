
import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES, LOCATIONS } from '../constants';
import type { Event } from '../types';

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.warn("VITE_GEMINI_API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! });

const eventSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique identifier for the event, e.g., "ai-event-1"' },
        title_en: { type: Type.STRING, description: 'The title of the event in English' },
        title_ku_sorani: { type: Type.STRING, description: 'The title of the event in Kurdish (Sorani)' },
        title_ku_kurmanji: { type: Type.STRING, description: 'The title of the event in Kurdish (Kurmanji)' },
        title_ar: { type: Type.STRING, description: 'The title of the event in Arabic' },
        description_en: { type: Type.STRING, description: 'A brief description of the event in English' },
        description_ku_sorani: { type: Type.STRING, description: 'A brief description of the event in Kurdish (Sorani)' },
        description_ku_kurmanji: { type: Type.STRING, description: 'A brief description of the event in Kurdish (Kurmanji)' },
        description_ar: { type: Type.STRING, description: 'A brief description of the event in Arabic' },
        date: { type: Type.STRING, description: 'The event date in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ). Pick a realistic future date.' },
        category_id: { type: Type.STRING, description: `The category ID. Must be one of: ${CATEGORIES.map(c => c.id).join(', ')}` },
        location_id: { type: Type.STRING, description: `The location ID. Must be one of: ${LOCATIONS.map(l => l.id).join(', ')}` },
        organizer: { type: Type.STRING, description: 'The name of the event organizer, e.g., "Erbil Arts Council"' }
    },
    required: ['id', 'title_en', 'description_en', 'date', 'category_id', 'location_id', 'organizer']
};

export const generateEventSuggestions = async (query: string): Promise<Event[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the user's request, "${query}", generate a list of 3-5 relevant Kurdish cultural event ideas. The events should be diverse and authentic. Ensure the IDs are unique.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            events: {
              type: Type.ARRAY,
              items: eventSchema
            }
          }
        },
      }
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);

    if (!parsed.events || !Array.isArray(parsed.events)) {
        throw new Error("Invalid response format from AI.");
    }

    // Map the AI response to our Event type
    const events: Event[] = parsed.events.map((e: any) => {
        const category = CATEGORIES.find(c => c.id === e.category_id);
        const location = LOCATIONS.find(l => l.id === e.location_id);
        if (!category || !location) return null;

        return {
            id: e.id,
            title: {
                en: e.title_en,
                ku_sorani: e.title_ku_sorani || e.title_en,
                ku_kurmanji: e.title_ku_kurmanji || e.title_en,
                ar: e.title_ar || e.title_en
            },
            description: {
                en: e.description_en,
                ku_sorani: e.description_ku_sorani || e.description_en,
                ku_kurmanji: e.description_ku_kurmanji || e.description_en,
                ar: e.description_ar || e.description_en
            },
            date: e.date,
            imageUrl: `https://picsum.photos/seed/${e.id}/600/400`,
            category: category,
            location: location,
            organizer: e.organizer
        };
    }).filter((e: Event | null): e is Event => e !== null);
    
    return events;

  } catch (error) {
    console.error("Error generating event suggestions:", error);
    throw new Error("Failed to get suggestions from AI. Please check your API key and try again.");
  }
};

export const translateText = async (text: string, targetLanguageName: string): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set.");
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Translate the following text to ${targetLanguageName}. Only return the translated text, without any introductory phrases, explanations, or markdown formatting. The output should be only the translation itself. Text to translate: "${text}"`,
    });
    return response.text.trim();
  } catch (error) {
    console.error(`Error translating text to ${targetLanguageName}:`, error);
    throw new Error("Failed to translate text.");
  }
};
