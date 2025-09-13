import { User, Event, Category, Language, City, Sponsor, Banner, Message } from '../types';

// ===================================================================================
// CRITICAL SECURITY NOTE (FROM AUDIT)
// ===================================================================================
// This mock API uses `localStorage` for all data persistence, excluding the auth token.
// This is INSECURE and intended for development and prototyping purposes ONLY.
//
// In a production environment:
// 1. All data must be stored in a secure, server-side database.
// 2. Authentication tokens MUST be handled using secure, HttpOnly cookies to
//    mitigate XSS (Cross-Site Scripting) vulnerabilities.
// ===================================================================================


// --- MOCK TRANSLATIONS ---
const translations: Record<string, Record<Language, string>> = {
    // Categories
    'category.social': { en: 'Social Events', ar: 'فعاليات اجتماعية', ku: 'چاڵاکی کۆمەڵایەتی' },
    'category.music': { en: 'Live Music', ar: 'موسيقى حية', ku: 'مۆسیقای ڕاستەوخۆ' },
    'category.wellness': { en: 'Yoga & Wellness', ar: 'يوجا وصحة', ku: 'یۆگا و تەندروستی' },
    'category.sports': { en: 'Sports & Fitness', ar: 'رياضة ولياقة', ku: 'وەرزش و لەشجوانی' },
    'category.festivals': { en: 'Festivals', ar: 'مهرجانات', ku: 'فیستیڤاڵەکان' },
    'category.local-tourism': { en: 'Local Tourism', ar: 'سياحة محلية', ku: 'گەشتیاری ناوخۆیی' },
    'category.international-tourism': { en: 'International Tourism', ar: 'سياحة دولية', ku: 'گەشتیاری نێودەوڵەتی' },
    'category.entrepreneurship': { en: 'Entrepreneurship & Networking', ar: 'ريادة الأعمال والتواصل', ku: 'کارسازی و تۆڕسازی' },
    'category.conferences': { en: 'Conferences', ar: 'مؤتمرات', ku: 'کۆنفرانسەکان' },
    'category.art-culture': { en: 'Art & Culture', ar: 'فن وثقافة', ku: 'هونەر و ڕۆشنبیری' },
    // Header
    'header.title1': { en: 'Kurdistan/Iraq', ar: 'كوردستان/العراق', ku: 'کوردستان/عێراق' },
    'header.title2': { en: 'Events', ar: 'للفعاليات', ku: 'ئیڤێنت' },
    'header.welcome': { en: 'Welcome, {name}', ar: 'مرحباً، {name}', ku: 'بەخێربێیت، {name}' },
    'header.createEvent': { en: 'Create Event', ar: 'أنشئ فعالية', ku: 'دروستکردنی ڕووداو' },
    'header.loginSignUp': { en: 'Login / Sign Up', ar: 'تسجيل الدخول / اشتراك', ku: 'چوونەژوورەوە / خۆتۆمارکردن' },
    'header.help': { en: 'Help', ar: 'مساعدة', ku: 'یارمەتی' },
    // Welcome Page
    'welcome.login': { en: 'Login', ar: 'تسجيل الدخول', ku: 'چوونەژوورەوە' },
    'welcome.signup': { en: 'Sign Up', ar: 'اشتراك', ku: 'خۆتۆمارکردن' },
    'welcome.welcomeBack': { en: 'Welcome Back!', ar: 'مرحباً بعودتك!', ku: 'بەخێربێیتەوە!' },
    'welcome.createAccount': { en: 'Create Your Account', ar: 'أنشئ حسابك', ku: 'هەژماری خۆت دروست بکە' },
    'welcome.nameLabel': { en: 'Name', ar: 'الاسم', ku: 'ناو' },
    'welcome.emailLabel': { en: 'Email', ar: 'البريد الإلكتروني', ku: 'ئیمەیڵ' },
    'welcome.passwordLabel': { en: 'Password', ar: 'كلمة المرور', ku: 'وشەی نهێنی' },
    'welcome.signInWithGoogle': { en: 'Sign in with Google', ar: 'تسجيل الدخول باستخدام جوجل', ku: 'چوونەژوورەوە بە گووگڵ' },
    'welcome.forgotPassword': { en: 'Forgot Password?', ar: 'هل نسيت كلمة المرور؟', ku: 'وشەی نهێنیت لەبیرچووە؟' },
    'welcome.resetPasswordTitle': { en: 'Reset Your Password', ar: 'إعادة تعيين كلمة المرور', ku: 'وشەی نهێنی نوێ بکەرەوە' },
    'welcome.resetPasswordInstructions': { en: 'Enter your email and we will send you a link to reset your password.', ar: 'أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.', ku: 'ئیمەیڵەکەت بنووسە و ئێمە لینکێکت بۆ دەنێرین بۆ نوێکردنەوەی وشەی نهێنی.' },
    'welcome.sendResetLink': { en: 'Send Reset Link', ar: 'إرسال رابط إعادة التعيين', ku: 'ناردنی لینکی نوێکردنەوە' },
    'welcome.resetLinkSent': { en: 'If an account exists for this email, a password reset link has been sent.', ar: 'إذا كان هناك حساب لهذا البريد الإلكتروني، فقد تم إرسال رابط إعادة تعيين كلمة المرور.', ku: 'ئەگەر هەژمارێک بۆ ئەم ئیمەیڵە هەبێت، لینکی نوێکردنەوەی وشەی نهێنی نێردراوە.' },
    'welcome.backToLogin': { en: 'Back to Login', ar: 'العودة إلى تسجيل الدخول', ku: 'گەڕانەوە بۆ چوونەژوورەوە' },
    'welcome.registerAs': { en: 'Register as', ar: 'التسجيل كـ', ku: 'خۆتۆمارکردن وەک' },
    'welcome.attendee': { en: 'Attendee', ar: 'حاضر', ku: 'بەشداربوو' },
    'welcome.host': { en: 'Host / Business', ar: 'مضيف / عمل', ku: 'میواندار / بازرگانی' },
    'welcome.businessNameLabel': { en: 'Business Name', ar: 'اسم العمل', ku: 'ناوی بازرگانی' },
    'welcome.phoneLabel': { en: 'Phone Number', ar: 'رقم الهاتف', ku: 'ژمارەی تەلەفۆن' },
    'welcome.websiteLabel': { en: 'Website (Optional)', ar: 'الموقع الإلكتروني (اختياري)', ku: 'ماڵپەڕ (ئارەزوومەندانە)' },
    'welcome.businessAddressLabel': { en: 'Official Business Address', ar: 'عنوان العمل الرسمي', ku: 'ناونیشانی فەرمی بازرگانی' },
    'welcome.organizerTypeLabel': { en: 'Type of Organizer', ar: 'نوع المنظم', ku: 'جۆری ڕێکخەر' },
    'welcome.selectOrganizerType': { en: 'Select a type...', ar: 'اختر نوعًا...', ku: 'جۆرێک هەڵبژێرە...' },
    'welcome.agreeToTerms': { en: 'I agree to the Terms of Service and Privacy Policy', ar: 'أوافق على شروط الخدمة وسياسة الخصوصية', ku: 'ڕازیم بە مەرجەکانی خزمەتگوزاری و سیاسەتی تایبەتمەندی' },
    'organizerType.venue': { en: 'Music Venue', ar: 'مكان موسيقى', ku: 'شوێنی مۆسیقا' },
    'organizerType.instructor': { en: 'Yoga Instructor', ar: 'مدرب يوجا', ku: 'ڕاهێنەری یۆگا' },
    'organizerType.foodVendor': { en: 'Food Vendor', ar: 'بائع طعام', ku: 'فرۆشیاری خواردن' },
    'organizerType.conference': { en: 'Conference Company', ar: 'شركة مؤتمرات', ku: 'کۆمپانیای کۆنفرانس' },
    'organizerType.nonProfit': { en: 'Non-Profit Organization', ar: 'منظمة غير ربحية', ku: 'ڕێکخراوی ناحکومی' },
    'organizerType.other': { en: 'Other', ar: 'آخر', ku: 'هیتر' },
    // Home Page
    'home.title': { en: 'Upcoming Events', ar: 'الفعاليات القادمة', ku: 'ڕووداوەکانی داهاتوو' },
    'home.newEvent': { en: 'New Event', ar: 'فعالية جديدة', ku: 'ڕووداوی نوێ' },
    'home.all': { en: 'All', ar: 'الكل', ku: 'هەمووی' },
    'home.noEventsFound': { en: 'No Events Found', ar: 'لم يتم العور على فعاليات', ku: 'هیچ ڕووداوێک نەدۆزرایەوە' },
    'home.noEventsInCategory': { en: 'There are no events in this category. Try selecting another one!', ar: 'لا توجد فعاليات في هذه الفئة. حاول اختيار فئة أخرى!', ku: 'هیچ ڕووداوێک لەم پۆلەدا نییە. هەوڵی هەڵبژاردنی یەکێکی تر بدە!' },
    'home.allIraq': { en: 'All Iraq', ar: 'كل العراق', ku: 'هەموو عێراق' },
    'home.noEventsInCity': { en: 'There are no events in this city for the selected category.', ar: 'لا توجد فعاليات في هذه المدينة للفئة المحددة.', ku: 'هیچ ڕووداوێک لەم شارەدا نییە بۆ پۆلی هەڵبژێردراو.' },
    'verification.pendingTitle': { en: 'Account Pending Review', ar: 'الحساب قيد المراجعة', ku: 'هەژمار چاوەڕوانی پێداچوونەوەیە' },
    'verification.pendingMessage': { en: 'Your host profile has been submitted and is pending review by our team. You will be notified once it is approved.', ar: 'تم تقديم ملفك التعريفي كمضيف وهو في انتظار المراجعة من قبل فريقنا. سيتم إعلامك بمجرد الموافقة عليه.', ku: 'پڕۆفایلی میوانداری تۆ پێشکەش کراوە و چاوەڕوانی پێداچوونەوەیە لەلایەن تیمی ئێمەوە. کاتێک پەسەند دەکرێت ئاگادار دەکرێیتەوە.' },
    // Event Card
    'eventCard.createdBy': { en: 'Created by {name}', ar: 'أنشأها {name}', ku: 'دروستکراوە لەلایەن {name}' },
    'eventCard.sponsored': { en: 'Sponsored', ar: 'برعاية', ku: 'سپۆنسەر' },
    'eventCard.sponsoredTooltip': { en: 'This is a promoted listing from our partners.', ar: 'هذا إعلان ممول من شركائنا.', ku: 'ئەمە لیستێکی بەرزکراوەیە لە هاوبەشەکانمانەوە.' },
    'category.sponsoredBy': { en: 'Sponsored by {name}', ar: 'برعاية {name}', ku: 'بە سپۆنسەری {name}' },
    // Create Event Page
    'createEvent.title': { en: 'Create New Event', ar: 'إنشاء فعالية جديدة', ku: 'دروستکردنی ڕووداوی نوێ' },
    'createEvent.eventTitleLabel': { en: 'Event Title', ar: 'عنوان الفعالية', ku: 'ناوی ڕووداو' },
    'createEvent.descriptionLabel': { en: 'Description', ar: 'الوصف', ku: 'وەسف' },
    'createEvent.cityLabel': { en: 'City', ar: 'المدينة', ku: 'شار' },
    'createEvent.selectCity': { en: 'Select a city', ar: 'اختر مدينة', ku: 'شارێک هەڵبژێرە' },
    'createEvent.categoryLabel': { en: 'Category', ar: 'الفئة', ku: 'پۆل' },
    'createEvent.selectCategory': { en: 'Select a category', ar: 'اختر فئة', ku: 'پۆلێک هەڵبژێرە' },
    'createEvent.dateLabel': { en: 'Date', ar: 'التاريخ', ku: 'بەروار' },
    'createEvent.timeLabel': { en: 'Time', ar: 'الوقت', ku: 'کات' },
    'createEvent.locationLabel': { en: 'Location', ar: 'الموقع', ku: 'شوێن' },
    'createEvent.imageLabel': { en: 'Event Image', ar: 'صورة الفعالية', ku: 'وێنەی ڕووداو' },
    'createEvent.uploadPhoto': { en: 'Upload Photo', ar: 'تحميل صورة', ku: 'وێنە باربکە' },
    'createEvent.changePhoto': { en: 'Change Photo', ar: 'تغيير الصورة', ku: 'گۆڕینی وێنە' },
    'createEvent.submitButton': { en: 'Create Event', ar: 'إنشاء الفعالية', ku: 'دروستکردنی ڕووداو' },
    'createEvent.locationPlaceholder': { en: 'Search for a location...', ar: 'ابحث عن موقع...', ku: 'بۆ شوێنێک بگەڕێ...' },
    'createEvent.error.dateTime': { en: 'Please select both a date and a time.', ar: 'يرجى تحديد التاريخ والوقت.', ku: 'تکایە بەروار و کات هەڵبژێرە.' },
    'createEvent.error.city': { en: 'Please select an event city.', ar: 'يرجى تحديد مدينة الفعالية.', ku: 'تکایە شاری ڕووداو هەڵبژێرە.' },
    'createEvent.error.category': { en: 'Please select an event category.', ar: 'يرجى تحديد فئة الفعالية.', ku: 'تکایە پۆلی ڕووداو هەڵبژێرە.' },
    'createEvent.error.image': { en: 'Please upload an event image.', ar: 'يرجى تحميل صورة للفعالية.', ku: 'تکایە وێنەی ڕووداو باربکە.' },
    'createEvent.error.location': { en: 'Please select an event location from the map search.', ar: 'يرجى تحديد موقع الفعالية من بحث الخريطة.', ku: 'تکایە شوێنی ڕووداو لە نەخشە هەڵبژێرە.' },
    'createEvent.error.englishRequired': { en: 'English title and description are required.', ar: 'العنوان والوصف باللغة الإنجليزية مطلوبان.', ku: 'سەردێڕ و وەسفی ئینگلیزی پێویستە.' },
    'createEvent.unverifiedHost': { en: 'Your account is under review. You cannot create events yet.', ar: 'حسابك قيد المراجعة. لا يمكنك إنشاء فعاليات بعد.', ku: 'هەژمارەکەت لە ژێر پێداچوونەوەدایە. هێشتا ناتوانیت بۆنە دروست بکەیت.' },
    'createEvent.completeProfileTitle': { en: 'Complete Your Host Profile', ar: 'أكمل ملفك التعريفي كمضيف', ku: 'پڕۆفایلی میوانداری خۆت تەواو بکە' },
    'createEvent.completeProfileMessage': { en: 'To create events, please provide some details about your business. Our team will review your information shortly.', ar: 'لإنشاء فعاليات، يرجى تقديم بعض التفاصيل حول عملك. سيقوم فريقنا بمراجعة معلوماتك قريبًا.', ku: 'بۆ دروستکردنی بۆنە، تکایە هەندێک زانیاری دەربارەی بازرگانییەکەت پێشکەش بکە. تیمەکەمان بە زوویی زانیارییەکانت پێداچوونەوە دەکات.' },
    'createEvent.submitProfileButton': { en: 'Submit for Review', ar: 'إرسال للمراجعة', ku: 'ناردن بۆ پێداچوونەوە' },
    // Event Details Page
    'eventDetails.back': { en: 'Back to Events', ar: 'العودة للفعاليات', ku: 'گەڕانەوە بۆ ڕووداوەکان' },
    'eventDetails.city': { en: 'City', ar: 'المدينة', ku: 'شار' },
    'eventDetails.location': { en: 'Location', ar: 'الموقع', ku: 'شوێن' },
    'eventDetails.about': { en: 'About this event', ar: 'عن هذه الفعالية', ku: 'دەربارەی ئەم ڕووداوە' },
    'eventDetails.organizer': { en: 'Event Organizer', ar: 'منظم الفعالية', ku: 'ڕێکخەری ڕووداو' },
    'eventDetails.contactOrganizer': { en: 'Contact Organizer', ar: 'اتصل بالمنظم', ku: 'پەیوەندی بە ڕێکخەر' },
    'eventDetails.notFound': { en: 'Event not found.', ar: 'لم يتم العثور على الفعالية.', ku: 'ڕووداوەکە نەدۆزرایەوە.' },
    'eventDetails.share': { en: 'Share', ar: 'مشاركة', ku: 'هاوبەشی پێبکە' },
    'eventDetails.attend': { en: 'Attend Event', ar: 'حضور الفعالية', ku: 'بەشداری بکە' },
    'eventDetails.attending': { en: "You're Attending", ar: 'أنت حاضر', ku: 'تۆ بەشداری' },
    'eventDetails.whosGoing': { en: "Who's Going", ar: 'من سيحضر', ku: 'کێ بەشدارە' },
    'eventDetails.noAttendees': { en: 'Be the first to mark your attendance!', ar: 'كن أول من يسجل حضوره!', ku: 'یەکەم کەس بە ئامادەبوونی خۆت نیشان بدە!' },
    'share.teaser': { en: 'Check out this awesome event at the Kurdistan Connect Festival!', ar: 'اطلع على هذا الحدث الرائع في مهرجان كردستان كونكت!', ku: 'سەیری ئەم بۆنە نایابە بکە لە فێستیڤاڵی کوردستان کۆنێکت!' },
    'share.eventInfo': { en: '📌 {eventName} on {eventDate}', ar: '📌 {eventName} في {eventDate}', ku: '📌 {eventName} لە {eventDate}' },
    'share.cta': { en: 'Download the Kurdistan Connect app to see full details and get your tickets! 👇', ar: 'قم بتنزيل تطبيق كردستان كونكت للاطلاع على التفاصيل الكاملة والحصول على تذاكرك! 👇', ku: 'ئەپی کوردستان کۆنێکت دابەزێنە بۆ بینینی وردەکاری تەواو و وەرگرتنی بلیتەکانت! 👇' },
    // Messages Page
    'messages.title': { en: 'Conversation with {name}', ar: 'محادثة مع {name}', ku: 'گفتوگۆ لەگەڵ {name}' },
    'messages.adminTitle': { en: 'Help & Support', ar: 'المساعدة والدعم', ku: 'یارمەتی و پشتگیری' },
    'messages.inputPlaceholder': { en: 'Type a message...', ar: 'اكتب رسالة...', ku: 'نامەیەک بنووسە...' },
    'messages.send': { en: 'Send', ar: 'إرسال', ku: 'ناردن' },
    'messages.noMessages': { en: 'No messages yet. Start the conversation!', ar: 'لا توجد رسائل بعد. ابدأ المحادثة!', ku: 'هێشتا هیچ نامەیەک نییە. گفتوگۆکە دەست پێبکە!' },
    'messages.back': { en: 'Back', ar: 'رجوع', ku: 'گەڕانەوە' },
    // Not Found Page
    'notFound.title': { en: 'Page Not Found', ar: 'الصفحة غير موجودة', ku: 'لاپەڕەکە نەدۆزرایەوە' },
    'notFound.subtitle': { en: 'Sorry, the page you are looking for does not exist.', ar: 'عذراً، الصفحة التي تبحث عنها غير موجودة.', ku: 'ببورە، ئەو لاپەڕەیەی بەدوایدا دەگەڕێیت بوونی نییە.' },
    'notFound.goHome': { en: 'Go Back Home', ar: 'العودة إلى الرئيسية', ku: 'بگەڕێوە بۆ سەرەتا' },
    'banner.ad': { en: 'Ad', ar: 'إعلان', ku: 'ڕیکلام' },
    // Privacy Policy Page
    'privacy.title': { en: 'Privacy Policy', ar: 'سياسة الخصوصية', ku: 'سیاسەتی تایبەتمەندی' },
    'privacy.lastUpdated': { en: 'Last Updated: {date}', ar: 'آخر تحديث: {date}', ku: 'دوا نوێکردنەوە: {date}' },
    'privacy.section1.title': { en: '1. Information We Collect', ar: '١. المعلومات التي نجمعها', ku: '١. ئەو زانیاریانەی کۆیدەکەینەوە' },
    'privacy.section1.content': { en: 'We collect information you provide directly to us, such as when you create an account, create or share events, and communicate with us. This may include your name, email address, and any messages or content you provide.', ar: 'نحن نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب، أو إنشاء أو مشاركة الفعاليات، والتواصل معنا. قد يشمل ذلك اسمك وعنوان بريدك الإلكتروني وأي رسائل أو محتوى تقدمه.', ku: 'ئێمە ئەو زانیاریانە کۆدەکەینەوە کە ڕاستەوخۆ پێمان دەدەیت، وەک کاتێک هەژمارێک دروست دەکەیت، بۆنە دروست دەکەیت یان هاوبەشی پێدەکەیت، و پەیوەندیمان پێوە دەکەیت. ئەمە لەوانەیە ناوی تۆ، ناونیشانی ئیمەیڵ، و هەر نامە یان ناوەڕۆکێک کە پێشکەشی دەکەیت لەخۆ بگرێت.' },
    'privacy.section2.title': { en: '2. How We Use Your Information', ar: '٢. كيف نستخدم معلوماتك', ku: '٢. چۆن زانیارییەکانت بەکاردەهێنین' },
    'privacy.section2.content': { en: 'We use the information we collect to operate, maintain, and provide you the features and functionality of the Service, as well as to communicate directly with you, such as to send you email messages and push notifications.', ar: 'نحن نستخدم المعلومات التي نجمعها لتشغيل وصيانة وتوفير ميزات ووظائف الخدمة لك، وكذلك للتواصل المباشر معك، مثل إرسال رسائل بريد إلكتروني وإشعارات.', ku: 'ئێمە ئەو زانیاریانەی کۆیدەکەینەوە بۆ کارپێکردن، پاراستن، و پێشکەشکردنی تایبەتمەندی و کاراییەکانی خزمەتگوزارییەکە بە تۆ، هەروەها بۆ پەیوەندیکردنی ڕاستەوخۆ لەگەڵت، وەک ناردنی نامەی ئیمەیڵ و ئاگادارکردنەوەکان.' },
    // Page Metadata
    'meta.home.title': { en: 'Kurdistan/Iraq Events | Find & Share Local Events', ar: 'فعاليات كردستان/العراق | ابحث وشارك الفعاليات المحلية', ku: 'ئیڤێنتەکانی کوردستان/عێراق | دۆزینەوە و بڵاوکردنەوەی بۆنە ناوخۆییەکان' },
    'meta.home.description': { en: 'Discover upcoming events in Erbil, Sulaymaniyah, Duhok, and across all of Iraq. From festivals to conferences, find what\'s happening near you.', ar: 'اكتشف الفعاليات القادمة في أربيل والسليمانية ودهوك وجميع أنحاء العراق. من المهرجانات إلى المؤتمرات، اكتشف ما يحدث بالقرب منك.', ku: 'بۆنەکانی داهاتوو لە هەولێر، سلێمانی، دهۆک و سەرتاسەری عێراق بدۆزەرەوە. لە فیستیڤاڵەکانەوە تا کۆنفرانسەکان، بزانە چی لە نزیکی تۆ ڕوودەدات.' },
    'meta.create.title': { en: 'Create a New Event | Kurdistan/Iraq Events', ar: 'إنشاء فعالية جديدة | فعاليات كردستان/العراق', ku: 'دروستکردنی بۆنەیەکی نوێ | ئیڤێنتەکانی کوردستان/عێراق' },
    'meta.create.description': { en: 'Promote your event to the community. Fill out the details to create and publish your event on the Kurdistan/Iraq Events platform.', ar: 'روّج لفعاليتك للمجتمع. املأ التفاصيل لإنشاء ونشر فعاليتك على منصة فعاليات كردستان/العراق.', ku: 'بۆنەکەت بە کۆمەڵگا بناسێنە. زانیارییەکان پڕبکەرەوە بۆ دروستکردن و بڵاوکردنەوەی بۆنەکەت لەسەر پلاتفۆرمی ئیڤێنتەکانی کوردستان/عێراق.' },
    'meta.event.title': { en: '{eventName} | Kurdistan/Iraq Events', ar: '{eventName} | فعاليات كردستان/العراق', ku: '{eventName} | ئیڤێنتەکانی کوردستان/عێراق' },
    'meta.event.description': { en: 'View details for {eventName}, including date, time, location, and organizer information. Join the community and see what\'s happening.', ar: 'اطلع على تفاصيل {eventName}، بما في ذلك التاريخ والوقت والموقع ومعلومات المنظم. انضم إلى المجتمع وشاهد ما يحدث.', ku: 'وردەکارییەکانی {eventName} ببینە، لەوانە بەروار، کات، شوێن، و زانیاری ڕێکخەر. بەشداربە لە کۆمەڵگا و ببینە چی ڕوودەدات.' },
    'meta.welcome.title': { en: 'Login or Sign Up | Kurdistan/Iraq Events', ar: 'تسجيل الدخول أو الاشتراك | فعاليات كردستان/العراق', ku: 'چوونەژوورەوە یان خۆتۆمارکردن | ئیڤێنتەکانی کوردستان/عێراق' },
    'meta.welcome.description': { en: 'Join the Kurdistan/Iraq Events community. Log in to your account or sign up to start discovering and creating local events.', ar: 'انضم إلى مجتمع فعاليات كردستان/العراق. سجل الدخول إلى حسابك أو اشترك لبدء اكتشاف وإنشاء الفعاليات المحلية.', ku: 'بەشداربە لە کۆمەڵگای ئیڤێنتەکانی کوردستان/عێراق. بچۆ ژوورەوە بۆ هەژمارەکەت یان خۆتۆماربکە بۆ دەستپێکردنی دۆزینەوە و دروستکردنی بۆنە ناوخۆییەکان.' },
    'meta.notFound.title': { en: 'Page Not Found (404) | Kurdistan/Iraq Events', ar: 'الصفحة غير موجودة (404) | فعاليات كردستان/العراق', ku: 'لاپەڕە نەدۆزرایەوە (404) | ئیڤێنتەکانی کوردستان/عێراق' },
    'meta.notFound.description': { en: 'The page you are looking for does not exist or has been moved. Return to the homepage to find more events.', ar: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها. ارجع إلى الصفحة الرئيسية للعثور على المزيد من الفعاليات.', ku: 'ئەو لاپەڕەیەی بەدوایدا دەگەڕێیت بوونی نییە یان گواستراوەتەوە. بگەڕێوە بۆ لاپەڕەی سەرەki بۆ دۆزینەوەی بۆنەی زیاتر.' },
    'meta.privacy.title': { en: 'Privacy Policy | Kurdistan/Iraq Events', ar: 'سياسة الخصوصية | فعاليات كردستان/العراق', ku: 'سیاسەتی تایبەتمەندی | ئیڤێنتەکانی کوردستان/عێراق' },
    'meta.privacy.description': { en: 'Read our privacy policy to understand how we collect, use, and protect your data on the Kurdistan/Iraq Events platform.', ar: 'اقرأ سياسة الخصوصية الخاصة بنا لفهم كيفية جمعنا واستخدامنا وحمايتنا لبياناتك على منصة فعاليات كردستان/العراق.', ku: 'سیاسەتی تایبەتمەندی ئێمە بخوێنەرەوە بۆ تێگەیشتن لە چۆنیەتی کۆکردنەوە، بەکارهێنان، و پاراستنی داتاکانت لەسەر پلاتفۆرمی ئیڤێنتەکانی کوردستان/عێراق.' },
    // Errors
    'errors.emailExists': { en: 'A user with this email already exists.', ar: 'مستخدم بهذا البريد الإلكتروني موجود بالفعل.', ku: 'بەکارهێنەرێک بەم ئیمەیڵە پێشتر هەیە.' },
    'errors.invalidCredentials': { en: 'Invalid email or password.', ar: 'البريد الإلكتروني أو كلمة المرور غير صالحة.', ku: 'ئیمەیڵ یان وشەی نهێنی نادروستە.' },
    'errors.unexpected': { en: 'An unexpected error occurred. Please try again.', ar: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.', ku: 'هەڵەیەکی چاوەڕواننەکراو ڕوویدا. تکایە دووبارە هەوڵبدەرەوە.' },
    'errors.loadFilters': { en: 'Could not load filters. Please refresh the page.', ar: 'تعذر تحميل عوامل التصفية. يرجى تحديث الصفحة.', ku: 'فلتەرەکان بارنەکران. تکایە لاپەڕەکە نوێ بکەرەوە.' },
    'errors.fetchEvents': { en: 'Failed to fetch events.', ar: 'فشل في جلب الفعاليات.', ku: 'سەرکەوتوو نەبوو لە هێنانی ڕووداوەکان.' },
    // Map Errors
    'maps.error.title': { en: 'Map Loading Error', ar: 'خطأ في تحميل الخريطة', ku: 'هەڵە لە بارکردنی نەخشە' },
    'maps.error.message': { en: 'The map could not be loaded. This is often caused by an issue with the Google Maps API key configuration.', ar: 'تعذر تحميل الخريطة. غالبًا ما يكون هذا بسبب مشكلة في تكوين مفتاح Google Maps API.', ku: 'نەخشەکە بارنەکرا. ئەمە زۆرجار بەهۆی کێشەیەک لە پیکربەندی کلیلی Google Maps API ڕوودەدات.' },
    'maps.error.check1': { en: 'Ensure the "Maps JavaScript API" is enabled in your Google Cloud project.', ar: 'تأكد من تمكين "Maps JavaScript API" في مشروع Google Cloud الخاص بك.', ku: 'دڵنیابە کە "Maps JavaScript API" لە پڕۆژەی Google Cloudی تۆدا کارایە.' },
    'maps.error.check2': { en: 'Verify that billing is enabled for your Google Cloud project.', ar: 'تحقق من تمكين الفوترة لمشروع Google Cloud الخاص بك.', ku: 'دڵنیابە کە پارەدان بۆ پڕۆژەی Google Cloudی تۆ کارایە.' },
    'maps.error.check3': { en: 'Check that your API key is correct and has the necessary permissions.', ar: 'تحقق من أن مفتاح API الخاص بك صحيح ولديه الأذونات اللازمة.', ku: 'دڵنیابە کە کلیلی APIی تۆ ڕاستە و مۆڵەتی پێویستی هەیە.' },
    'maps.error.learnMore': { en: "See Google's documentation for technical details.", ar: 'اطلع على وثائق جوجل للحصول على التفاصيل الفنية.', ku: 'بۆ وردەکاری تەکنیکی سەیری دۆکیومێنتەکانی گوگڵ بکە.' },
};

// --- MOCK DATABASE using localStorage ---

const initializeStorage = <T,>(key: string, defaultValue: T[]): T[] => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            // If a value exists, attempt to parse it.
            return JSON.parse(storedValue);
        }
    } catch (error) {
        // If parsing fails, the data is corrupted.
        console.error(
            `Corrupted data found in localStorage for key "${key}". Clearing and resetting to default.`,
            error
        );
        localStorage.removeItem(key);
    }
    // If we reach here, it means there was no stored value or it was corrupted.
    // In either case, initialize storage with the default value.
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
};


