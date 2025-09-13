import { User, Event, Category, Language, City, Sponsor, Banner, Message } from '../types';

// ===================================================================================
// PRODUCTION API SERVICE
// ===================================================================================
// This service connects to the real backend API server.
// It replaces the mock API for production deployment.
// ===================================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Utility function for API requests with automatic cookie handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
        credentials: 'include', // Include cookies for authentication
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
};

// Mock translations (same as before - could be moved to a separate service)
const translations: Record<string, Record<Language, string>> = {
    'category.social': { en: 'Social Events', ar: 'فعاليات اجتماعية', ku: 'چاڵاکی کۆمەڵایەتی' },
    'category.music': { en: 'Live Music', ar: 'موسيقى حية', ku: 'مۆسیقای ڕاستەوخۆ' },
    'category.wellness': { en: 'Yoga & Wellness', ar: 'يوجا وصحة', ku: 'یۆگا و تەندروستی' },
    'category.sports': { en: 'Sports & Fitness', ar: 'رياضة ولياقة', ku: 'وەرزش و لەشجوانی' },
    'category.festivals': { en: 'Festivals', ar: 'مهرجانات', ku: 'فیستیڤاڵەکان' },
    'category.conferences': { en: 'Conferences', ar: 'مؤتمرات', ku: 'کۆنفرانسەکان' },
    'category.art-culture': { en: 'Art & Culture', ar: 'فن وثقافة', ku: 'هونەر و ڕۆشنبیری' },
    // Add more translations as needed...
    'header.title1': { en: 'Kurdistan/Iraq', ar: 'كوردستان/العراق', ku: 'کوردستان/عێراق' },
    'header.title2': { en: 'Events', ar: 'للفعاليات', ku: 'ئیڤێنت' },
    'header.welcome': { en: 'Welcome, {name}', ar: 'مرحباً، {name}', ku: 'بەخێربێیت، {name}' },
    'header.createEvent': { en: 'Create Event', ar: 'أنشئ فعالية', ku: 'دروستکردنی ڕووداو' },
    'header.loginSignUp': { en: 'Login / Sign Up', ar: 'تسجيل الدخول / اشتراك', ku: 'چوونەژوورەوە / خۆتۆمارکردن' },
    'welcome.login': { en: 'Login', ar: 'تسجيل الدخول', ku: 'چوونەژوورەوە' },
    'welcome.signup': { en: 'Sign Up', ar: 'اشتراك', ku: 'خۆتۆمارکردن' },
};

// --- TRANSLATIONS ---
export const getTranslations = async (lang: Language): Promise<Record<string, string>> => {
    try {
        const serverTranslations = await apiRequest(`/translations/${lang}`);
        
        // Merge server translations with local ones
        const localTranslations = Object.keys(translations).reduce((acc, key) => {
            acc[key] = translations[key][lang];
            return acc;
        }, {} as Record<string, string>);
        
        return { ...localTranslations, ...serverTranslations };
    } catch (error) {
        console.error('Failed to fetch translations:', error);
        // Fallback to local translations
        return Object.keys(translations).reduce((acc, key) => {
            acc[key] = translations[key][lang] || translations[key]['en'];
            return acc;
        }, {} as Record<string, string>);
    }
};

// --- AUTHENTICATION ---
export interface SignUpData {
    name: string;
    email: string;
    password: string;
    role: 'attendee' | 'host';
}

