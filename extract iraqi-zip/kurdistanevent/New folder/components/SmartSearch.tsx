
import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { generateEventSuggestions } from '../services/geminiService';
import type { Event } from '../types';
import { SparklesIcon, XCircleIcon } from './icons/Icons';

interface SmartSearchProps {
  onResults: (events: Event[]) => void;
  onClear: () => void;
  setIsLoading: (isLoading: boolean) => void;
  hasResults: boolean;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ onResults, onClear, setIsLoading, hasResults }) => {
  const { t } = useLocalization();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const results = await generateEventSuggestions(query);
      onResults(results);
    } catch (err) {
      setError((err as Error).message);
      onResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-yellow-300">
      <div className="flex items-center mb-4">
        <SparklesIcon className="w-8 h-8 text-yellow-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">{t('ai_results_title')}</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('smart_search_placeholder')}
          className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
        />
        <button
          onClick={handleSearch}
          className="w-full md:w-auto flex justify-center items-center px-6 py-3 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 transition-colors"
        >
          {t('search')}
        </button>
        {hasResults && (
           <button
             onClick={() => {
               onClear();
               setQuery('');
               setError(null);
             }}
             className="w-full md:w-auto flex justify-center items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
           >
             <XCircleIcon className="w-5 h-5 mr-2" />
             {t('clear_results')}
           </button>
        )}
      </div>
      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
    </div>
  );
};
