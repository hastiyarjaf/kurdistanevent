
export type Language = 'en' | 'ar' | 'ku';
export type AuthMode = 'login' | 'signup' | 'forgot-password';

export interface LocalizedString {
  en: string;
  ar: string;
  ku: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface Review {
  id: string;
  user: User;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface City {
  id: string;
  name: LocalizedString;
  image: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  image: string;
}

export interface Event {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  organizerId: string;
  organizerName: string;
  categoryId: string;
  cityId: string;
  date: string;
  venue: string;
  organizerPhone: string;
  whatsappNumber?: string;
  imageUrl: string;
  ticketInfo?: string;
  reviews: Review[];
  coordinates?: { lat: number; lon: number };
  attendees: User[];
}

export interface AIAutofillData {
  title: LocalizedString;
  description: LocalizedString;
  categoryId: string;
  cityId: string;
  imageBase64: string;
}

export interface AISuggestionResponse {
  title: LocalizedString;
  description: LocalizedString;
  suggestedCategoryId: string;
  suggestedCityId: string;
  generatedImageBase64: string;
}