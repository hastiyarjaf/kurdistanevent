import React, { useState, useEffect, useRef } from 'react';
import type { Event, Language, Review, User } from '../types';
import { WhatsAppIcon, FacebookIcon, GmailIcon, StarIcon } from './icons';

declare const L: any;

interface EventDetailModalProps {
  event: Event | null;
  onClose: () => void;
  lang: Language;
  onAddReview: (eventId: string, review: Omit<Review, 'id' | 'user' | 'timestamp'>) => void;
  currentUser: User | null;
  onEdit: (event: Event) => void;
  onViewProfile: (userId: string) => void;
}

const StarRating: React.FC<{ rating: number; setRating?: (rating: number) => void }> = ({ rating, setRating }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
                key={star}
                className={`w-6 h-6 ${rating >= star ? 'text-yellow-400' : 'text-gray-600'} ${setRating ? 'cursor-pointer' : ''}`}
                onClick={() => setRating?.(star)}
            />
        ))}
    </div>
);

interface EventMapProps {
    coordinates: { lat: number; lon: number };
    venueName: string;
    lang: Language;
}

const EventMap: React.FC<EventMapProps> = ({ coordinates, venueName, lang }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    const t = {
        navigate: { en: 'Navigate', ar: 'اذهب', ku: 'بڕۆ' }
    }

    useEffect(() => {
        if (typeof L === 'undefined' || !mapContainerRef.current) {
            return;
        }

        mapRef.current = L.map(mapContainerRef.current).setView([coordinates.lat, coordinates.lon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        const navigateUrl = `https://www.openstreetmap.org/directions?to=${coordinates.lat},${coordinates.lon}`;
        const popupContent = `
            <div class="text-center font-sans">
                <p class="font-bold">${venueName}</p>
                <a href="${navigateUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${t.navigate[lang]}</a>
            </div>
        `;

        L.marker([coordinates.lat, coordinates.lon]).addTo(mapRef.current)
            .bindPopup(popupContent)
            .openPopup();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [coordinates, venueName, lang]);

    return <div ref={mapContainerRef} className="h-64 w-full rounded-lg z-0" />;
};


export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, lang, onAddReview, currentUser, onEdit, onViewProfile }) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
      if (event) {
          setNewComment('');
          setNewRating(0);
      }
  }, [event]);

  if (!event) return null;

  const isOwner = currentUser && event.organizerId === currentUser.id;

  const getLocale = () => {
    if (lang === 'ar') return 'ar-IQ';
    if (lang === 'ku') return 'ku-IQ';
    return 'en-US';
  }

  const t = {
    organizerContact: { en: 'Contact Organizer', ar: 'اتصل بالمنظم', ku: 'پەیوەندی بە ڕێکخەر' },
    chat: { en: 'Chat on Platform', ar: 'مراسلة على المنصة', ku: 'گفتوگۆ لەسەر پلاتفۆرم' },
    call: { en: 'Call Organizer', ar: 'اتصل بالمنظم', ku: 'پەیوەندی بکە بە ڕێکخەر' },
    whatsapp: { en: 'Message on WhatsApp', ar: 'مراسلة عبر واتساب', ku: 'نامەناردن لە وەتسئەپ' },
    reviews: { en: 'Reviews & Comments', ar: 'التقييمات والتعليقات', ku: 'پێداچوونەوە و کۆمێنتەکان' },
    addReview: { en: 'Add your review', ar: 'أضف تقييمك', ku: 'پێداچوونەوەی خۆت زیاد بکە' },
    submitReview: { en: 'Submit Review', ar: 'إرسال التقييم', ku: 'ناردنی پێداچوونەوە' },
    share: { en: 'Share Event', ar: 'شارك الفعالية', ku: 'هاوبەشی پێکردنی ڕووداو' },
    location: { en: 'Location', ar: 'الموقع', ku: 'شوێن' },
    ticketInfo: { en: 'Tickets', ar: 'التذاكر', ku: 'بلیتەکان' },
    loginToReview: { en: 'Please sign in to leave a review.', ar: 'يرجى تسجيل الدخول لترك مراجعة.', ku: 'تکایە بچۆ ژوورەوە بۆ دانانی پێداچوونەوە.' },
    editEvent: { en: 'Edit Event', ar: 'تعديل الفعالية', ku: 'دەستکاری ڕووداو' },
    viewProfile: { en: 'View Profile', ar: 'عرض الملف الشخصي', ku: 'پڕۆفایل ببینە' }
  };
  
  const handleAddReview = () => {
    if (newComment && newRating > 0) {
        onAddReview(event.id, {
            rating: newRating,
            comment: newComment,
        });
        setNewComment('');
        setNewRating(0);
    }
  };

  const contactNumber = event.whatsappNumber || event.organizerPhone;
  const whatsappLink = `https://wa.me/${contactNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I have a question about the event: ${event.title[lang]}`)}`;
  const callLink = `tel:${event.organizerPhone}`;
  const gmailLink = `mailto:?subject=${encodeURIComponent(event.title[lang])}&body=${encodeURIComponent(`Check out this event: ${event.title[lang]}\n\n${event.description[lang]}\n\nDate: ${new Date(event.date).toLocaleString()}`)}`;
  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="event-detail-modal-title">
      <div className="bg-gray-800 text-gray-200 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
            <img src={event.imageUrl} alt={event.title[lang]} className="w-full h-64 object-cover rounded-t-lg" />
            <button onClick={onClose} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-black/60 text-white rounded-full p-2 leading-none text-2xl hover:bg-black/80">&times;</button>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow">
              <h2 id="event-detail-modal-title" className="text-3xl font-bold text-gray-100">{event.title[lang]}</h2>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-lg text-teal-400">{event.organizerName}</p>
                <button 
                  onClick={() => onViewProfile(event.organizerId)}
                  className="text-xs font-semibold text-gray-300 hover:text-teal-400 underline"
                >
                  ({t.viewProfile[lang]})
                </button>
              </div>
            </div>
            {isOwner && (
              <button 
                onClick={() => onEdit(event)}
                className="flex-shrink-0 px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 text-sm font-semibold transition-colors"
              >
                {t.editEvent[lang]}
              </button>
            )}
          </div>

          <p className="text-md text-gray-400 mt-1">{new Date(event.date).toLocaleString(getLocale(), { dateStyle: 'full', timeStyle: 'short' })}</p>
          <p className="text-md text-gray-500 mt-1">{event.venue}</p>
          
          {event.ticketInfo && (
            <div className="mt-2 flex items-center gap-2 text-md text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-lg px-3 py-1.5 w-max">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h12v1a1 1 0 01-1 1H6a1 1 0 01-1-1zm1-4a1 1 0 00-1 1v1h12v-1a1 1 0 00-1-1H5z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">{t.ticketInfo[lang]}:</span>
                <span>{event.ticketInfo}</span>
            </div>
          )}

          <p className="text-gray-300 mt-4 whitespace-pre-wrap">{event.description[lang]}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                  {event.coordinates && (
                    <>
                      <h3 className="font-bold text-lg border-b border-gray-700 pb-2">{t.location[lang]}</h3>
                      <EventMap coordinates={event.coordinates} venueName={event.venue} lang={lang} />
                    </>
                  )}
                  <h3 className={`font-bold text-lg border-b border-gray-700 pb-2 ${event.coordinates ? 'pt-4' : ''}`}>{t.organizerContact[lang]}</h3>
                  <div className="flex flex-col gap-2">
                    <button className="w-full text-left p-3 bg-gray-700 rounded-lg hover:bg-gray-600">{t.chat[lang]}</button>
                    <a href={callLink} className="w-full flex items-center gap-3 p-3 bg-blue-900/50 rounded-lg hover:bg-blue-800/50">
                        📞 {t.call[lang]}
                    </a>
                    {event.whatsappNumber && (
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 p-3 bg-green-900/50 rounded-lg hover:bg-green-800/50">
                          <WhatsAppIcon className="w-6 h-6 text-green-400" /> {t.whatsapp[lang]}
                        </a>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg border-b border-gray-700 pb-2 pt-4">{t.share[lang]}</h3>
                  <div className="flex gap-2">
                    <a href={gmailLink} className="flex-1 p-2 bg-red-900/50 rounded-lg flex justify-center items-center hover:bg-red-800/50"><GmailIcon className="w-6 h-6 text-red-400"/></a>
                    <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="flex-1 p-2 bg-blue-900/50 rounded-lg flex justify-center items-center hover:bg-blue-800/50"><FacebookIcon className="w-6 h-6 text-blue-400"/></a>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 p-2 bg-green-900/50 rounded-lg flex justify-center items-center hover:bg-green-800/50"><WhatsAppIcon className="w-6 h-6 text-green-400"/></a>
                  </div>
              </div>
              <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b border-gray-700 pb-2">{t.reviews[lang]}</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {event.reviews.map(review => (
                        <div key={review.id} className="flex gap-3">
                            <img src={review.user.avatarUrl} alt={review.user.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <button onClick={() => onViewProfile(review.user.id)} className="font-semibold text-gray-100 hover:underline">{review.user.name}</button>
                                <StarRating rating={review.rating} />
                                <p className="text-sm text-gray-400">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                    {event.reviews.length === 0 && <p className="text-sm text-gray-500">{lang === 'en' ? 'No reviews yet.' : (lang === 'ku' ? 'هیچ پێداچوونەوەیەک نیە.' : 'لا توجد تقييمات بعد.')}</p>}
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                      {currentUser ? (
                        <>
                          <h4 className="font-semibold mb-2">{t.addReview[lang]}</h4>
                          <StarRating rating={newRating} setRating={setNewRating} />
                          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded-lg p-2 mt-2 focus:ring-teal-500 focus:border-teal-500" placeholder={lang === 'en' ? 'Your comment...' : (lang === 'ku' ? 'کۆمێنتی تۆ...' : 'تعليقك...')}></textarea>
                          <button onClick={handleAddReview} className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700">{t.submitReview[lang]}</button>
                        </>
                      ) : (
                         <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <p className="text-gray-400">{t.loginToReview[lang]}</p>
                         </div>
                      )}
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};