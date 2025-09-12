
import React, { useState, useEffect } from 'react';
import type { City, Category, Language } from '../types';

interface SearchBarProps {
    cities: City[];
    categories: Category[];
    lang: Language;
    onFilterChange: (type: string, value: string) => void;
    currentFilters: {
        query: string;
        month: string;
        category: string | null;
        city: string | null;
    };
    isMyEventsActive: boolean;
    onClearMyEvents: () => void;
}

const months = [
    { num: 0, names: { en: 'January', ar: 'يناير', ku: 'کانوونی دووەم' } },
    { num: 1, names: { en: 'February', ar: 'فبراير', ku: 'شوبات' } },
    { num: 2, names: { en: 'March', ar: 'مارس', ku: 'ئازار' } },
    { num: 3, names: { en: 'April', ar: 'أبريل', ku: 'نیسان' } },
    { num: 4, names: { en: 'May', ar: 'مايو', ku: 'ئایار' } },
    { num: 5, names: { en: 'June', ar: 'يونيو', ku: 'حوزەیران' } },
    { num: 6, names: { en: 'July', ar: 'يوليو', ku: 'تەمووز' } },
    { num: 7, names: { en: 'August', ar: 'أغسطس', ku: 'ئاب' } },
    { num: 8, names: { en: 'September', ar: 'سبتمبر', ku: 'ئەیلوول' } },
    { num: 9, names: { en: 'October', ar: 'أكتوبر', ku: 'تشرینی یەکەم' } },
    { num: 10, names: { en: 'November', ar: 'نوفمبر', ku: 'تشرینی دووەم' } },
    { num: 11, names: { en: 'December', ar: 'ديسمبر', ku: 'کانوونی یەکەم' } },
];

export const SearchBar: React.FC<SearchBarProps> = ({ cities, categories, lang, onFilterChange, currentFilters, isMyEventsActive, onClearMyEvents }) => {
    const [searchQuery, setSearchQuery] = useState(currentFilters.query);

    const t = {
        searchPlaceholder: { en: 'Search events...', ar: 'ابحث عن الفعاليات...', ku: 'بگەڕێ بۆ ڕووداوەکان...' },
        allMonths: { en: 'All Months', ar: 'كل الشهور', ku: 'هەموو مانگەکان' },
        allCategories: { en: 'All Categories', ar: 'كل التصنيفات', ku: 'هەموو پۆلەکان' },
        allCities: { en: 'All Cities', ar: 'كل المدن', ku: 'هەموو شارەکان' },
        myEvents: { en: 'Showing My Events', ar: 'عرض فعالياتي', ku: 'ڕووداوەکانی من' },
    };

    // Debounce effect for search query
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== currentFilters.query) {
                onFilterChange('query', searchQuery);
            }
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, onFilterChange, currentFilters.query]);

    // Sync local state if external filter changes
    useEffect(() => {
        setSearchQuery(currentFilters.query);
    }, [currentFilters.query]);


    const selectClasses = "w-full bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5";

    return (
        <div className="bg-gray-800 p-4 border-y border-gray-700">
            <div className="container mx-auto">
                <div className="flex flex-col gap-4">
                    {/* Line 1: Search Input */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input
                                type="search"
                                id="event-search"
                                className="block w-full p-2.5 ps-10 text-sm text-gray-100 border border-gray-600 rounded-lg bg-gray-700 focus:ring-orange-500 focus:border-orange-500"
                                placeholder={t.searchPlaceholder[lang]}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label={t.searchPlaceholder[lang]}
                            />
                        </div>
                         {isMyEventsActive && (
                            <div className="flex-shrink-0 bg-orange-900 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
                                <span>{t.myEvents[lang]}</span>
                                <button onClick={onClearMyEvents} className="text-orange-200 hover:text-white text-lg leading-none -mt-0.5">&times;</button>
                            </div>
                        )}
                    </div>
                
                    {/* Line 2: Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <select id="city-filter" className={selectClasses} value={currentFilters.city || ''} onChange={(e) => onFilterChange('city', e.target.value)} aria-label="Filter by city">
                            <option value="">{t.allCities[lang]}</option>
                            {cities.map(c => <option key={c.id} value={c.id}>{c.name[lang]}</option>)}
                        </select>
                        <select id="category-filter" className={selectClasses} value={currentFilters.category || ''} onChange={(e) => onFilterChange('category', e.target.value)} aria-label="Filter by category">
                            <option value="">{t.allCategories[lang]}</option>
                            {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name[lang]}</option>)}
                        </select>
                        <select id="month-filter" className={selectClasses} value={currentFilters.month} onChange={(e) => onFilterChange('month', e.target.value)} aria-label="Filter by month">
                            <option value="">{t.allMonths[lang]}</option>
                            {months.map(m => <option key={m.num} value={m.num.toString()}>{m.names[lang]}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};