import React, { useState, useEffect } from 'react';
import { Event, Category, City, Banner } from '../types';
import { getEvents, getCategories, getCities, getBanners } from '../services/api';
import EventCard from '../components/EventCard';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import BannerAd from '../components/BannerAd';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useTranslation();
  const { user } = useAuth();

  usePageMetadata('meta.home.title', 'meta.home.description');
  
  const isHostPendingVerification = user?.role === 'host' && user.verificationStatus === 'pending';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cats, cityData] = await Promise.all([getCategories(), getCities()]);
        setCategories(cats);
        setCities(cityData);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
        setError("errors.loadFilters");
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [eventData, bannerData] = await Promise.all([
          getEvents({ cityId: selectedCityId, categoryId: selectedCategoryId }),
          getBanners({ cityId: selectedCityId, placement: 'home_top' })
        ]);
        setEvents(eventData);
        setBanner(bannerData.length > 0 ? bannerData[0] : null);
      } catch (err: any) {
        setError('errors.fetchEvents');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPageData();
  }, [selectedCityId, selectedCategoryId, language]);

  const CityFilterBar = () => (
    <div className="mb-4 border-b border-border dark:border-dark-border">
      <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-px -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setSelectedCityId(null)}
          className={`py-3 px-2 border-b-2 font-display font-semibold text-sm transition-colors flex-shrink-0 whitespace-nowrap ${
            selectedCityId === null
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
          }`}
        >
          {t('home.allIraq')}
        </button>
        {cities.map(city => (
          <button
            key={city.id}
            onClick={() => setSelectedCityId(city.id)}
            className={`py-3 px-2 border-b-2 font-display font-semibold text-sm transition-colors flex-shrink-0 whitespace-nowrap ${
              selectedCityId === city.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
            }`}
          >
            {city.name[language]}
          </button>
        ))}
      </div>
    </div>
  );

  const CategoryFilterBar = () => (
    <div className="mb-8">
      <div className="flex space-x-2 rtl:space-x-reverse overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-2 rounded-full font-display font-semibold text-sm transition-colors flex-shrink-0 whitespace-nowrap ${
            selectedCategoryId === null
              ? 'bg-primary text-white'
              : 'bg-surface dark:bg-dark-surface text-text-secondary dark:text-dark-text-secondary hover:bg-border/50 dark:hover:bg-dark-border'
          }`}
        >
          {t('home.all')}
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={`px-4 py-2 rounded-full font-display font-semibold text-sm transition-colors flex-shrink-0 whitespace-nowrap flex items-center group ${
              selectedCategoryId === category.id
                ? 'bg-primary text-white'
                : 'bg-surface dark:bg-dark-surface text-text-secondary dark:text-dark-text-secondary hover:bg-border/50 dark:hover:bg-dark-border'
            }`}
          >
            {t(category.translation_key)}
            {category.sponsor && (
                <span className="ms-2 text-xs opacity-75 font-normal" title={t('category.sponsoredBy', { name: category.sponsor.name })}>
                    <img src={category.sponsor.logo_url} alt={category.sponsor.name} className="h-4 w-4 rounded-full inline-block" />
                </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  if (error) {
    return <div className="text-center text-red-500 text-xl">{t(error)}</div>;
  }

  return (
    <div>
      {isHostPendingVerification && (
        <div className="bg-accent-gold/20 dark:bg-accent-gold/10 border-l-4 border-accent-gold text-text-primary dark:text-dark-text-primary p-4 mb-6 rounded-r-lg" role="alert">
          <p className="font-display font-bold">{t('verification.pendingTitle')}</p>
          <p>{t('verification.pendingMessage')}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-display font-extrabold text-text-primary dark:text-dark-text-primary">{t('home.title')}</h1>
        <Link to="/create-event">
          <Button variant="primary" size="lg" className="flex items-center space-x-2 rtl:space-x-reverse">
            <PlusCircle />
            <span className="hidden sm:inline">{t('home.newEvent')}</span>
          </Button>
        </Link>
      </div>

      <CityFilterBar />

      {banner && <div className="my-6"><BannerAd banner={banner}/></div>}

      <CategoryFilterBar />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface dark:bg-dark-surface rounded-lg shadow-lg animate-pulse">
              <div className="w-full h-48 bg-border dark:bg-dark-border"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-border dark:bg-dark-border rounded w-1/4"></div>
                <div className="h-6 bg-border dark:bg-dark-border rounded w-3/4"></div>
                <div className="h-4 bg-border dark:bg-dark-border rounded w-1/2"></div>
                <div className="h-4 bg-border dark:bg-dark-border rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface dark:bg-dark-surface rounded-lg shadow-md">
          <h2 className="text-2xl font-display font-semibold mb-2">{t('home.noEventsFound')}</h2>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            {t('home.noEventsInCity')}
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;