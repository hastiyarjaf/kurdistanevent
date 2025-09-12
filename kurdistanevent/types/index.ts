export type Language = 'en' | 'ar' | 'ku';

export interface User {
  id: string;
  email: string;
  name: string;
  profile_picture?: string;
  language: Language;
  role: 'attendee' | 'host' | 'admin';
  attending_event_ids?: string[];
  // Host-specific fields
  businessName?: string;
  phone?: string;
  website?: string;
  businessAddress?: string;
  organizerType?: string;
  isVerified?: boolean;
  verificationStatus?: 'unsubmitted' | 'pending' | 'approved' | 'rejected';
}

export interface Sponsor {
    id: string;
    name: string;
    logo_url: string;
}

export interface Banner {
    id: string;
    sponsor_id: string;
    sponsor?: Sponsor;
    image_url: string;
    link_url: string;
    target_city_id: string | null; // null for All Iraq
    placement: 'home_top' | 'details_bottom';
}

export interface Category {
  id:string;
  translation_key: string;
  icon: string; // lucide-react icon name
  sponsor_id?: string;
  sponsor?: Sponsor;
}

export interface City {
  id: string;
  name: Record<Language, string>;
}

export interface Event {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  date: string; // ISO 8601 format
  location_address: string;
  location_latLng: string; // "latitude,longitude"
  image: string;
  is_promoted?: boolean;
  creator_id: string;
  creator?: User; // Populated after fetching
  category_id: string;
  category?: Category; // Populated after fetching
  city_id: string;
  city?: City; // Populated after fetching
  attendee_ids?: string[];
  attendees?: User[];
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  timestamp: string; // ISO 8601 string
  is_read: boolean;
}