let users: (User & { passwordHash: string })[] = initializeStorage('users', [
    { id: 'admin-user', name: 'Admin Support', email: 'admin@example.com', passwordHash: 'hashed_admin_password', profile_picture: 'https://picsum.photos/seed/admin/100/100', language: 'en', role: 'admin' },
    { id: 'user-1', name: 'Bawan Ahmed', email: 'bawan@example.com', passwordHash: 'hashed_password123', profile_picture: 'https://picsum.photos/seed/user1/100/100', language: 'en', role: 'host', businessName: 'Erbil Events Co.', phone: '+9647501234567', website: 'https://erbilevents.com', businessAddress: '123 Citadel Road, Erbil, Iraq', organizerType: 'Venue', isVerified: true, verificationStatus: 'approved', attending_event_ids: ['event-2', 'event-4'] },
    { id: 'user-2', name: 'Lana Omer', email: 'lana@example.com', passwordHash: 'hashed_password123', profile_picture: 'https://picsum.photos/seed/user2/100/100', language: 'ku', role: 'attendee', attending_event_ids: ['event-1', 'event-2'] },
    { id: 'user-3', name: 'Saman Yasin', email: 'saman@example.com', passwordHash: 'hashed_password123', profile_picture: 'https://picsum.photos/seed/user3/100/100', language: 'en', role: 'attendee', attending_event_ids: ['event-1', 'event-3'] },
    { id: 'user-4', name: 'Narin Abdullah', email: 'narin@example.com', passwordHash: 'hashed_password123', profile_picture: 'https://picsum.photos/seed/user4/100/100', language: 'ar', role: 'attendee', attending_event_ids: ['event-1', 'event-2', 'event-3', 'event-4'] },
    { id: 'user-5', name: 'Darya Ali', email: 'darya@example.com', passwordHash: 'hashed_password123', profile_picture: 'https://picsum.photos/seed/user5/100/100', language: 'en', role: 'attendee', attending_event_ids: ['event-2'] }
]);

