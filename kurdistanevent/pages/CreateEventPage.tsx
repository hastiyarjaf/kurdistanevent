import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent, getCategories, getCities, updateHostProfile } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { Event, Category, Language, City, User } from '../types';
import { Upload, X } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';
import { useTranslation } from '../hooks/useTranslation';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useAuth } from '../hooks/useAuth';

const organizerTypes = [
    'organizerType.venue',
    'organizerType.instructor',
    'organizerType.foodVendor',
    'organizerType.conference',
    'organizerType.nonProfit',
    'organizerType.other',
];

// Component for the host onboarding form
const HostOnboardingForm: React.FC<{ onProfileSubmitted: (user: User) => void }> = ({ onProfileSubmitted }) => {
    const { t } = useTranslation();
    const [businessName, setBusinessName] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [organizerType, setOrganizerType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const updatedUser = await updateHostProfile({
                businessName,
                phone,
                website,
                businessAddress,
                organizerType,
            });
            onProfileSubmitted(updatedUser);
        } catch (err) {
            setError('errors.unexpected');
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <div className="max-w-2xl mx-auto bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-2xl text-center">
            <h1 className="text-3xl font-display font-bold text-text-primary dark:text-dark-text-primary mb-4">{t('createEvent.completeProfileTitle')}</h1>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-8">{t('createEvent.completeProfileMessage')}</p>
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <Input id="businessName" label={t('welcome.businessNameLabel')} type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required />
                <Input id="phone" label={t('welcome.phoneLabel')} type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
                <Input id="businessAddress" label={t('welcome.businessAddressLabel')} type="text" value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} required />
                <div>
                    <label htmlFor="organizerType" className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">{t('welcome.organizerTypeLabel')}</label>
                    <select id="organizerType" value={organizerType} onChange={e => setOrganizerType(e.target.value)} required className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:border-dark-border dark:text-dark-text-primary">
                        <option value="" disabled>{t('welcome.selectOrganizerType')}</option>
                        {organizerTypes.map(typeKey => (
                            <option key={typeKey} value={t(typeKey, { lng: 'en' })}>{t(typeKey)}</option>
                        ))}
                    </select>
                </div>
                <Input id="website" label={t('welcome.websiteLabel')} type="url" value={website} onChange={e => setWebsite(e.target.value)} />
                
                {error && <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{t(error)}</p>}
                
                <div className="pt-4">
                    <Button type="submit" className="w-full" isLoading={isLoading} size="lg">{t('createEvent.submitProfileButton')}</Button>
                </div>
            </form>
        </div>
    );
};

const CreateEventPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [titles, setTitles] = useState<Record<Language, string>>({ en: '', ar: '', ku: '' });
  const [descriptions, setDescriptions] = useState<Record<Language, string>>({ en: '', ar: '', ku: '' });
  const [activeLangTab, setActiveLangTab] = useState<Language>('en');

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState<{ address: string; latLng: string; } | null>(null);
  const [cityId, setCityId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [imageData, setImageData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  usePageMetadata('meta.create.title', 'meta.create.description');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cats, cityData] = await Promise.all([getCategories(), getCities()]);
        setCategories(cats);
        setCities(cityData);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("errors.unexpected");
      }
    };
    fetchInitialData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  const removeImage = () => {
      setImageData(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (user?.role === 'host' && user.verificationStatus !== 'approved') {
      setError('createEvent.unverifiedHost');
      setIsLoading(false);
      return;
    }

    if (!date || !time) { setError('createEvent.error.dateTime'); setIsLoading(false); return; }
    if (!cityId) { setError('createEvent.error.city'); setIsLoading(false); return; }
    if (!categoryId) { setError('createEvent.error.category'); setIsLoading(false); return; }
    if (!imageData) { setError('createEvent.error.image'); setIsLoading(false); return; }
    if (!location) { setError('createEvent.error.location'); setIsLoading(false); return; }
    if (!titles.en || !descriptions.en) { setError('createEvent.error.englishRequired'); setIsLoading(false); return; }
    
    const eventDateTime = new Date(`${date}T${time}`).toISOString();

    const newEventData: Omit<Event, 'id' | 'creator_id' | 'creator' | 'category' | 'city'> = {
      title: titles,
      description: descriptions,
      date: eventDateTime,
      location_address: location.address,
      location_latLng: location.latLng,
      image: imageData,
      category_id: categoryId,
      city_id: cityId,
    };

    try {
      await createEvent(newEventData);
      navigate('/');
    } catch (err: any) {
      setError('errors.unexpected');
    } finally {
      setIsLoading(false);
    }
  };

  const LangTabs = () => (
    <div className="flex border-b border-border dark:border-dark-border mb-4">
      {(['en', 'ar', 'ku'] as Language[]).map(lang => (
        <button
          key={lang}
          type="button"
          onClick={() => setActiveLangTab(lang)}
          className={`px-4 py-2 text-sm font-display font-semibold -mb-px border-b-2 ${
            activeLangTab === lang
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );

  const handleProfileSubmitted = (updatedUser: User) => {
    updateUser(updatedUser);
  };

  if (user?.role === 'host') {
    if (user.verificationStatus === 'unsubmitted') {
      return <HostOnboardingForm onProfileSubmitted={handleProfileSubmitted} />;
    }
    if (user.verificationStatus === 'pending') {
      return (
        <div className="max-w-2xl mx-auto bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-2xl text-center">
          <h1 className="text-3xl font-display font-bold text-text-primary dark:text-dark-text-primary mb-4">{t('verification.pendingTitle')}</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">{t('verification.pendingMessage')}</p>
        </div>
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-2xl">
      <h1 className="text-4xl font-display font-bold text-center text-text-primary dark:text-dark-text-primary mb-8">{t('createEvent.title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">{t('createEvent.eventTitleLabel')}</label>
          <LangTabs />
          <Input id="title" label="" value={titles[activeLangTab]} onChange={e => setTitles({...titles, [activeLangTab]: e.target.value})} required={activeLangTab==='en'} />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">{t('createEvent.descriptionLabel')}</label>
          <LangTabs />
          <textarea
            id="description"
            rows={4}
            value={descriptions[activeLangTab]}
            onChange={e => setDescriptions({...descriptions, [activeLangTab]: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-dark-surface/50 dark:border-dark-border dark:text-dark-text-primary"
            required={activeLangTab==='en'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">{t('createEvent.cityLabel')}</label>
            <select id="city" value={cityId} onChange={e => setCityId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:border-dark-border dark:text-dark-text-primary" required >
              <option value="" disabled>{t('createEvent.selectCity')}</option>
              {cities.map(city => ( <option key={city.id} value={city.id}>{city.name[language]}</option> ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">{t('createEvent.categoryLabel')}</label>
            <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:border-dark-border dark:text-dark-text-primary" required >
              <option value="" disabled>{t('createEvent.selectCategory')}</option>
              {categories.map(cat => ( <option key={cat.id} value={cat.id}>{t(cat.translation_key)}</option> ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input id="date" label={t('createEvent.dateLabel')} type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <Input id="time" label={t('createEvent.timeLabel')} type="time" value={time} onChange={e => setTime(e.target.value)} required />
        </div>

        <div>
            <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">{t('createEvent.locationLabel')}</label>
            <LocationPicker value={location} onChange={setLocation}/>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">{t('createEvent.imageLabel')}</label>
            <div className="w-full aspect-video bg-background dark:bg-dark-background rounded-md flex items-center justify-center overflow-hidden relative border-2 border-dashed border-border dark:border-dark-border">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                {imageData ? (
                    <>
                        <img src={imageData} alt="Event preview" className="w-full h-full object-cover" />
                        <div className="absolute top-2 end-2 flex space-x-2">
                             <Button type="button" onClick={triggerImageUpload} variant="secondary" size="sm" className="flex items-center space-x-1 rtl:space-x-reverse">
                                <span>{t('createEvent.changePhoto')}</span>
                            </Button>
                            <Button type="button" onClick={removeImage} variant="danger" size="sm" className="p-2">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </>
                ) : (
                    <Button type="button" onClick={triggerImageUpload} variant="ghost" className="flex flex-col items-center space-y-2 text-text-secondary">
                        <Upload className="h-12 w-12"/>
                        <span className="font-semibold">{t('createEvent.uploadPhoto')}</span>
                    </Button>
                )}
            </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{t(error)}</p>}
        
        <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={isLoading} size="lg">{t('createEvent.submitButton')}</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;