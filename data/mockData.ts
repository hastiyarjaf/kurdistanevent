
import type { User, City, Category, Event } from '../types';

export const USERS: User[] = [
  { id: 'user1', name: 'Dana Ahmed', email: 'dana@example.com', phone: '07701234567', avatarUrl: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'user2', name: 'Zahra Ali', email: 'zahra@example.com', phone: '07501234567', avatarUrl: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'user3', name: 'Kawa Mahmood', email: 'kawa@example.com', phone: '07801234567', avatarUrl: 'https://picsum.photos/seed/user3/100/100' },
];

export const CITIES: City[] = [
  { id: 'erbil', name: { en: 'Erbil', ar: 'أربيل', ku: 'هەولێر' }, image: 'https://picsum.photos/seed/erbil/300/200' },
  { id: 'sulaymaniyah', name: { en: 'Sulaymaniyah', ar: 'السليمانية', ku: 'سلێمانی' }, image: 'https://picsum.photos/seed/sulaymaniyah/300/200' },
  { id: 'duhok', name: { en: 'Duhok', ar: 'دهوك', ku: 'دهۆک' }, image: 'https://picsum.photos/seed/duhok/300/200' },
  { id: 'baghdad', name: { en: 'Baghdad', ar: 'بغداد', ku: 'بەغداد' }, image: 'https://picsum.photos/seed/baghdad/300/200' },
  { id: 'basra', name: { en: 'Basra', ar: 'البصرة', ku: 'بەسرە' }, image: 'https://picsum.photos/seed/basra/300/200' },
];

export const CATEGORIES: Category[] = [
  { id: 'all', name: { en: 'All Categories', ar: 'كل الفئات', ku: 'هەموو پۆلەکان' }, image: 'https://picsum.photos/seed/all/200/200' },
  { id: 'music', name: { en: 'Music & Concerts', ar: 'موسيقى وحفلات', ku: 'مۆسیقا و کۆنسێرت' }, image: 'https://picsum.photos/seed/music/200/200' },
  { id: 'art', name: { en: 'Art & Culture', ar: 'فن وثقافة', ku: 'هونەر و ڕۆشنبیری' }, image: 'https://picsum.photos/seed/art/200/200' },
  { id: 'food', name: { en: 'Food & Festivals', ar: 'طعام ومهرجانات', ku: 'خواردن و فیستیڤاڵ' }, image: 'https://picsum.photos/seed/food/200/200' },
  { id: 'tech', name: { en: 'Tech & Business', ar: 'تكنولوجيا وأعمال', ku: 'تەکنەلۆژیا و بازرگانی' }, image: 'https://picsum.photos/seed/tech/200/200' },
  { id: 'sports', name: { en: 'Sports & Fitness', ar: 'رياضة ولياقة', ku: 'وەرزش و لەشجوانی' }, image: 'https://picsum.photos/seed/sports/200/200' },
];

const now = new Date();
const getFutureDate = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