let sponsors: Sponsor[] = initializeStorage('sponsors', [
    { id: 'sponsor-1', name: 'Zain Iraq', logo_url: 'https://picsum.photos/seed/zain/100/100' },
    { id: 'sponsor-2', name: 'Asiacell', logo_url: 'https://picsum.photos/seed/asiacell/100/100' },
]);

let banners: Banner[] = initializeStorage('banners', [
    { id: 'banner-1', sponsor_id: 'sponsor-1', image_url: 'https://picsum.photos/seed/banner1/1200/200', link_url: '#', target_city_id: 'city-1', placement: 'home_top' },
    { id: 'banner-2', sponsor_id: 'sponsor-2', image_url: 'https://picsum.photos/seed/banner2/1200/200', link_url: '#', target_city_id: null, placement: 'home_top' },
    { id: 'banner-3', sponsor_id: 'sponsor-1', image_url: 'https://picsum.photos/seed/banner3/800/150', link_url: '#', target_city_id: null, placement: 'details_bottom' },
]);

let categories: Category[] = initializeStorage('categories', [
    { id: 'cat-1', translation_key: 'category.social', icon: 'Users' },
    { id: 'cat-2', translation_key: 'category.music', icon: 'Music' },
    { id: 'cat-3', translation_key: 'category.wellness', icon: 'HeartPulse' },
    { id: 'cat-4', translation_key: 'category.sports', icon: 'Bike' },
    { id: 'cat-5', translation_key: 'category.festivals', icon: 'Tent' },
    { id: 'cat-6', translation_key: 'category.local-tourism', icon: 'Map' },
    { id: 'cat-7', translation_key: 'category.international-tourism', icon: 'Plane' },
    { id: 'cat-8', translation_key: 'category.entrepreneurship', icon: 'Briefcase' },
    { id: 'cat-9', translation_key: 'category.conferences', icon: 'Presentation', sponsor_id: 'sponsor-1' },
    { id: 'cat-10', translation_key: 'category.art-culture', icon: 'Palette' },
]);

