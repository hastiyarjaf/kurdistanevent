import React from 'react';
import type { Event } from '../types';
import type { Language } from '../types';
import { EventCard } from './EventCard';

interface EventGridProps {
  events: Event[];
  lang: Language;
  onSelectEvent: (event: Event) => void;
}

export const EventGrid: React.FC<EventGridProps> = ({ events, lang, onSelectEvent }) => {
  const t = {
    upcoming: { en: 'Upcoming Events', ar: 'الفعاليات القادمة' , ku: 'ڕووداوە چاوەڕوانکراوەکان' },
    noEvents: { en: 'No events match your criteria.', ar: 'لا توجد فعاليات تطابق بحثك.' , ku: 'هیچ ڕووداوێک لەگەڵ پێوەرەکانی تۆ ناگونجێت.'},
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-100 mb-6">{t.upcoming[lang]}</h2>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} lang={lang} onSelect={onSelectEvent} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-500">{t.noEvents[lang]}</p>
        </div>
      )}
    </div>
  );
};