export interface Translatable {
  en: string;
  ar: string;
  ku?: string;
}

export interface City {
  id: string;
  name: Translatable;
  image: string;
}

export interface Category {
  id: string;
  name: Translatable;
  image: string;
  translation_key?: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Review {
  id: string;
  user: User;
  rating: number; // 1-5
  comment: string;
  timestamp: string;
}

export interface Event {
  id: string;
  title: Translatable;
  organizerId: string;
  organizerName: string;
  categoryId: string;
  cityId: string;
  date: string;
  venue: string;
  description: Translatable;
  organizerPhone: string;
  whatsappNumber?: string;
  imageUrl: string;
  reviews: Review[];
  coordinates?: { lat: number; lon: number };
  ticketInfo?: string;
}

export type Language = 'en' | 'ar' | 'ku';

export type AuthMode = 'login' | 'signup' | 'forgot-password';

export interface AISuggestionResponse {
  title: Translatable;
  description: Translatable;
  suggestedCategoryId: string;
  suggestedCityId: string;
  generatedImageBase64: string;
}

// Data structure for pre-filling the Create Event modal
export interface AIAutofillData {
  title: Translatable;
  description: Translatable;
  categoryId: string;
  cityId: string;
  imageBase64: string;
}