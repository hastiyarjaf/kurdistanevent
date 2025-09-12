import type { City, Category, Event, User } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Salar Salah', avatarUrl: 'https://picsum.photos/seed/user1/100' },
  { id: 'user-2', name: 'Layla Ahmed', avatarUrl: 'https://picsum.photos/seed/user2/100' },
];

// This list contains the 19 cities and governorates specified for the application.
export const cities: City[] = [
    { id: 'city-baghdad', name: { en: 'Baghdad', ar: 'بغداد', ku: 'بەغدا' }, image: 'https://picsum.photos/seed/baghdad/200' },
    { id: 'city-basra', name: { en: 'Basra', ar: 'البصرة', ku: 'بەسرە' }, image: 'https://picsum.photos/seed/basra/200' },
    { id: 'city-mosul', name: { en: 'Mosul', ar: 'الموصل', ku: 'مووسڵ' }, image: 'https://picsum.photos/seed/mosul/200' },
    { id: 'city-erbil', name: { en: 'Erbil', ar: 'أربيل', ku: 'هەولێر' }, image: 'https://picsum.photos/seed/erbil/200' },
    { id: 'city-sulaymaniyah', name: { en: 'Sulaymaniyah', ar: 'السليمانية', ku: 'سلێمانی' }, image: 'https://picsum.photos/seed/sulaymaniyah/200' },
    { id: 'city-duhok', name: { en: 'Duhok', ar: 'دهوك', ku: 'دهۆک' }, image: 'https://picsum.photos/seed/duhok/200' },
    { id: 'city-kirkuk', name: { en: 'Kirkuk', ar: 'كركوك', ku: 'کەرکووک' }, image: 'https://picsum.photos/seed/kirkuk/200' },
    { id: 'city-fallujah', name: { en: 'Fallujah', ar: 'الفلوجة', ku: 'فەللوجە' }, image: 'https://picsum.photos/seed/fallujah/200' },
    { id: 'city-babylon', name: { en: 'Babylon', ar: 'بابل', ku: 'بابیلۆن' }, image: 'https://picsum.photos/seed/babylon/200' },
    { id: 'city-najaf', name: { en: 'Najaf', ar: 'النجف', ku: 'نەجەف' }, image: 'https://picsum.photos/seed/najaf/200' },
    { id: 'city-karbala', name: { en: 'Karbala', ar: 'كربلاء', ku: 'کەربەلا' }, image: 'https://picsum.photos/seed/karbala/200' },
    { id: 'city-maysan', name: { en: 'Maysan', ar: 'ميسان', ku: 'میسان' }, image: 'https://picsum.photos/seed/maysan/200' },
    { id: 'city-dhi-qar', name: { en: 'Dhi Qar', ar: 'ذي قار', ku: 'زیقار' }, image: 'https://picsum.photos/seed/dhi-qar/200' },
    { id: 'city-muthanna', name: { en: 'Muthanna', ar: 'المثنى', ku: 'موسەننا' }, image: 'https://picsum.photos/seed/muthanna/200' },
    { id: 'city-qadisiyyah', name: { en: 'Qadisiyyah', ar: 'القادسية', ku: 'قادسیە' }, image: 'https://picsum.photos/seed/qadisiyyah/200' },
    { id: 'city-wasit', name: { en: 'Wasit', ar: 'واسط', ku: 'واست' }, image: 'https://picsum.photos/seed/wasit/200' },
    { id: 'city-diyala', name: { en: 'Diyala', ar: 'ديالى', ku: 'دیالە' }, image: 'https://picsum.photos/seed/diyala/200' },
    { id: 'city-samarra', name: { en: 'Samarra', ar: 'سامراء', ku: 'سامەڕا' }, image: 'https://picsum.photos/seed/samarra/200' },
    { id: 'city-al-kut', name: { en: 'Al-Kut', ar: 'الكوت', ku: 'کووت' }, image: 'https://picsum.photos/seed/al-kut/200' },
];

export const categories: Category[] = [
    { id: 'all', name: { en: 'All Events', ar: 'جميع الفعاليات', ku: 'هەموو ڕووداوەکان' }, image: 'https://picsum.photos/seed/all/200' },
    { id: 'cat-1', name: { en: 'Music', ar: 'موسيقى', ku: 'مۆسیقا' }, translation_key: 'music', icon: 'MusicIcon', image: 'https://picsum.photos/seed/music/200' },
    { id: 'cat-2', name: { en: 'Art & Culture', ar: 'فن وثقافة', ku: 'هونەر و کەلتور' }, translation_key: 'art_culture', icon: 'ArtIcon', image: 'https://picsum.photos/seed/art/200' },
    { id: 'cat-3', name: { en: 'Food & Drink', ar: 'طعام وشراب', ku: 'خواردن و خواردنەوە' }, translation_key: 'food_drink', icon: 'FoodIcon', image: 'https://picsum.photos/seed/food/200' },
    { id: 'cat-4', name: { en: 'Tech', ar: 'تكنولوجيا', ku: 'تەکنەلۆژیا' }, translation_key: 'tech', icon: 'TechIcon', image: 'https://picsum.photos/seed/tech/200' },
];

