
import React from 'react';
import type { Event, Language } from '../types';

interface TopEventsCarouselProps {
    events: Event[];
    lang: Language;
    onSelectEvent: (event: Event) => void;
}

export const TopEventsCarousel: React.FC<TopEventsCarouselProps> = ({ events, lang, onSelectEvent }) => {
    if (!events || events.length === 0) {
        return null;
    }

    const t = {
        topEvents: { en: 'Top Events', ar: 'أبرز الفعاليات', ku: 'ئاهەنگە دیارەکان' },
    };

    return (
        <div className="py-8 bg-gray-800/50">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-gray-200 mb-4">{t.topEvents[lang]}</h2>
                <div 
                    className="flex overflow-x-auto pb-4 gap-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {events.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => onSelectEvent(event)}
                            className="flex-shrink-0 w-60 bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 group border border-gray-700 hover:border-orange-500/50"
                        >
                            <img
                                src={event.imageUrl}
                                alt={event.title[lang]}
                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                            <div className="p-3">
                                <h3 className="font-semibold text-gray-100 truncate">{event.title[lang]}</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {new Date(event.date).toLocaleDateString(lang === 'ku' ? 'ku-IQ' : lang === 'ar' ? 'ar-IQ' : 'en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Add styles to hide scrollbar for Webkit-based browsers */}
            <style>
                {`
                    .overflow-x-auto::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
        </div>
    );
};