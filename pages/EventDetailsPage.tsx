import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Event, Banner, User } from '../types';
import { getEventById, getBanners, toggleEventAttendance } from '../services/api';
import { ArrowLeft, Calendar, MapPin, Tag, Building2, Users } from 'lucide-react';
import Button from '../components/Button';
import InteractiveMap from '../components/InteractiveMap';
import { useTranslation } from '../hooks/useTranslation';
import BannerAd from '../components/BannerAd';
import { usePageMetadata } from '../hooks/usePageMetadata';
import ShareButton from '../components/ShareButton';
import { useAuth } from '../hooks/useAuth';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isAttending, setIsAttending] = useState(false);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);


  const eventNameForTitle = event ? event.title[language] : '...';
  usePageMetadata('meta.event.title', 'meta.event.description', { eventName: eventNameForTitle });

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getEventById(id);
        if (data) {
          setEvent(data);
          const bannerData = await getBanners({ cityId: data.city_id, placement: 'details_bottom' });
          setBanner(bannerData.length > 0 ? bannerData[0] : null);
          const currentUserIsAttending = data.attendees?.some(attendee => attendee.id === user?.id) ?? false;
          setIsAttending(currentUserIsAttending);
        } else {
          setError('eventDetails.notFound');
        }
      } catch (err: any) {
        setError('errors.fetchEvents');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id, language, user]);
  
  const handleToggleAttendance = async () => {
    if (!event || !user) return;
    setIsAttendanceLoading(true);
    try {
        const updatedEvent = await toggleEventAttendance(event.id);
        setEvent(updatedEvent);
        setIsAttending(updatedEvent.attendees?.some(attendee => attendee.id === user.id) ?? false);
    } catch (error) {
        console.error("Failed to toggle attendance:", error);
    } finally {
        setIsAttendanceLoading(false);
    }
  };

  const handleContactOrganizer = () => {
    if (event?.creator) {
      navigate(`/messages/${event.creator.id}`);
    }
  };


  if (isLoading) {
    return (
        <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-96 bg-border dark:bg-dark-border rounded-lg mb-8"></div>
            <div className="h-10 bg-border dark:bg-dark-border rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
                <div className="h-4 bg-border dark:bg-dark-border rounded w-full"></div>
                <div className="h-4 bg-border dark:bg-dark-border rounded w-full"></div>
                <div className="h-4 bg-border dark:bg-dark-border rounded w-5/6"></div>
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-2xl">{t(error)}</div>;
  }
  
  if (!event) {
    return <div className="text-center text-gray-500 text-2xl">Event details could not be loaded.</div>
  }

  const formattedDate = new Date(event.date).toLocaleString(language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
  });
  
  const eventDateStr = new Date(event.date).toLocaleDateString(language, { month: 'long', day: 'numeric' });
  const shareText = [
    t('share.teaser'),
    t('share.eventInfo', { eventName: event.title[language], eventDate: eventDateStr }),
    t('share.cta')
  ].join('\n\n');

  // This URL should point to the app's landing/download page.
  const shareUrl = 'https://www.kurdistan-connect-festival.com/app';


  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <Link to="/">
                <Button variant="ghost" className="flex items-center space-x-2 rtl:space-x-reverse border border-border dark:border-dark-border">
                    <ArrowLeft className="h-5 w-5" />
                    <span>{t('eventDetails.back')}</span>
                </Button>
            </Link>
            <ShareButton 
                title={event.title[language]} 
                text={shareText} 
                url={shareUrl} 
            />
        </div>
        <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl overflow-hidden">
            <img src={event.image} alt={event.title[language]} className="w-full h-64 md:h-96 object-cover" />
            <div className="p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-display font-extrabold text-text-primary dark:text-dark-text-primary mb-4">{event.title[language]}</h1>
                
                <div className="flex flex-wrap gap-x-8 gap-y-4 text-lg text-text-secondary dark:text-dark-text-secondary mb-6">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Calendar className="h-6 w-6 text-primary" />
                        <span>{formattedDate}</span>
                    </div>
                    {event.category && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Tag className="h-6 w-6 text-primary" />
                            <span>{t(event.category.translation_key)}</span>
                        </div>
                    )}
                    {event.city && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Building2 className="h-6 w-6 text-primary" />
                            <span>{event.city.name[language]}</span>
                        </div>
                    )}
                </div>

                <div className="my-8 p-6 bg-background dark:bg-dark-background rounded-lg border border-border dark:border-dark-border">
                    <h2 className="text-2xl font-display font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
                        <Users className="h-6 w-6 me-3 text-primary" />
                        {t('eventDetails.whosGoing')}
                    </h2>
                    {event.attendees && event.attendees.length > 0 ? (
                        <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                            {event.attendees.map(attendee => (
                                <img
                                    key={attendee.id}
                                    className="inline-block h-12 w-12 rounded-full ring-2 ring-surface dark:ring-dark-surface"
                                    src={attendee.profile_picture}
                                    alt={attendee.name}
                                    title={attendee.name}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-text-secondary dark:text-dark-text-secondary">{t('eventDetails.noAttendees')}</p>
                    )}
                    <Button 
                        onClick={handleToggleAttendance}
                        isLoading={isAttendanceLoading}
                        variant={isAttending ? 'secondary' : 'primary'}
                        className="w-full mt-6"
                        size="lg"
                    >
                        {isAttending ? t('eventDetails.attending') : t('eventDetails.attend')}
                    </Button>
                </div>
                
                <h2 className="text-2xl font-display font-bold text-text-primary dark:text-dark-text-primary mt-10 mb-4">{t('eventDetails.location')}</h2>
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-lg text-text-secondary dark:text-dark-text-secondary mb-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                    <span>{event.location_address}</span>
                </div>
                 <div className="my-6 h-96 w-full rounded-lg overflow-hidden border border-border dark:border-dark-border shadow-md">
                    <InteractiveMap latLng={event.location_latLng} />
                </div>
                
                <h2 className="text-2xl font-display font-bold text-text-primary dark:text-dark-text-primary mt-10 mb-4">{t('eventDetails.about')}</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-text-secondary dark:text-dark-text-secondary mb-8 whitespace-pre-wrap">
                    {event.description[language]}
                </div>

                {event.creator && (
                    <div className="pt-6 border-t border-border dark:border-dark-border">
                        <h3 className="text-xl font-display font-semibold mb-3 text-text-primary dark:text-dark-text-primary">{t('eventDetails.organizer')}</h3>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <img src={event.creator.profile_picture} alt={event.creator.name} className="h-14 w-14 rounded-full" />
                            <div>
                                <p className="font-display font-bold text-lg text-text-primary dark:text-dark-text-primary">{event.creator.name}</p>
                                <Button onClick={handleContactOrganizer} variant="secondary" size="sm" className="mt-1">{t('eventDetails.contactOrganizer')}</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        {banner && (
            <div className="mt-12">
                <BannerAd banner={banner} />
            </div>
        )}
    </div>
  );
};

export default EventDetailsPage;