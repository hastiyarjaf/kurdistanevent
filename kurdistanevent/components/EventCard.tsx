import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { trackSponsoredEventClick } from '../services/api';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const { language, t } = useTranslation();
    
    const formattedDate = new Date(event.date).toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });

    const handleSponsoredClick = () => {
        if(event.is_promoted) {
            trackSponsoredEventClick(event.id);
        }
    }

    return (
        <Link to={`/event/${event.id}`} className="block group" onClick={handleSponsoredClick}>
            <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full relative">
                {event.is_promoted && (
                    <div 
                        className="absolute top-3 end-3 bg-accent-gold text-text-primary text-xs font-bold px-2 py-1 rounded-full shadow-md z-10"
                        title={t('eventCard.sponsoredTooltip')}
                    >
                        {t('eventCard.sponsored')}
                    </div>
                )}
                <img src={event.image} alt={event.title[language]} className="w-full h-48 object-cover" />
                <div className="p-6 flex flex-col flex-grow">
                    {event.category && (
                        <div className="flex items-center space-x-2 text-sm font-display font-semibold text-secondary dark:text-secondary mb-2">
                            <Tag className="h-4 w-4" />
                            <span>{t(event.category.translation_key).toUpperCase()}</span>
                        </div>
                    )}
                    <h2 className="text-2xl font-display font-bold mb-2 text-text-primary dark:text-dark-text-primary group-hover:text-primary transition-colors flex-grow">
                        {event.title[language]}
                    </h2>
                    <div className="space-y-3 text-text-secondary dark:text-dark-text-secondary mt-2">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                             <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="truncate">{event.location_address}</span>
                        </div>
                    </div>
                     {event.creator && (
                        <div className="flex items-center space-x-2 pt-4 mt-auto text-text-secondary dark:text-dark-text-secondary">
                            <img src={event.creator.profile_picture} alt={event.creator.name} className="h-6 w-6 rounded-full" />
                            <span className="text-sm">{t('eventCard.createdBy', { name: event.creator.name })}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default EventCard;