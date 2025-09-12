export interface Category {
  id: string;
  name: {
    en: string;
    ku_sorani: string;
    ku_kurmanji: string;
    ar: string;
  };
}

export interface Location {
  id:string;
  name: {
    en: string;
    ku_sorani: string;
    ku_kurmanji: string;
    ar: string;
  };
  region: string; // e.g., 'Kurdistan Region of Iraq'
}

export interface Event {
  id: string;
  title: {
    en: string;
    ku_sorani: string;
    ku_kurmanji: string;
    ar: string;
  };
  description: {
    en: string;
    ku_sorani: string;
    ku_kurmanji: string;
    ar: string;
  };
  date: string; // ISO 8601 format
  imageUrl: string;
  category: Category;
  location: Location;
  organizer: string;
}

export type Language = 'en' | 'ku_sorani' | 'ku_kurmanji' | 'ar';

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export interface OrganizerProfile {
  id: string;
  name: string;
  profilePictureUrl: string;
  biography: string;
  specializations: string[];
}

export interface PracticeArea {
  id: string;
  name: {
    en: string;
    ku_sorani: string;
    ku_kurmanji: string;
    ar: string;
  };
}

export interface Lawyer {
  id: string;
  name: {
    en: string;
    ku_sorani: string;
    ku_kurmanji: string;
    ar: string;
  };
  biography: {
    en: string;
    ku_sorani: string;
    ku_kurmanji: string;
    ar: string;
  };
  practiceAreas: PracticeArea[];
  location: Location;
  phoneNumber: string;
  whatsapp?: string;
  email: string;
  profilePictureUrl: string;
  experienceYears: number;
  languages: Language[];
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
}