export const EVENTS: Event[] = [
  {
    id: 'evt1',
    title: { en: 'Suli Music Festival', ar: 'مهرجان السليمانية للموسيقى', ku: 'فیستیڤاڵی مۆسیقای سلێمانی' },
    description: { en: 'A weekend of live music from local and international artists. Enjoy food trucks, art installations, and great vibes.', ar: 'عطلة نهاية أسبوع من الموسيقى الحية من فنانين محليين وعالميين. استمتع بشاحنات الطعام والتركيبات الفنية والأجواء الرائعة.', ku: 'کۆتایی هەفتەیەک لە مۆسیقای زیندوو لەلایەن هونەرمەندانی ناوخۆیی و نێودەوڵەتی. چێژ لە خواردنی سەر شەقام و نمایشی هونەری و کەشێکی خۆش وەربگرە.' },
    organizerId: 'user1',
    organizerName: 'SuliVibes Org',
    categoryId: 'music',
    cityId: 'sulaymaniyah',
    date: getFutureDate(10),
    venue: 'Hawari Shar Park, Sulaymaniyah',
    organizerPhone: '07709876543',
    whatsappNumber: '07709876543',
    imageUrl: 'https://picsum.photos/seed/evt1/800/600',
    ticketInfo: '25,000 IQD',
    coordinates: { lat: 35.5634, lon: 45.4249 },
    reviews: [
      { id: 'rev1', user: USERS[1], rating: 5, comment: 'Amazing festival!', timestamp: new Date().toISOString() },
    ],
    attendees: [USERS[2], USERS[0]],
  },
  {
    id: 'evt2',
    title: { en: 'Erbil Tech Summit 2024', ar: 'قمة أربيل للتكنولوجيا 2024', ku: 'لووتکەی تەکنەلۆژیای هەولێر ٢٠٢٤' },
    description: { en: 'The largest tech conference in the region. Join developers, entrepreneurs, and investors to discuss the future of technology.', ar: 'أكبر مؤتمر تقني في المنطقة. انضم إلى المطورين ورجال الأعمال والمستثمرين لمناقشة مستقبل التكنولوجيا.', ku: 'گەورەترین کۆنفرانسی تەکنەلۆژی لە ناوچەکە. بەشداری بکە لەگەڵ گەشەپێدەران، خاوەنکاران و وەبەرهێنەران بۆ گفتوگۆکردن لەسەر داهاتووی تەکنەلۆژیا.' },
    organizerId: 'user2',
    organizerName: 'KurdistanTech',
    categoryId: 'tech',
    cityId: 'erbil',
    date: getFutureDate(25),
    venue: 'Saad Abdullah Palace Conference Hall, Erbil',
    organizerPhone: '07501122334',
    imageUrl: 'https://picsum.photos/seed/evt2/800/600',
    ticketInfo: 'Free Entry (Registration Required)',
    coordinates: { lat: 36.1911, lon: 44.0094 },
    reviews: [],
    attendees: [USERS[0], USERS[1]],
  },
  {
    id: 'evt3',
    title: { en: 'Baghdad Art Exhibition', ar: 'معرض بغداد للفنون', ku: 'پێشانگای هونەری بەغداد' },
    description: { en: 'A showcase of contemporary art from Iraqi artists. Featuring paintings, sculptures, and digital art.', ar: 'عرض للفن المعاصر من فنانين عراقيين. يضم لوحات ومنحوتات وفنًا رقميًا.', ku: 'نمایشێکی هونەری هاوچەرخ لەلایەن هونەرمەندانی عێراقی. تابلۆ و پەیکەر و هونەری دیجیتاڵی لەخۆدەگرێت.' },
    organizerId: 'user3',
    organizerName: 'Baghdad Art Collective',
    categoryId: 'art',
    cityId: 'baghdad',
    date: getFutureDate(5),
    venue: 'Iraqi Museum, Baghdad',
    organizerPhone: '07804455667',
    whatsappNumber: '07804455667',
    imageUrl: 'https://picsum.photos/seed/evt3/800/600',
    ticketInfo: '10,000 IQD',
    coordinates: { lat: 33.3283, lon: 44.3853 },
    reviews: [
        { id: 'rev2', user: USERS[0], rating: 4, comment: 'Beautiful pieces of art.', timestamp: new Date().toISOString() }
    ],
    attendees: [],
  },
    {
    id: 'evt4',
    title: { en: 'Duhok International Food Festival', ar: 'مهرجان دهوك الدولي للطعام', ku: 'فیستیڤاڵی نێودەوڵەتی خواردنی دهۆک' },
    description: { en: 'Taste the world in Duhok! A culinary journey with dishes from over 20 countries, plus live cooking shows.', ar: 'تذوق العالم في دهوك! رحلة طهي مع أطباق من أكثر من 20 دولة، بالإضافة إلى عروض الطهي الحية.', ku: 'تامی جیهان لە دهۆک بکە! گەشتێکی چێشتلێنان لەگەڵ خواردنی زیاتر لە ٢٠ وڵات، لەگەڵ نمایشە ڕاستەوخۆکانی چێشتلێنان.' },
    organizerId: 'user1',
    organizerName: 'Duhok Events',
    categoryId: 'food',
    cityId: 'duhok',
    date: getFutureDate(40),
    venue: 'Azadi Park, Duhok',
    organizerPhone: '07505566778',
    imageUrl: 'https://picsum.photos/seed/evt4/800/600',
    ticketInfo: 'Entry: 5,000 IQD',
    coordinates: { lat: 36.8624, lon: 42.9866 },
    reviews: [],
    attendees: [USERS[1]],
  },
];