let cities: City[] = initializeStorage('cities', [
    { id: 'city-1', name: { en: 'Erbil', ar: 'أربيل', ku: 'هەولێر' } },
    { id: 'city-2', name: { en: 'Sulaymaniyah', ar: 'السليمانية', ku: 'سلێمانی' } },
    { id: 'city-3', name: { en: 'Duhok', ar: 'دهوك', ku: 'دهۆک' } },
    { id: 'city-4', name: { en: 'Baghdad', ar: 'بغداد', ku: 'بەغدا' } },
    { id: 'city-5', name: { en: 'Basra', ar: 'البصرة', ku: 'بەسرە' } },
    { id: 'city-6', name: { en: 'Mosul', ar: 'الموصل', ku: 'مووسڵ' } },
    { id: 'city-7', name: { en: 'Karbala', ar: 'كربلاء', ku: 'کەربەلا' } },
    { id: 'city-8', name: { en: 'Najaf', ar: 'النجف', ku: 'نەجەف' } },
]);

let events: Event[] = initializeStorage('events', [
    {
        id: 'event-1',
        title: { en: 'Newroz Celebration in Erbil Citadel', ar: 'احتفال نوروز في قلعة أربيل', ku: 'ئاھەنگی نەورۆز لە قەڵای ھەولێر' },
        description: { en: 'Join us for the annual Newroz celebration with fire, dance, and music at the historic Erbil Citadel.', ar: 'انضم إلينا في احتفال نوروز السنوي بالنار والرقص والموسيقى في قلعة أربيل التاريخية.', ku: 'بەشداربن لە ئاھەنگی ساڵانەی نەورۆز بە ئاگر و سەم و مۆسیقا لە قەڵای مێژوویی ھەولێر.' },
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        location_address: 'Erbil Citadel, Erbil, Iraq',
        location_latLng: '36.1911,44.0094',
        image: 'https://picsum.photos/seed/newroz/600/400',
        creator_id: 'user-1',
        category_id: 'cat-5',
        city_id: 'city-1',
        is_promoted: true,
        attendee_ids: ['user-2', 'user-3', 'user-4'],
    },
    {
        id: 'event-2',
        title: { en: 'Slemani Tech Conference 2024', ar: 'مؤتمر السليمانية التقني 2024', ku: 'کۆنفرانسی تەکنیکی سلێمانی ٢٠٢٤' },
        description: { en: 'A gathering of the brightest minds in technology in Kurdistan. Workshops, talks, and networking opportunities.', ar: 'ملتقى ألمع العقول في مجال التكنولوجيا في كردستان. ورش عمل ومحادثات وفرص للتواصل.', ku: 'کۆبوونەوەی زیرەکترین کەسایەتییەکانی تەکنەلۆژیا لە کوردستان. وۆرکشۆپ و وتار و دەرفەتی تۆڕسازی.' },
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        location_address: 'Grand Millennium Sulaimani, Sulaymaniyah, Iraq',
        location_latLng: '35.5606,45.4206',
        image: 'https://picsum.photos/seed/tech/600/400',
        creator_id: 'user-2',
        category_id: 'cat-9',
        city_id: 'city-2',
        attendee_ids: ['user-1', 'user-2', 'user-4', 'user-5'],
    },
    {
        id: 'event-3',
        title: { en: 'Outdoor Yoga Session', ar: 'جلسة يوجا في الهواء الطلق', ku: 'دانیشتنی یۆگا لە دەرەوە' },
        description: { en: 'Find your inner peace with a morning yoga session at Sami Abdulrahman Park.', ar: 'اعثر على سلامك الداخلي مع جلسة يوجا صباحية في حديقة سامي عبد الرحمن.', ku: 'ئارامی ناوەکیت بدۆزەرەوە لەگەڵ دانیشتنێکی یۆگای بەیانیان لە پارکی سامي عەبدولڕەحمان.' },
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        location_address: 'Sami Abdulrahman Park, Erbil, Iraq',
        location_latLng: '36.1925,43.9840',
        image: 'https://picsum.photos/seed/yoga/600/400',
        creator_id: 'user-1',
        category_id: 'cat-3',
        city_id: 'city-1',
        attendee_ids: ['user-3', 'user-4'],
    },
    {
        id: 'event-4',
        title: { en: 'Baghdad International Book Fair', ar: 'معرض بغداد الدولي للكتاب', ku: 'پێشانگای نێودەوڵەتی کتێب لە بەغدا' },
        description: { en: 'Explore a world of literature from local and international publishers.', ar: 'استكشف عالمًا من الأدب من ناشرين محليين ودوليين.', ku: 'جیهانێکی ئەدەبی لە بڵاوکەرەوە ناوخۆیی و نێودەوڵەتییەکان بپشکنە.' },
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        location_address: 'Baghdad International Fair, Baghdad, Iraq',
        location_latLng: '33.3039,44.3355',
        image: 'https://picsum.photos/seed/books/600/400',
        creator_id: 'user-2',
        category_id: 'cat-10',
        city_id: 'city-4',
        is_promoted: true,
        attendee_ids: ['user-1', 'user-4'],
    }
]);

