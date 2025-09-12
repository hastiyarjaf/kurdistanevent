
import React from 'react';
import { EventCard } from './EventCard';
import type { Event } from '../types';
import { useLocalization } from '../hooks/useLocalization';

interface EventListProps {
  events: Event[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => {
  const { t } = useLocalization();

  if (events.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700">{t('no_events_found')}</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