export const signUp = async (data: SignUpData): Promise<{ user: User }> => {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const login = async (email: string, password: string): Promise<{ user: User }> => {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const signInWithGoogle = async (): Promise<{ user: User }> => {
    // Google OAuth implementation would go here
    // For now, return a placeholder
    throw new Error('Google Sign-In not implemented yet');
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
    // Password reset implementation would go here
    console.log(`Password reset requested for: ${email}`);
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await apiRequest('/auth/me');
    return response.user;
};

export const logout = async (): Promise<void> => {
    await apiRequest('/auth/logout', { method: 'POST' });
};

// Legacy functions for compatibility
export const setSessionToken = (token: string) => {
    // Not used in the new API - tokens are handled via cookies
    console.warn('setSessionToken is deprecated - tokens are now handled via secure cookies');
};

export const getSessionToken = (): string | null => {
    // Not used in the new API - tokens are handled via cookies
    console.warn('getSessionToken is deprecated - tokens are now handled via secure cookies');
    return null;
};

export const clearSessionToken = () => {
    // Logout handles token clearing now
    logout().catch(console.error);
};

export const updateUserLanguage = async (language: Language): Promise<User> => {
    // This would be implemented when user profile updates are added
    // For now, return current user without changes
    const user = await getCurrentUser();
    console.log(`User language would be updated to: ${language}`);
    return user;
};

export const updateHostProfile = async (profileData: any): Promise<void> => {
    // This would be implemented when host profile management is added
    console.log('Host profile would be updated with:', profileData);
};

// --- EVENTS ---
export const getEvents = async (filters?: { 
    city_id?: string;
    category_id?: string;
    search?: string;
    page?: number;
    limit?: number;
}): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, value.toString());
            }
        });
    }

    const queryString = params.toString();
    const endpoint = `/events${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
    try {
        return await apiRequest(`/events/${id}`);
    } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
            return undefined;
        }
        throw error;
    }
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'creator_id' | 'creator' | 'category' | 'city' | 'is_promoted' | 'attendee_ids' | 'attendees'>): Promise<Event> => {
    return apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
    });
};

export const toggleEventAttendance = async (eventId: string): Promise<Event> => {
    const response = await apiRequest(`/events/${eventId}/attend`, {
        method: 'POST',
    });
    
    // Return the updated event - in a real implementation you might refetch the event
    return await getEventById(eventId) as Event;
};

// --- UTILITY DATA ---
export const getCities = async (): Promise<City[]> => {
    return apiRequest('/cities');
};

export const getCategories = async (): Promise<Category[]> => {
    return apiRequest('/categories');
};

export const getSponsors = async (): Promise<Sponsor[]> => {
    // This would be implemented when sponsors are added to backend
    return [];
};

export const getBanners = async (placement: 'home_top' | 'details_bottom', cityId?: string): Promise<Banner[]> => {
    // This would be implemented when banners are added to backend
    return [];
};

// --- MESSAGING (Placeholder implementations) ---
export const getUserById = async (userId: string): Promise<User | undefined> => {
    try {
        return await apiRequest(`/users/${userId}`);
    } catch (error) {
        return undefined;
    }
};

export const getConversations = async (): Promise<{ otherUser: User, lastMessage?: Message }[]> => {
    // This would be implemented with proper messaging backend
    return [];
};

export const getConversation = async (otherUserId: string): Promise<{ otherUser: User, lastMessage?: Message } | undefined> => {
    // This would be implemented with proper messaging backend
    const user = await getUserById(otherUserId);
    if (user) {
        return { otherUser: user };
    }
    return undefined;
};

export const getMessages = async (otherUserId: string): Promise<Message[]> => {
    // This would be implemented with proper messaging backend
    return [];
};

export const sendMessage = async (receiverId: string, text: string): Promise<Message> => {
    // This would be implemented with proper messaging backend
    throw new Error('Messaging not implemented yet');
};

export const markMessagesAsRead = async (otherUserId: string): Promise<void> => {
    // This would be implemented with proper messaging backend
};

export const subscribeToMessages = (otherUserId: string, callback: (messages: Message[]) => void): (() => void) => {
    // This would be implemented with WebSocket or Server-Sent Events
    return () => {};
};

export const getPrivacyPolicyText = async (language: Language): Promise<string> => {
    // This would be implemented with a proper CMS or static content management
    const policies = {
        en: "Privacy Policy content in English...",
        ar: "محتوى سياسة الخصوصية باللغة العربية...",
        ku: "ناوەڕۆکی سیاسەتی تایبەتی بە زمانی کوردی..."
    };
    return policies[language] || policies.en;
};

// --- ANALYTICS (Stub implementations) ---
export const trackImpression = (itemId: string) => {
    console.log(`Impression tracked: ${itemId}`);
};

export const trackClick = (itemId: string) => {
    console.log(`Click tracked: ${itemId}`);
};

export const trackBannerClick = (bannerId: string) => trackClick(`banner-${bannerId}`);
export const trackSponsoredEventClick = (eventId: string) => trackClick(`sponsored-event-${eventId}`);