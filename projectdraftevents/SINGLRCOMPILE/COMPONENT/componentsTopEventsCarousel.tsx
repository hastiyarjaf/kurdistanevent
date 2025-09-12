import React, { useState } from 'react';
import type { Event, Language } from '../types';

interface TopEventsCarouselProps {
    events: Event[];
    lang: Language;
    onSelectEvent: (event: Event) => void;
}

export const TopEventsCarousel: React.FC<TopEventsCarouselProps> = ({ events, lang, onSelectEvent }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!events || events.length === 0) {
        return null;
    }
    
    const selectedEvent = events[selectedIndex];

    const t = {
      topEvents: { en: 'Top Events', ar: 'أبرز الفعاليات', ku: 'ئاهەنگە دیارەکان' },
      seeDetails: { en: 'See Details', ar: 'انظر التفاصيل', ku: 'وردەکارییەکان ببینە' }
    }

    return (
        <div className="w-full flex flex-col items-center py-8 bg-gray-800/50 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-200 mb-6">{t.topEvents[lang]}</h2>
            
            <div className="text-center mb-8 h-48 flex flex-col items-center justify-center">
                <div className="relative w-full h-full">
                    {events.map((event, index) => (
                        <div
                            key={event.id}
                            className={`absolute inset-0 transition-opacity duration-300 ${index === selectedIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {index === selectedIndex && (
                                <div className="flex flex-col items-center">
                                    <img src={event.imageUrl} alt={event.title[lang]} className="w-40 h-24 object-cover rounded-lg mx-auto mb-3 shadow-lg" />
                                    <h3 className="text-lg font-bold text-gray-100">{event.title[lang]}</h3>
                                    <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString(lang, { month: 'long', day: 'numeric' })}</p>
                                    <button onClick={() => onSelectEvent(event)} className="mt-2 px-4 py-1 text-xs font-semibold bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors">
                                        {t.seeDetails[lang]}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-2xl h-px bg-gray-600 relative flex justify-center items-center">
                <div className="flex items-center" style={{ columnGap: '80px' }}>
                    {events.map((event, index) => (
                        <button
                            key={event.id}
                            onClick={() => setSelectedIndex(index)}
                            className="relative flex flex-col items-center"
                        >
                            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedIndex === index ? 'bg-teal-400 scale-150' : 'bg-gray-500 hover:bg-gray-400'}`}></div>
                            <div className={`absolute -bottom-5 text-xs transition-opacity duration-300 ${selectedIndex === index ? 'opacity-100 text-teal-400' : 'opacity-0'}`}>
                                {new Date(event.date).toLocaleDateString(lang, { month: 'short' })}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};