let messages: Message[] = initializeStorage('messages', [
    { id: 'msg-1', sender_id: 'user-2', receiver_id: 'user-1', text: 'Hey, I had a question about the Newroz event. Will there be parking available nearby?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), is_read: true },
    { id: 'msg-2', sender_id: 'user-1', receiver_id: 'user-2', text: 'Hi Lana, yes, we have arranged for a dedicated parking area just a 5-minute walk from the Citadel entrance. Signs will guide you!', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), is_read: true },
    { id: 'msg-3', sender_id: 'user-3', receiver_id: 'admin-user', text: 'Hello, I\'m having trouble logging into my account on a new device. Can you help?', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), is_read: true },
    { id: 'msg-4', sender_id: 'admin-user', receiver_id: 'user-3', text: 'Hi Saman, I\'ve looked into your account. Please try resetting your password. That should resolve the issue.', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), is_read: false },
]);

const saveUsers = () => localStorage.setItem('users', JSON.stringify(users));
const saveEvents = () => localStorage.setItem('events', JSON.stringify(events));
const saveMessages = () => localStorage.setItem('messages', JSON.stringify(messages));

// --- MOCK API FUNCTIONS ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Analytics ---
const trackImpression = (elementId: string) => {
    console.log(`[Analytics] Impression tracked for: ${elementId}`);
};
const trackClick = (elementId: string) => {
    console.log(`[Analytics] Click tracked for: ${elementId}`);
};


