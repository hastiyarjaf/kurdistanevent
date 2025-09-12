
import React, { useState } from 'react';
import type { Event } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { CalendarIcon, LocationMarkerIcon, TagIcon, TranslateIcon } from './icons/Icons';
import { translateText } from '../services/geminiService';
import { LANGUAGES } from '../constants';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { language, translateName } = useLocalization();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [translatedContent, setTranslatedContent] = useState<{ title: string; description: string } | null>(null);

  
  const eventDate = new Date(event.date);
  const formattedDate = new Intl.DateTimeFormat(language.replace('_', '-'), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(eventDate);

  const nativeTitle = event.title[language];
  const nativeDescription = event.description[language];

  const title = translatedContent?.title || nativeTitle || event.title.en;
  const description = translatedContent?.description || nativeDescription || event.description.en;

  const needsTranslation = language !== 'en' && (!nativeTitle || !nativeDescription);

  const handleTranslate = async () => {
    setIsTranslating(true);
    setTranslationError(null);
    try {
      const targetLanguageName = LANGUAGES.find(l => l.code === language)?.name || 'the selected language';
      const [translatedTitle, translatedDescription] = await Promise.all([
        translateText(event.title.en, targetLanguageName),
        translateText(event.description.en, targetLanguageName),
      ]);
      setTranslatedContent({ title: translatedTitle, description: translatedDescription });
    } catch (error) {
      setTranslationError("Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <img className="w-full h-48 object-cover" src={event.imageUrl} alt={title} />
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-sm text-green-600 font-semibold flex items-center mb-1">
            <TagIcon className="w-4 h-4 mr-1.5"/>
            {translateName(event.category)}
          </p>
          <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-100 space-y-2">
           <div className="flex items-center text-sm text-gray-500">
             <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
             <span>{formattedDate}</span>
           </div>
           <div className="flex items-center text-sm text-gray-500">
             <LocationMarkerIcon className="w-4 h-4 mr-2 text-gray-400" />
             <span>{translateName(event.location)}</span>
           </div>
           {needsTranslation && !translatedContent && (
              <div className="pt-2">
                <button 
                    onClick={handleTranslate} 
                    disabled={isTranslating}
                    className="w-full flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                    <TranslateIcon className="w-4 h-4 mr-2"/>
                    {isTranslating ? 'Translating...' : 'Translate with AI'}
                </button>
                {translationError && <p className="text-red-500 text-xs mt-1 text-center">{translationError}</p>}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
