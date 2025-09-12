import type { Event, OrganizerProfile, Lawyer } from '../types';
import { CATEGORIES, LOCATIONS, PRACTICE_AREAS } from '../constants';

const EVENTS_KEY = 'kurdistan_events';
const PROFILE_KEY = 'kurdistan_organizer_profile';
const LAWYERS_KEY = 'iraqi_lawyers';
const LAWYER_PROFILE_KEY = 'lawyer_profile';

// --- Seeding Initial Data ---

const MOCK_EVENTS_RAW = [
  {
    id: '1',
    title: { en: 'Newroz Celebration in Akre', ku_sorani: 'ئاهەنگی نەورۆز لە ئاکرێ', ku_kurmanji: 'Pîrozbahiya Newrozê li Akrê', ar: 'احتفال نوروز في عقرة' },
    description: { en: 'Witness the spectacular annual Newroz fire festival on the mountains of Akre, a symbol of freedom and renewal.', ku_sorani: 'شایەتحاڵی فیستیڤاڵی ئاگرینی نەورۆزی ساڵانە بن لە چیاکانی ئاکرێ، هێمای ئازادی و نوێبوونەوە.', ku_kurmanji: 'Bibin şahidê festîvala agirê ya Newrozê ya salane li çiyayên Akrê, sembola azadî û nûbûnê.', ar: 'شاهد المهرجان الناري السنوي لنوروز على جبال عقرة، رمز الحرية والتجديد.' },
    date: '2025-03-20T18:00:00Z',
    imageUrl: 'https://picsum.photos/seed/newroz/600/400',
    category_id: 'festival',
    location_id: 'duhok',
    organizer: 'Akre Municipality',
  },
  {
    id: '2',
    title: { en: 'Erbil International Book Fair', ku_sorani: 'پێشانگای نێودەوڵەتی هەولێر بۆ کتێب', ku_kurmanji: 'Pêşangeha Pirtûkan a Navneteweyî ya Hewlêrê', ar: 'معرض أربيل الدولي للكتاب' },
    description: { en: 'A gathering of publishers, authors, and readers from around the world, celebrating literature and knowledge.', ku_sorani: 'کۆبوونەوەی بڵاوکاران، نووسەران و خوێنەران لە سەرتاسەری جیهان، بۆ ئاهەنگگێڕان بە ئەدەب و زانیاری.', ku_kurmanji: 'Civîneke weşanxane, nivîskar û xwendevanên ji seranserê cîhanê, ji bo pîrozkirina wêje û zanînê.', ar: 'ملتقى للناشرين والمؤلفين والقراء من جميع أنحاء العالم، احتفالاً بالأدب والمعرفة.' },
    date: '2025-04-15T10:00:00Z',
    imageUrl: 'https://picsum.photos/seed/bookfair/600/400',
    category_id: 'literature',
    location_id: 'erbil',
    organizer: 'Kurdistan Publishers Union',
  },
  {
    id: '3',
    title: { en: 'Diyarbakır Culture and Art Festival', ku_sorani: 'فیستیڤاڵی کلتوور و هونەری ئامەد', ku_kurmanji: 'Festîvala Çand û Hunerê ya Amedê', ar: 'مهرجان ديار بكر للثقافة والفن' },
    description: { en: 'A week-long celebration of Kurdish music, cinema, and art in the heart of Diyarbakır.', ku_sorani: 'ئاهەنگێکی هەفتەیی مۆسیقا، سینەما و هونەری کوردی لە دڵی ئامەد.', ku_kurmanji: 'Pîrozbahiyeke hefteyekê ya muzîk, sînema û hunera Kurdî li dilê Amedê.', ar: 'احتفال يستمر لمدة أسبوع بالموسيقى والسينما والفن الكردي في قلب ديار بكر.' },
    date: '2025-06-05T12:00:00Z',
    imageUrl: 'https://picsum.photos/seed/diyarbakir/600/400',
    category_id: 'art',
    location_id: 'diyarbakir',
    organizer: 'Diyarbakır Metropolitan Municipality',
  },
    {
    id: '4',
    title: { en: 'Traditional Halparke Night in Sulaymaniyah', ku_sorani: 'شەوی هەڵپەڕکێی ڕەسەن لە سلێمانی', ku_kurmanji: 'Şeva Halparke ya Gelerî li Silêmaniyê', ar: 'ليلة الهلبرجة التقليدية في السليمانية' },
    description: { en: 'Join an energetic night of traditional Kurdish group dance. Open to all skill levels.', ku_sorani: 'بەشداری بکەن لە شەوێکی پڕ وزەی سەمای گرووپی کوردی ڕەسەن. کراوەیە بۆ هەموو ئاستەکان.', ku_kurmanji: 'Tevlî şeveke enerjîk a govend û helbesta Kurdî ya kevneşopî bibin. Ji bo hemû astên jêhatîbûnê vekirî ye.', ar: 'انضم إلى ليلة مليئة بالطاقة من الرقص الجماعي الكردي التقليدي. مفتوح لجميع مستويات المهارة.' },
    date: '2025-07-22T19:00:00Z',
    imageUrl: 'https://picsum.photos/seed/halparke/600/400',
    category_id: 'music_dance',
    location_id: 'sulaymaniyah',
    organizer: 'Suli Cultural Center',
  },
  {
    id: '5',
    title: { en: 'Sanandaj Culinary Festival', ku_sorani: '', ku_kurmanji: '', ar: 'مهرجان سنندج للطهي' },
    description: { en: 'Taste the rich flavors of Rojhelati cuisine. Local chefs present traditional dishes.', ku_sorani: '', ku_kurmanji: '', ar: 'تذوق النكهات الغنية للمطبخ الروجهلاتي. يقدم الطهاة المحليون الأطباق التقليدية.' },
    date: '2025-08-10T11:00:00Z',
    imageUrl: 'https://picsum.photos/seed/food/600/400',
    category_id: 'food',
    location_id: 'sanandaj',
    organizer: 'Sanandaj Chamber of Commerce',
  },
];