// --- Translations ---
export const getTranslations = async (lang: Language): Promise<Record<string, string>> => {
    await delay(50);
    const langTranslations = Object.entries(translations).reduce((acc, [key, value]) => {
        acc[key] = value[lang] || value['en'];
        return acc;
    }, {} as Record<string, string>);
    return langTranslations;
}

// --- Auth ---

// This replaces localStorage for storing the session token.
// The token will only exist for the current browser session and will be lost on page refresh.
// This is a secure frontend pattern when the backend uses HttpOnly cookies for true session persistence.
let sessionToken: string | null = null;

export const setSessionToken = (token: string) => {
    sessionToken = token;
};
export const getSessionToken = (): string | null => {
    return sessionToken;
};
export const clearSessionToken = () => {
    sessionToken = null;
};

type SignUpData = {
    name: string;
    email: string;
    password: string;
    role: 'attendee' | 'host';
}

export const signUp = async (data: SignUpData): Promise<{ user: User, token: string }> => {
    await delay(500);
    if (users.some(u => u.email === data.email)) {
        throw new Error('User with this email already exists.');
    }
    
    const passwordHash = `hashed_${Date.now()}_${data.password}`;
    const isHost = data.role === 'host';

    const newUser: User & { passwordHash: string } = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        passwordHash,
        profile_picture: `https://picsum.photos/seed/${Date.now()}/100/100`,
        language: 'en',
        role: data.role,
        isVerified: !isHost,
        verificationStatus: isHost ? 'unsubmitted' : 'approved',
        attending_event_ids: [],
    };
    users.push(newUser);
    saveUsers();
    
    const { passwordHash: removedHash, ...userForClient } = newUser;
    const token = `mock-token-${newUser.id}`;
    setSessionToken(token);
    
    return { user: userForClient, token };
};


