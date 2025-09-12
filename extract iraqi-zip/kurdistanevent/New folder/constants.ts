import type { Category, Location, PracticeArea, Translations, Language } from './types';

export const CATEGORIES: Category[] = [
  { id: 'music_dance', name: { en: 'Music & Dance', ku_sorani: 'مۆسیقا و سه‌ما', ku_kurmanji: 'Muzîk & Dans', ar: 'موسيقى ورقص' } },
  { id: 'festival', name: { en: 'Cultural Festivals', ku_sorani: 'فیستیڤاڵە کلتوورییەکان', ku_kurmanji: 'Festîvalên Çandî', ar: 'مهرجانات ثقافية' } },
  { id: 'art', name: { en: 'Art & Exhibitions', ku_sorani: 'هونەر و پێشانگا', ku_kurmanji: 'Huner & Pêşangeh', ar: 'فن ومعارض' } },
  { id: 'literature', name: { en: 'Literature & Poetry', ku_sorani: 'ئەدەب و شیعر', ku_kurmanji: 'Wêje & Helbest', ar: 'أدب وشعر' } },
  { id: 'food', name: { en: 'Food Festivals', ku_sorani: 'فیستیڤاڵی خواردن', ku_kurmanji: 'Festîvalên Xwarinê', ar: 'مهرجانات الطعام' } },
  { id: 'film', name: { en: 'Film & Cinema', ku_sorani: 'فیلم و سینەما', ku_kurmanji: 'Fîlm & Sînema', ar: 'أفلام وسينما' } },
  { id: 'history', name: { en: 'Historical Tours', ku_sorani: 'گەشتی مێژوویی', ku_kurmanji: 'Gerên Dîrokî', ar: 'جولات تاريخية' } },
  { id: 'sports', name: { en: 'Sports & Community', ku_sorani: 'وەرزش و کۆمەڵگە', ku_kurmanji: 'Werzîş & Civak', ar: 'رياضة ومجتمع' } },
];

export const LOCATIONS: Location[] = [
  { id: 'erbil', name: { en: 'Erbil', ku_sorani: 'هەولێر', ku_kurmanji: 'Hewlêr', ar: 'أربيل' }, region: 'KRI' },
  { id: 'sulaymaniyah', name: { en: 'Sulaymaniyah', ku_sorani: 'سلێمانی', ku_kurmanji: 'Silêmanî', ar: 'السليمانية' }, region: 'KRI' },
  { id: 'duhok', name: { en: 'Duhok', ku_sorani: 'دهۆک', ku_kurmanji: 'Duhok', ar: 'دهوك' }, region: 'KRI' },
  { id: 'halabja', name: { en: 'Halabja', ku_sorani: 'هەڵەبجە', ku_kurmanji: 'Helebce', ar: 'حلبجة' }, region: 'KRI' },
  { id: 'diyarbakir', name: { en: 'Diyarbakır', ku_sorani: 'ئامەد', ku_kurmanji: 'Amed', ar: 'ديار بكر' }, region: 'Turkey' },
  { id: 'mardin', name: { en: 'Mardin', ku_sorani: 'مێردین', ku_kurmanji: 'Mêrdîn', ar: 'ماردين' }, region: 'Turkey' },
  { id: 'sanandaj', name: { en: 'Sanandaj', ku_sorani: 'سنە', ku_kurmanji: 'Sine', ar: 'سنندج' }, region: 'Iran' },
  { id: 'kermanshah', name: { en: 'Kermanshah', ku_sorani: 'کرماشان', ku_kurmanji: 'Kirmaşan', ar: 'كرمانشاه' }, region: 'Iran' },
  { id: 'qamishli', name: { en: 'Qamishli', ku_sorani: 'قامشلۆ', ku_kurmanji: 'Qamişlo', ar: 'القامشلي' }, region: 'Syria' },
];

