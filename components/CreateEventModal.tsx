
import React, { useState, useId, useEffect } from 'react';
import type { City, Category, Event, Language, AIAutofillData, User } from '../types';
import { translateEventDetails } from '../services/geminiService';
import { TranslateIcon } from './icons';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Omitted 'attendees' as it's handled by the parent component.
  onSave: (eventData: Omit<Event, 'id' | 'reviews' | 'organizerId' | 'attendees'>) => void;
  cities: City[];
  categories: Category[];
  lang: Language;
  eventToEdit: Event | null;
  aiAutofillData: AIAutofillData | null;
  currentUser: User | null;
}

const initialFormData = {
    title_en: '',
    title_ar: '',
    title_ku: '',
    description_en: '',
    description_ar: '',
    description_ku: '',
    organizerName: '',
    categoryId: '',
    cityId: '',
    date: '',
    venue: '',
    organizerPhone: '',
    whatsappNumber: '',
    imageUrl: '',
    ticketInfo: '',
};

type LangKey = 'en' | 'ar' | 'ku';
const langTabs: { key: LangKey, name: string }[] = [
    { key: 'en', name: 'English' },
    { key: 'ar', name: 'العربية' },
    { key: 'ku', name: 'کوردی' },
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSave, cities, categories, lang, eventToEdit, aiAutofillData, currentUser }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [activeLangTab, setActiveLangTab] = useState<LangKey>('en');
  const [error, setError] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const formId = useId();
  const isEditMode = !!eventToEdit;

  useEffect(() => {
    if (isOpen) {
        if (eventToEdit) {
            setFormData({
                title_en: eventToEdit.title.en,
                title_ar: eventToEdit.title.ar,
                title_ku: eventToEdit.title.ku || '',
                description_en: eventToEdit.description.en,
                description_ar: eventToEdit.description.ar,
                description_ku: eventToEdit.description.ku || '',
                organizerName: eventToEdit.organizerName,
                categoryId: eventToEdit.categoryId,
                cityId: eventToEdit.cityId,
                date: eventToEdit.date.substring(0, 16),
                venue: eventToEdit.venue,
                organizerPhone: eventToEdit.organizerPhone,
                whatsappNumber: eventToEdit.whatsappNumber || '',
                imageUrl: eventToEdit.imageUrl,
                ticketInfo: eventToEdit.ticketInfo || '',
            });
        } else if (aiAutofillData) {
            setFormData({
                ...initialFormData,
                title_en: aiAutofillData.title.en,
                title_ar: aiAutofillData.title.ar,
                title_ku: aiAutofillData.title.ku || '',
                description_en: aiAutofillData.description.en,
                description_ar: aiAutofillData.description.ar,
                description_ku: aiAutofillData.description.ku || '',
                categoryId: aiAutofillData.categoryId,
                cityId: aiAutofillData.cityId,
                imageUrl: `data:image/png;base64,${aiAutofillData.imageBase64}`,
                organizerName: currentUser?.name || '',
            });
        } else {
            setFormData({
                ...initialFormData,
                organizerName: currentUser?.name || '',
            });
        }
        setError('');
        setActiveLangTab(lang === 'ku' ? 'ku' : lang);
    }
  }, [isOpen, eventToEdit, aiAutofillData, currentUser, lang]);
  
  const handleAutoTranslate = async () => {
    const sourceTitle = formData[`title_${activeLangTab}`];
    const sourceDescription = formData[`description_${activeLangTab}`];

    if (!sourceTitle && !sourceDescription) {
        setError("Please enter a title or description to translate.");
        return;
    }

    setError('');
    setIsTranslating(true);
    try {
        const translatedData = await translateEventDetails(
            { title: sourceTitle, description: sourceDescription },
            activeLangTab
        );
        setFormData(prev => ({
            ...prev,
            ...translatedData
        }));
    } catch (e) {
        setError("Translation failed. Please try again or fill in the fields manually.");
        console.error(e);
    } finally {
        setIsTranslating(false);
    }
  };

  if (!isOpen) return null;
  
  const t = {
    title: { en: 'Create New Event', ar: 'إنشاء فعالية جديدة', ku: 'دروستکردنی ڕووداوی نوێ' },
    editTitle: { en: 'Edit Event', ar: 'تعديل الفعالية', ku: 'دەستکاری ڕووداو' },
    eventTitle: { en: 'Event Title', ar: 'عنوان الفعالية', ku: 'ناوی ڕووداو' },
    organizerName: { en: 'Organizer Name', ar: 'اسم المنظم', ku: 'ناوی ڕێکخەر' },
    category: { en: 'Category', ar: 'التصنيف', ku: 'پۆل' },
    city: { en: 'City', ar: 'المدينة', ku: 'شار' },
    date: { en: 'Date and Time', ar: 'التاريخ والوقت', ku: 'کات و بەروار' },
    venue: { en: 'Venue/Address', ar: 'المكان/العنوان', ku: 'شوێن/ناونیشان' },
    description: { en: 'Description', ar: 'الوصف', ku: 'پێناسە' },
    phone: { en: 'Organizer Phone', ar: 'رقم هاتف المنظم', ku: 'ژمارەی مۆبایلی ڕێکخەر' },
    whatsapp: { en: 'WhatsApp Number (Optional)', ar: 'رقم واتساب (اختياري)', ku: 'ژمارەی واتسئاپ (ئارەزوومەندانە)' },
    image: { en: 'Featured Image', ar: 'الصورة البارزة', ku: 'وێنەى سەرەکی' },
    ticketInfo: { en: 'Ticket/Entry Info', ar: 'معلومات التذكرة/الدخول', ku: 'زانیاری بلیت/چوونەژوورەوە' },
    submit: { en: 'Create Event', ar: 'إنشاء الفعالية', ku: 'دروستکردنی ڕووداو' },
    saveChanges: { en: 'Save Changes', ar: 'حفظ التغييرات', ku: 'پاشەکەوتکردنی گۆڕانکارییەکان' },
    cancel: { en: 'Cancel', ar: 'إلغاء', ku: 'هەڵوەشاندنەوە' },
    error: { en: 'Please fill out all required fields.', ar: 'يرجى ملء جميع الحقول المطلوبة.', ku: 'تکایە هەموو خانە داواکراوەکان پڕبکەرەوە.' },
    selectPlaceholder: { en: 'Select...', ar: 'اختر...', ku: 'هەڵبژێرە...' },
    ticketPlaceholder: { en: 'e.g., Free Entry, 25,000 IQD', ar: 'مثال: دخول مجاني، 25,000 دينار عراقي', ku: 'بۆ نموونە: چوونەژوورەوەی خۆڕایی، ٢٥،٠٠٠ دینار' },
    imageHelperText: { en: 'Upload a cover image for your event (16:9 ratio recommended).', ar: 'قم بتحميل صورة غلاف لفعاليتك (ينصح بنسبة 16:9).', ku: 'وێنەیەکی بەرگ بۆ ڕووداوەکەت باربکە (ڕێژەی ١٦:٩ پێشنیار دەکرێت).' },
    autoTranslate: { en: 'Auto-translate from', ar: 'ترجمة آلية من', ku: 'وەرگێڕانی خۆکار لە' },
    translating: { en: 'Translating...', ar: 'جار الترجمة...', ku: 'خەریکی وەرگێڕانە...' },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof typeof formData)[] = ['title_en', 'title_ar', 'description_en', 'description_ar', 'organizerName', 'categoryId', 'cityId', 'date', 'venue', 'organizerPhone'];
    if (requiredFields.some(field => !formData[field])) {
        setError(t.error[lang]);
        return;
    }
    
    const eventData = {
        title: { en: formData.title_en, ar: formData.title_ar, ku: formData.title_ku },
        description: { en: formData.description_en, ar: formData.description_ar, ku: formData.description_ku },
        organizerName: formData.organizerName,
        categoryId: formData.categoryId,
        cityId: formData.cityId,
        date: formData.date,
        venue: formData.venue,
        organizerPhone: formData.organizerPhone,
        whatsappNumber: formData.whatsappNumber,
        imageUrl: formData.imageUrl || `https://picsum.photos/seed/${Date.now()}/800/600`,
        ticketInfo: formData.ticketInfo,
    };
    
    onSave(eventData);
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:opacity-70";
  const tabClasses = (isActive: boolean) => `px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none ${isActive ? 'bg-gray-700 text-orange-300 border-b-2 border-orange-400' : 'text-gray-400 hover:bg-gray-700/50'}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="create-event-modal-title">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-animate">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
            <h2 id="create-event-modal-title" className="text-2xl font-bold text-gray-100">{isEditMode ? t.editTitle[lang] : t.title[lang]}</h2>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-300 text-3xl leading-none">&times;</button>
          </div>
          <div className="space-y-4">
            <div className="border-b border-gray-600 relative">
                <nav className="-mb-px flex gap-4" aria-label="Tabs">
                    {langTabs.map(tab => (
                        <button key={tab.key} type="button" onClick={() => setActiveLangTab(tab.key)} className={tabClasses(activeLangTab === tab.key)}>
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="flex justify-end -mt-2">
                <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={isTranslating}
                    className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/20 rounded-full hover:bg-indigo-500/30 disabled:opacity-50 disabled:cursor-wait"
                >
                    {isTranslating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
                            {t.translating[lang]}
                        </>
                    ) : (
                        <>
                            <TranslateIcon className="w-4 h-4" />
                            {t.autoTranslate[lang]} {langTabs.find(t => t.key === activeLangTab)?.name}
                        </>
                    )}
                </button>
            </div>
            
            <div className="space-y-4">
                {langTabs.map(tab => (
                    <div key={tab.key} className={activeLangTab === tab.key ? 'block' : 'hidden'}>
                        <div>
                            <label htmlFor={`${formId}-title-${tab.key}`} className="block text-sm font-medium text-gray-400 mb-1">{t.eventTitle[lang]} ({tab.name})</label>
                            <input type="text" id={`${formId}-title-${tab.key}`} name={`title_${tab.key}`} value={formData[`title_${tab.key}`]} onChange={handleChange} className={inputClasses} disabled={isTranslating} />
                        </div>
                        <div className="mt-4">
                            <label htmlFor={`${formId}-description-${tab.key}`} className="block text-sm font-medium text-gray-400 mb-1">{t.description[lang]} ({tab.name})</label>
                            <textarea id={`${formId}-description-${tab.key}`} name={`description_${tab.key}`} value={formData[`description_${tab.key}`]} onChange={handleChange} rows={5} className={inputClasses} disabled={isTranslating} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <label htmlFor={`${formId}-organizerName`} className="block text-sm font-medium text-gray-400 mb-1">{t.organizerName[lang]}</label>
                  <input type="text" id={`${formId}-organizerName`} name="organizerName" value={formData.organizerName} onChange={handleChange} className={inputClasses} />
                </div>
                 <div>
                  <label htmlFor={`${formId}-phone`} className="block text-sm font-medium text-gray-400 mb-1">{t.phone[lang]}</label>
                  <input type="tel" id={`${formId}-phone`} name="organizerPhone" value={formData.organizerPhone} onChange={handleChange} className={inputClasses} />
                </div>
                 <div>
                  <label htmlFor={`${formId}-whatsapp`} className="block text-sm font-medium text-gray-400 mb-1">{t.whatsapp[lang]}</label>
                  <input type="tel" id={`${formId}-whatsapp`} name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor={`${formId}-category`} className="block text-sm font-medium text-gray-400 mb-1">{t.category[lang]}</label>
                  <select id={`${formId}-category`} name="categoryId" value={formData.categoryId} onChange={handleChange} className={inputClasses}>
                    <option value="">{t.selectPlaceholder[lang]}</option>
                    {categories.filter(c => c.id !== 'all').map(item => (<option key={item.id} value={item.id}>{item.name[lang]}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-city`} className="block text-sm font-medium text-gray-400 mb-1">{t.city[lang]}</label>
                  <select id={`${formId}-city`} name="cityId" value={formData.cityId} onChange={handleChange} className={inputClasses}>
                    <option value="">{t.selectPlaceholder[lang]}</option>
                    {cities.map(item => (<option key={item.id} value={item.id}>{item.name[lang]}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-date`} className="block text-sm font-medium text-gray-400 mb-1">{t.date[lang]}</label>
                  <input type="datetime-local" id={`${formId}-date`} name="date" value={formData.date} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor={`${formId}-venue`} className="block text-sm font-medium text-gray-400 mb-1">{t.venue[lang]}</label>
                  <input type="text" id={`${formId}-venue`} name="venue" value={formData.venue} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor={`${formId}-ticketInfo`} className="block text-sm font-medium text-gray-400 mb-1">{t.ticketInfo[lang]}</label>
                  <input type="text" id={`${formId}-ticketInfo`} name="ticketInfo" value={formData.ticketInfo} onChange={handleChange} className={inputClasses} placeholder={t.ticketPlaceholder[lang]}/>
                </div>
            </div>
             <div>
                <label htmlFor={`${formId}-image-upload`} className="block text-sm font-medium text-gray-400 mb-1">{t.image[lang]}</label>
                <div className="mt-1 flex items-center gap-4 p-4 border border-dashed border-gray-600 rounded-lg">
                    {formData.imageUrl && (
                        <img src={formData.imageUrl} alt="Event preview" className="w-48 h-28 object-cover rounded-md bg-gray-700 flex-shrink-0" />
                    )}
                    <div className="flex-grow">
                        <p className="text-xs text-gray-500 mb-2">{t.imageHelperText[lang]}</p>
                        <input
                            id={`${formId}-image-upload`}
                            name="imageUpload"
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500">{t.cancel[lang]}</button>
            <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">{isEditMode ? t.saveChanges[lang] : t.submit[lang]}</button>
          </div>
        </form>
      </div>
    </div>
  );
};