export const login = async (email: string, password: string): Promise<{ user: User, token: string }> => {
    await delay(500);
    const userRecord = users.find(u => u.email === email);
    
    const isPasswordCorrect = userRecord?.passwordHash.endsWith(password);

    if (!userRecord || !isPasswordCorrect) {
        throw new Error('Invalid email or password.');
    }
    
    const { passwordHash, ...userForClient } = userRecord;
    const token = `mock-token-${userForClient.id}`;
    setSessionToken(token);
    
    return { user: userForClient, token };
};

export const signInWithGoogle = async (): Promise<{ user: User, token: string }> => {
    await delay(600);
    const mockGoogleUser = {
        name: 'Googler',
        email: 'googleuser@example.com',
        profile_picture: `https://picsum.photos/seed/google/100/100`,
    };
    
    let userRecord = users.find(u => u.email === mockGoogleUser.email);

    if (!userRecord) {
        const newUser: User & { passwordHash: string } = {
            id: `user-${Date.now()}`,
            name: mockGoogleUser.name,
            email: mockGoogleUser.email,
            passwordHash: `google-auth-${Date.now()}`,
            profile_picture: mockGoogleUser.profile_picture,
            language: 'en',
            role: 'attendee',
            isVerified: true,
            verificationStatus: 'approved',
            attending_event_ids: [],
        };
        users.push(newUser);
        saveUsers();
        userRecord = newUser;
    }

    const { passwordHash, ...userForClient } = userRecord;
    const token = `mock-token-${userForClient.id}`;
    setSessionToken(token);
    
    return { user: userForClient, token };
}

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
    await delay(1000);
    console.log(`Password reset link would be sent to: ${email}`);
    return Promise.resolve();
};

export const getCurrentUser = async (): Promise<User> => {
    await delay(200);
    const token = getSessionToken();
    if (!token) throw new Error('Not authenticated');

    const userId = token.replace('mock-token-', '');
    const userRecord = users.find(u => u.id === userId);
    if (!userRecord) {
        clearSessionToken();
        throw new Error('Invalid token');
    }
    const { passwordHash, ...userForClient } = userRecord;
    return userForClient;
};

export const getUserById = async (userId: string): Promise<User | undefined> => {
    await delay(100);
    const userRecord = users.find(u => u.id === userId);
    if (!userRecord) return undefined;

    const { passwordHash, ...userForClient } = userRecord;
    return userForClient;
}

export const updateUserLanguage = async (userId: string, language: Language): Promise<User> => {
    await delay(100);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error("User not found");
    }
    users[userIndex].language = language;
    saveUsers();
    const { passwordHash, ...userForClient } = users[userIndex];
    return userForClient;
};

export type HostProfileData = {
    businessName: string;
    phone: string;
    website?: string;
    businessAddress: string;
    organizerType: string;
};

export const updateHostProfile = async (hostData: HostProfileData): Promise<User> => {
    await delay(500);
    const currentUser = await getCurrentUser();
    if (currentUser.role !== 'host') {
        throw new Error('Only hosts can update their profile.');
    }
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
        throw new Error('User not found.');
    }

    users[userIndex] = {
        ...users[userIndex],
        ...hostData,
        verificationStatus: 'pending',
    };
    saveUsers();

    const { passwordHash, ...userForClient } = users[userIndex];
    
    console.log(`[Admin Dashboard] Host profile submitted for review: ${userForClient.name} (${userForClient.email})`);
    
    return userForClient;
};

// --- Categories ---
export const getCategories = async (): Promise<Category[]> => {
    await delay(100);
    const populatedCategories = categories.map(cat => {
        const sponsor = sponsors.find(s => s.id === cat.sponsor_id);
        return { ...cat, sponsor };
    })
    return populatedCategories;
};

// --- Cities ---
export const getCities = async (): Promise<City[]> => {
    await delay(150);
    return cities;
};

// --- Banners ---
export const getBanners = async (filters: { cityId?: string | null; placement: 'home_top' | 'details_bottom' }): Promise<Banner[]> => {
    await delay(200);
    const { cityId, placement } = filters;
    
    let banner = banners.find(b => b.placement === placement && b.target_city_id === cityId);

    if (!banner) {
        banner = banners.find(b => b.placement === placement && b.target_city_id === null);
    }
    
    if (banner) {
        trackImpression(banner.id);
        const sponsor = sponsors.find(s => s.id === banner!.sponsor_id);
        return [{...banner, sponsor }];
    }
    
    return [];
};

// --- Events ---