const MOCK_PROFILE: OrganizerProfile = {
  id: 'org-123',
  name: 'Kurdistan Cultural Foundation',
  profilePictureUrl: 'https://picsum.photos/seed/kcf/200',
  biography: 'Dedicated to preserving and promoting Kurdish heritage through vibrant cultural events, festivals, and educational programs.',
  specializations: ['Newroz Celebrations', 'Traditional Music', 'Kurdish Literature'],
};

const MOCK_LAWYERS_RAW = [
  {
    id: 'lawyer-1',
    name: { en: 'Ahmad Hassan Ali', ku_sorani: 'ئەحمەد حەسەن عەلی', ku_kurmanji: 'Ehmed Hesen Elî', ar: 'أحمد حسن علي' },
    biography: { en: 'Experienced lawyer specializing in corporate and commercial law with over 15 years of practice in Iraq.', ku_sorani: 'پارێزەرێکی شارەزا لە یاسای کۆمپانیا و بازرگانی لەگەڵ زیاتر لە ١٥ ساڵ شارەزایی لە عێراق.', ku_kurmanji: 'Parêzerek pispor li ser yasaya şirket û bazirganiyê bi zêdî 15 salan tecrûbe li Îraqê.', ar: 'محامي خبير متخصص في قانون الشركات والقانون التجاري مع أكثر من 15 عامًا من الممارسة في العراق.' },
    practiceAreaIds: ['corporate', 'commercial', 'civil'],
    location_id: 'erbil',
    phoneNumber: '+964750123456',
    whatsapp: '+964750123456',
    email: 'ahmad.hassan@lawfirm.iq',
    profilePictureUrl: 'https://picsum.photos/seed/lawyer1/200',
    experienceYears: 15,
    languages: ['en', 'ku_sorani', 'ar'],
    isVerified: true,
    rating: 4.8,
    reviewCount: 42,
  },
  {
    id: 'lawyer-2',
    name: { en: 'Sara Mohammed Farid', ku_sorani: 'سارە محەمەد فەرید', ku_kurmanji: 'Sara Mihemed Ferîd', ar: 'سارة محمد فريد' },
    biography: { en: 'Family law specialist with expertise in divorce, custody, and inheritance cases. Dedicated to protecting family rights.', ku_sorani: 'پسپۆڕ لە یاسای خێزان لەگەڵ شارەزایی لە کێشەی جیابوونەوە، چاودێری و میرات. تەرخانکراو بۆ پاراستنی مافەکانی خێزان.', ku_kurmanji: 'Pispor li ser yasaya malbatê bi pisporiya li ser doza cûdabûnê, serokî û mirasê. Ji bo parastina mafên malbatê terkkirî.', ar: 'متخصصة في قانون الأسرة مع خبرة في قضايا الطلاق والحضانة والميراث. مكرسة لحماية حقوق الأسرة.' },
    practiceAreaIds: ['family', 'civil'],
    location_id: 'sulaymaniyah',
    phoneNumber: '+964751234567',
    whatsapp: '+964751234567',
    email: 'sara.mohammed@familylaw.iq',
    profilePictureUrl: 'https://picsum.photos/seed/lawyer2/200',
    experienceYears: 8,
    languages: ['en', 'ku_sorani', 'ku_kurmanji', 'ar'],
    isVerified: true,
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: 'lawyer-3',
    name: { en: 'Omar Khalil Ibrahim', ku_sorani: 'عومەر خەلیل ئیبراهیم', ku_kurmanji: 'Omer Xelîl Îbrahîm', ar: 'عمر خليل إبراهيم' },
    biography: { en: 'Criminal defense attorney with a strong track record in defending clients in complex criminal cases.', ku_sorani: 'پارێزەری بەرگری لە تاوان لەگەڵ کارنامەیەکی بەهێز لە بەرگریکردن لە موەکیلەکان لە کێشە تاوانییە ئاڵۆزەکان.', ku_kurmanji: 'Parêzerê bergrî li dijî cezayê bi karname ku bi hêz e li ser bergirîkirina muvekkîlan li doza cezayî yên tevlihev.', ar: 'محامي دفاع جنائي مع سجل قوي في الدفاع عن العملاء في القضايا الجنائية المعقدة.' },
    practiceAreaIds: ['criminal', 'civil'],
    location_id: 'duhok',
    phoneNumber: '+964752345678',
    email: 'omar.khalil@criminaldefense.iq',
    profilePictureUrl: 'https://picsum.photos/seed/lawyer3/200',
    experienceYears: 12,
    languages: ['en', 'ku_kurmanji', 'ar'],
    isVerified: true,
    rating: 4.6,
    reviewCount: 35,
  },
];