export const PRACTICE_AREAS: PracticeArea[] = [
  { id: 'corporate', name: { en: 'Corporate Law', ku_sorani: 'یاسای کۆمپانیا', ku_kurmanji: 'Yasaya Şirketî', ar: 'قانون الشركات' } },
  { id: 'criminal', name: { en: 'Criminal Law', ku_sorani: 'یاسای تاوان', ku_kurmanji: 'Yasaya Cezayî', ar: 'القانون الجنائي' } },
  { id: 'civil', name: { en: 'Civil Law', ku_sorani: 'یاسای مەدەنی', ku_kurmanji: 'Yasaya Sivîl', ar: 'القانون المدني' } },
  { id: 'family', name: { en: 'Family Law', ku_sorani: 'یاسای خێزان', ku_kurmanji: 'Yasaya Malbatê', ar: 'قانون الأسرة' } },
  { id: 'real_estate', name: { en: 'Real Estate Law', ku_sorani: 'یاسای خانووبەرە', ku_kurmanji: 'Yasaya Mûlkê', ar: 'قانون العقارات' } },
  { id: 'commercial', name: { en: 'Commercial Law', ku_sorani: 'یاسای بازرگانی', ku_kurmanji: 'Yasaya Bazirganiyê', ar: 'القانون التجاري' } },
  { id: 'labor', name: { en: 'Labor Law', ku_sorani: 'یاسای کار', ku_kurmanji: 'Yasaya Karê', ar: 'قانون العمل' } },
  { id: 'immigration', name: { en: 'Immigration Law', ku_sorani: 'یاسای کۆچبەری', ku_kurmanji: 'Yasaya Koçberiyê', ar: 'قانون الهجرة' } },
];

export const UI_TRANSLATIONS: Translations = {
  find_lawyers: { en: 'Find Lawyers', ku_sorani: 'پارێزەرەکان بدۆزەرەوە', ku_kurmanji: 'Parêzeran Bibînin', ar: 'العثور على المحامين' },
  lawyer_dashboard: { en: 'Lawyer Dashboard', ku_sorani: 'داشبۆردی پارێزەر', ku_kurmanji: 'Dashboarda Parêzer', ar: 'لوحة تحكم المحامي' },
  smart_search_placeholder: { en: 'e.g., "family law lawyer in Erbil"', ku_sorani: 'بۆ نموونە، "پارێزەری یاسای خێزان لە هەولێر"', ku_kurmanji: 'mînak, "parêzerê yasaya malbatê li Hewlêrê"', ar: 'مثال: "محامي قانون الأسرة في أربيل"' },
  search: { en: 'Search', ku_sorani: 'گەڕان', ku_kurmanji: 'Lêgerîn', ar: 'بحث' },
  clear_results: { en: 'Clear AI Results', ku_sorani: 'ئەنجامەکان بسڕەوە', ku_kurmanji: 'Encaman Paqij bike', ar: 'مسح نتائج الذكاء الاصطناعي' },
  filter_by_practice_area: { en: 'Filter by Practice Area', ku_sorani: 'فلتەر بەپێی بواری شارەزایی', ku_kurmanji: 'Parzûnkirin li gorî Warê Pispor', ar: 'تصفية حسب مجال الممارسة' },
  filter_by_location: { en: 'Filter by Location', ku_sorani: 'فلتەر بەپێی شوێن', ku_kurmanji: 'Parzûnkirin li gorî Cihê', ar: 'تصفية حسب الموقع' },
  no_lawyers_found: { en: 'No lawyers match your current filters.', ku_sorani: 'هیچ پارێزەرێک لەگەڵ فلتەرەکانتدا ناگونجێت.', ku_kurmanji: 'Tu parêzer bi parzûnên we re li hev nakin.', ar: 'لا يوجد محامون يطابقون عوامل التصفية الحالية.' },
  ai_results_title: { en: 'AI-Powered Suggestions', ku_sorani: 'پێشنیارەکانی زیرەکی دەستکرد', ku_kurmanji: 'Pêşniyarên AI-ê', ar: 'اقتراحات مدعومة بالذكاء الاصطناعي' },
  all_day: { en: 'All Day', ku_sorani: 'هەموو ڕۆژ', ku_kurmanji: 'Tevahiya Rojê', ar: 'طوال اليوم' },
  language: { en: 'Language', ku_sorani: 'زمان', ku_kurmanji: 'Ziman', ar: 'لغة' },
};

export const LANGUAGES: { code: Language; name: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
    { code: 'ku_sorani', name: 'Kurdî (Soranî)', flag: '🟨🔴🟢', dir: 'rtl' },
    { code: 'ku_kurmanji', name: 'Kurdî (Kurmancî)', flag: '🇹🇷', dir: 'ltr' }, // using TR flag for Kurmanji as per prompt
    { code: 'ar', name: 'العربية', flag: '🇮🇶', dir: 'rtl' },
];