export const getEvents = async (filters: { cityId?: string | null; categoryId?: string | null; }): Promise<Event[]> => {
    await delay(500);
    const { cityId, categoryId } = filters;
    
    let filteredEvents = events;

    if (cityId) {
        filteredEvents = filteredEvents.filter(event => event.city_id === cityId);
    }

    if (categoryId) {
        filteredEvents = filteredEvents.filter(event => event.category_id === categoryId);
    }

    const promotedEvents = filteredEvents.filter(e => e.is_promoted);
    const organicEvents = filteredEvents.filter(e => !e.is_promoted);

    const sortFn = (a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime();
    promotedEvents.sort(sortFn);
    organicEvents.sort(sortFn);

    const finalPromoted = promotedEvents.slice(0, 2);
    const sortedEvents = [...finalPromoted, ...organicEvents];


    const populatedEvents = sortedEvents.map(event => {
        const creator = users.find(u => u.id === event.creator_id);
        const category = categories.find(c => c.id === event.category_id);
        const city = cities.find(c => c.id === event.city_id);
        const { passwordHash, ...creatorInfo } = creator || {};
        
        trackImpression(event.id);
        if (event.is_promoted) {
            trackImpression(`${event.id}-promoted`);
        }

        return {
            ...event,
            creator: creator ? (creatorInfo as User) : undefined,
            category: category,
            city: city,
        };
    });
    return populatedEvents;
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
    await delay(300);
    const event = events.find(e => e.id === id);
    if (!event) return undefined;

    const creator = users.find(u => u.id === event.creator_id);
    const category = categories.find(c => c.id === event.category_id);
    const city = cities.find(c => c.id === event.city_id);
    const { passwordHash, ...creatorInfo } = creator || {};
    
    const attendees = (event.attendee_ids || [])
        .map(attendeeId => {
            const attendeeRecord = users.find(u => u.id === attendeeId);
            if (!attendeeRecord) return null;
            const { passwordHash, ...attendeeInfo } = attendeeRecord;
            return attendeeInfo as User;
        })
        .filter((a): a is User => a !== null);
    
    trackImpression(`event-details-${id}`);

    return {
        ...event,
        creator: creator ? (creatorInfo as User) : undefined,
        category: category,
        city: city,
        attendees: attendees,
    };
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'creator_id' | 'creator' | 'category' | 'city' | 'is_promoted' | 'attendee_ids' | 'attendees'>): Promise<Event> => {
    await delay(600);
    const currentUser = await getCurrentUser();

    if (currentUser.role === 'host' && currentUser.verificationStatus !== 'approved') {
        throw new Error('Host account is not verified.');
    }
    
    const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}`,
        creator_id: currentUser.id,
        is_promoted: false, // Default for user-created events
        attendee_ids: [],
    };
    events.push(newEvent);
    saveEvents();

    console.log(`[Admin Dashboard] New event created by ${currentUser.name}: "${newEvent.title['en']}". Awaiting approval.`);

    return newEvent;
};

export const toggleEventAttendance = async (eventId: string): Promise<Event> => {
    await delay(400);
    const currentUser = await getCurrentUser();
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) throw new Error("Event not found");

    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) throw new Error("User not found");

    const event = events[eventIndex];
    const user = users[userIndex];

    // Ensure arrays exist
    if (!event.attendee_ids) event.attendee_ids = [];
    if (!user.attending_event_ids) user.attending_event_ids = [];

    const isAttending = event.attendee_ids.includes(currentUser.id);

    if (isAttending) {
        event.attendee_ids = event.attendee_ids.filter(id => id !== currentUser.id);
        user.attending_event_ids = user.attending_event_ids.filter(id => id !== eventId);
    } else {
        event.attendee_ids.push(currentUser.id);
        user.attending_event_ids.push(eventId);
    }
    
    events[eventIndex] = event;
    users[userIndex] = user;

    saveEvents();
    saveUsers();

    const populatedEvent = await getEventById(eventId);
    if (!populatedEvent) throw new Error("Could not retrieve updated event.");
    
    return populatedEvent;
}

// --- Messaging ---
type MessageCallback = (messages: Message[]) => void;
const messageSubscribers: { [conversationId: string]: MessageCallback[] } = {};

const getConversationId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('--');
}

// Subscribe to conversation updates (simulates WebSocket)
export const subscribeToMessages = (otherUserId: string, callback: MessageCallback): (() => void) => {
    const currentUser = users.find(u => u.id === getSessionToken()?.replace('mock-token-', ''));
    if (!currentUser) return () => {};
    
    const conversationId = getConversationId(currentUser.id, otherUserId);
    
    if (!messageSubscribers[conversationId]) {
        messageSubscribers[conversationId] = [];
    }
    messageSubscribers[conversationId].push(callback);
    
    // Unsubscribe function
    return () => {
        messageSubscribers[conversationId] = messageSubscribers[conversationId].filter(cb => cb !== callback);
    };
};

// Notify subscribers of new messages
const notifySubscribers = async (conversationId: string) => {
    const [userId1, userId2] = conversationId.split('--');
    const subscribers = messageSubscribers[conversationId];
    if (subscribers && subscribers.length > 0) {
        const conversation = await getConversation(userId1 === getSessionToken()?.replace('mock-token-', '') ? userId2 : userId1);
        subscribers.forEach(callback => callback(conversation));
    }
};

export const getConversation = async (otherUserId: string): Promise<Message[]> => {
    await delay(50); // Make it fast as it's called often
    const currentUser = await getCurrentUser();

    const conversation = messages.filter(msg => 
        (msg.sender_id === currentUser.id && msg.receiver_id === otherUserId) ||
        (msg.sender_id === otherUserId && msg.receiver_id === currentUser.id)
    );

    conversation.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return conversation;
};

export const sendMessage = async (receiverId: string, text: string): Promise<Message> => {
    await delay(300);
    const currentUser = await getCurrentUser();

    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender_id: currentUser.id,
        receiver_id: receiverId,
        text,
        timestamp: new Date().toISOString(),
        is_read: false,
    };

    messages.push(newMessage);
    saveMessages();
    
    const conversationId = getConversationId(currentUser.id, receiverId);
    notifySubscribers(conversationId);

    // Simulate a reply from admin or user
    if (receiverId === 'admin-user' || Math.random() > 0.5) {
        setTimeout(() => {
            const reply: Message = {
                id: `msg-${Date.now() + 1}`,
                sender_id: receiverId,
                receiver_id: currentUser.id,
                text: `Thanks for your message! This is an automated reply.`,
                timestamp: new Date().toISOString(),
                is_read: false,
            };
            messages.push(reply);
            saveMessages();
            notifySubscribers(conversationId);
        }, 2000);
    }

    return newMessage;
};

// --- Privacy Policy ---
export const getPrivacyPolicyText = async (lang: Language): Promise<{ title: string; lastUpdated: string; sections: { title: string; content: string }[] }> => {
    await delay(50);
    const today = new Date().toLocaleDateString(lang);
    const getT = (key: string) => translations[key]?.[lang] || translations[key]?.['en'] || key;
    
    return {
        title: getT('privacy.title'),
        lastUpdated: getT('privacy.lastUpdated').replace('{date}', today),
        sections: [
            {
                title: getT('privacy.section1.title'),
                content: getT('privacy.section1.content')
            },
            {
                title: getT('privacy.section2.title'),
                content: getT('privacy.section2.content')
            }
        ]
    };
};


// Export analytics functions for components to use
export const trackBannerClick = (bannerId: string) => trackClick(`banner-${bannerId}`);
export const trackSponsoredEventClick = (eventId: string) => trackClick(`sponsored-event-${eventId}`);