const seedData = () => {
    if (!localStorage.getItem(EVENTS_KEY)) {
        localStorage.setItem(EVENTS_KEY, JSON.stringify(MOCK_EVENTS_RAW));
    }
    if (!localStorage.getItem(PROFILE_KEY)) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(MOCK_PROFILE));
    }
    if (!localStorage.getItem(LAWYERS_KEY)) {
        localStorage.setItem(LAWYERS_KEY, JSON.stringify(MOCK_LAWYERS_RAW));
    }
};

// Initialize data on first load
seedData();

// --- Helper Functions ---

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getRawEvents = (): (Omit<Event, 'category' | 'location'> & { category_id: string; location_id: string; })[] => {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
}

const formatEvent = (rawEvent: any): Event => {
    const category = CATEGORIES.find(c => c.id === rawEvent.category_id);
    const location = LOCATIONS.find(l => l.id === rawEvent.location_id);
    if (!category || !location) {
        throw new Error(`Invalid category or location ID for event ${rawEvent.id}`);
    }
    return { ...rawEvent, category, location };
};

const getRawLawyers = (): (Omit<Lawyer, 'practiceAreas' | 'location'> & { practiceAreaIds: string[]; location_id: string; })[] => {
    return JSON.parse(localStorage.getItem(LAWYERS_KEY) || '[]');
};

const formatLawyer = (rawLawyer: any): Lawyer => {
    const practiceAreas = rawLawyer.practiceAreaIds.map((id: string) => PRACTICE_AREAS.find(pa => pa.id === id)).filter(Boolean);
    const location = LOCATIONS.find(l => l.id === rawLawyer.location_id);
    if (!location || practiceAreas.length === 0) {
        throw new Error(`Invalid practice areas or location ID for lawyer ${rawLawyer.id}`);
    }
    return { ...rawLawyer, practiceAreas, location };
};

// --- API Functions ---

export const getEvents = async (): Promise<Event[]> => {
    await simulateDelay(500); // Simulate network latency
    const rawEvents = getRawEvents();
    return rawEvents.map(formatEvent).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addEvent = async (eventData: Omit<Event, 'id' | 'imageUrl' | 'category' | 'location'> & { category_id: string; location_id: string }): Promise<Event> => {
    await simulateDelay(1000);
    const rawEvents = getRawEvents();
    const newEventRaw = {
        ...eventData,
        id: `evt-${Date.now()}`,
        imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
        date: new Date(eventData.date).toISOString(),
    };
    rawEvents.unshift(newEventRaw);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(rawEvents));
    return formatEvent(newEventRaw);
};

export const getOrganizerProfile = async (): Promise<OrganizerProfile> => {
    await simulateDelay(300);
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
};

export const updateOrganizerProfile = async (profileData: OrganizerProfile): Promise<OrganizerProfile> => {
    await simulateDelay(700);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
    return profileData;
};

// --- Lawyer API Functions ---

export const getLawyers = async (): Promise<Lawyer[]> => {
    await simulateDelay(500);
    const rawLawyers = getRawLawyers();
    return rawLawyers.map(formatLawyer).sort((a, b) => b.rating! - a.rating!);
};

export const addLawyer = async (lawyerData: Omit<Lawyer, 'id' | 'profilePictureUrl' | 'practiceAreas' | 'location'> & { practiceAreaIds: string[]; location_id: string }): Promise<Lawyer> => {
    await simulateDelay(1000);
    const rawLawyers = getRawLawyers();
    const newLawyerRaw = {
        ...lawyerData,
        id: `lawyer-${Date.now()}`,
        profilePictureUrl: `https://picsum.photos/seed/lawyer${Date.now()}/200`,
    };
    rawLawyers.unshift(newLawyerRaw);
    localStorage.setItem(LAWYERS_KEY, JSON.stringify(rawLawyers));
    return formatLawyer(newLawyerRaw);
};
