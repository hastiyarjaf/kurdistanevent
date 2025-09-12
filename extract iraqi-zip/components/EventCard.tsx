
import React from 'react';
import type { Event } from '../types';
import type { Language } from '../types';

interface EventCardProps {
  event: Event;
  lang: Language;
  onSelect: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, lang, onSelect }) => {
  return (
    <div 
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer group border border-gray-700 hover:border-orange-500/50"
      onClick={() => onSelect(event)}
    >
      <div className="h-48 w-full overflow-hidden">
        <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" src={event.imageUrl} alt={event.title[lang]} loading="lazy" />
      </div>
      <div className="p-4">
        <h4 className="text-lg font-bold text-gray-100 truncate">{event.title[lang]}</h4>
        <p className="text-sm text-gray-400 mt-1">
          {new Date(event.date).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'ku' ? 'ku-IQ' : 'ar-IQ', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p className="text-sm text-gray-500 mt-1 truncate">{event.venue}</p>
        <div className="flex items-center mt-3">
          <span className="text-xs font-semibold text-orange-300 bg-orange-900/50 rounded-full px-2 py-0.5">
            {event.organizerName}
          </span>
        </div>
      </div>
    </div>
  );
};