export const initialEvents: Event[] = [
    {
        id: 'event-1',
        title: { en: 'Erbil International Tech Summit', ar: 'قمة أربيل الدولية للتكنولوجيا', ku: 'لووتکەی نێودەوڵەتی تەکنەلۆژیای هەولێر' },
        organizerId: 'user-1',
        description: { en: 'Join the brightest minds in tech...', ar: 'انضم إلى ألمع العقول في مجال التكنولوجيا...', ku: 'بەشداری بکە لەگەڵ زیرەکترین کەسانی بواری تەکنەلۆژیا...' },
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        venue: 'Saad Abdullah Palace, Erbil',
        imageUrl: 'https://picsum.photos/seed/event1/800/600',
        organizerName: users[0].name,
        organizerPhone: '+9647501112233',
        whatsappNumber: '+9647501112233',
        cityId: 'city-erbil',
        categoryId: 'cat-4',
        coordinates: { lat: 36.1911, lon: 44.0094 },
        ticketInfo: 'Registration Required - Free Entry',
        reviews: [
            { id: 'r1', user: users[1], rating: 5, comment: 'Amazing event! So many great speakers.', timestamp: new Date().toISOString() }
        ],
    },
    {
        id: 'event-2',
        title: { en: 'Traditional Kurdish Music Night', ar: 'ليلة الموسيقى الكردية التقليدية', ku: 'شەوی مۆسیقای کوردی ڕەسەن' },
        organizerId: 'user-2',
        description: { en: 'An evening of soulful melodies under the stars.', ar: 'أمسية من الألحان المفعمة بالحيوية تحت النجوم.', ku: 'ئێوارەیەکی پڕ لە ئاوازی ڕۆحی لەژێر ئەستێرەکاندا.' },
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        venue: 'Chavi Land, Sulaymaniyah',
        imageUrl: 'https://picsum.photos/seed/event2/800/600',
        organizerName: users[1].name,
        organizerPhone: '+9647702223344',
        cityId: 'city-sulaymaniyah',
        categoryId: 'cat-1',
        coordinates: { lat: 35.5606, lon: 45.4735 },
        ticketInfo: 'Tickets: 20,000 IQD',
        reviews: [],
    },
    {
        id: 'event-3',
        title: { en: 'Baghdad Art Exhibition', ar: 'معرض بغداد للفنون', ku: 'پێشانگای هونەری بەغدا' },
        organizerId: 'user-1',
        description: { en: 'Featuring modern Iraqi artists and sculptors.', ar: 'يضم فنانين ونحاتين عراقيين معاصرين.', ku: 'پیشاندانی هونەرمەندان و پەیکەرتاشانی هاوچەرخی عێراقی.' },
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        venue: 'Iraqi Museum, Baghdad',
        imageUrl: 'https://picsum.photos/seed/event3/800/600',
        organizerName: users[0].name,
        organizerPhone: '+9647803334455',
        whatsappNumber: '+9647803334455',
        cityId: 'city-baghdad',
        categoryId: 'cat-2',
        coordinates: { lat: 33.3276, lon: 44.3855 },
        ticketInfo: 'Free Entry',
        reviews: [
            { id: 'r2', user: users[0], rating: 4, comment: 'Great atmosphere, but could be better organized.', timestamp: new Date().toISOString() },
            { id: 'r3', user: users[1], rating: 5, comment: 'Loved it!', timestamp: new Date().toISOString() }
        ],
    },
     {
        id: 'event-4',
        title: { en: 'Duhok Food Festival', ar: 'مهرجان دهوك للطعام', ku: 'فیستیڤاڵی خواردنی دهۆک' },
        organizerId: 'user-2',
        description: { en: 'Taste the best of local and international cuisine.', ar: 'تذوق أفضل المأكولات المحلية والعالمية.', ku: 'تام لە باشترین خواردنی ناوخۆیی و نێودەوڵەتی بکە.' },
        date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        venue: 'Azadi Park, Duhok',
        imageUrl: 'https://picsum.photos/seed/event4/800/600',
        organizerName: users[1].name,
        organizerPhone: '+9647514445566',
        cityId: 'city-duhok',
        categoryId: 'cat-3',
        coordinates: { lat: 36.8625, lon: 42.9868 },
        ticketInfo: 'Free Entry',
        reviews: [],
    },
];

export const featuredEvents: Event[] = [
    { ...initialEvents[0], imageUrl: 'https://picsum.photos/seed/featured1/1200/800' },
    { ...initialEvents[1], imageUrl: 'https://picsum.photos/seed/featured2/1200/800' },
    { ...initialEvents[2], imageUrl: 'https://picsum.photos/seed/featured3/1200/800' },
    { ...initialEvents[3], imageUrl: 'https://picsum.photos/seed/featured4/1200/800' },
];