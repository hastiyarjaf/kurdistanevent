
import React, { useState, useEffect } from 'react';
import type { Event, Language } from '../types';

interface FeaturedCarouselProps {
  events: Event[];
  lang: Language;
  onSelectEvent: (event: Event) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ events, lang, onSelectEvent }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearTimeout(timer);
  }, [currentIndex, events.length]);

  const t = {
    noEvents: { en: 'No Featured Events Available', ar: 'لا توجد فعاليات مميزة متاحة', ku: 'هیچ ڕووداوێکی دیاریکراو بەردەست نییە' },
    checkBack: { en: 'Check back later for new and exciting events!', ar: 'تحقق مرة أخرى لاحقًا للحصول على فعاليات جديدة ومثيرة!', ku: 'دواتر بگەڕێوە بۆ ڕووداوی نوێ و سەرنجڕاکێش!' },
  }

  if (!events || events.length === 0) {
    return (
        <div className="relative w-full h-[75vh] bg-gray-800 flex items-center justify-center">
            <div className="text-center">
                <p className="text-2xl text-gray-500">{t.noEvents[lang]}</p>
                <p className="text-gray-600">{t.checkBack[lang]}</p>
            </div>
        </div>
    );
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[75vh] overflow-hidden">
      {events.map((event, index) => (
        <div
          key={event.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => onSelectEvent(event)}
        >
          <img src={event.imageUrl} alt={event.title[lang]} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end items-start p-8 md:p-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 shadow-xl">{event.title[lang]}</h2>
            <p className="text-lg text-gray-300 mb-6 shadow-lg max-w-2xl">{new Date(event.date).toLocaleDateString(lang === 'ku' ? 'ku-IQ' : lang === 'ar' ? 'ar-IQ' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {event.venue}</p>
          </div>
        </div>
      ))}
       <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-orange-400' : 'bg-gray-400/50 hover:bg-gray-400'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};