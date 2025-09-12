import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { EventList } from './components/EventList';
import { LawyerList } from './components/LawyerList';
import { FilterBar } from './components/FilterBar';
import { SmartSearch } from './components/SmartSearch';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { LocalizationProvider } from './hooks/useLocalization';
import { CATEGORIES, LOCATIONS, PRACTICE_AREAS } from './constants';
import * as apiService from './services/api';
import type { Event, Lawyer } from './types';

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingLawyers, setIsLoadingLawyers] = useState(true);
  const [aiGeneratedEvents, setAiGeneratedEvents] = useState<Event[]>([]);
  const [aiGeneratedLawyers, setAiGeneratedLawyers] = useState<Lawyer[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [view, setView] = useState<'client' | 'lawyer'>('client');
  const [isAiSearching, setIsAiSearching] = useState(false);

  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    const fetchedEvents = await apiService.getEvents();
    setEvents(fetchedEvents);
    setIsLoadingEvents(false);
  }, []);

  const fetchLawyers = useCallback(async () => {
    setIsLoadingLawyers(true);
    const fetchedLawyers = await apiService.getLawyers();
    setLawyers(fetchedLawyers);
    setIsLoadingLawyers(false);
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchLawyers();
  }, [fetchEvents, fetchLawyers]);

  const handleFilterChange = (type: 'category' | 'practice_area' | 'location', value: string) => {
    if (type === 'category') {
      setSelectedCategories(prev =>
        prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
      );
    } else if (type === 'practice_area') {
      setSelectedPracticeAreas(prev =>
        prev.includes(value) ? prev.filter(pa => pa !== value) : [...prev, value]
      );
    } else {
      setSelectedLocations(prev =>
        prev.includes(value) ? prev.filter(l => l !== value) : [...prev, value]
      );
    }
  };

  const filteredEvents = useMemo(() => {
    const sourceEvents = aiGeneratedEvents.length > 0 ? aiGeneratedEvents : events;
    return sourceEvents.filter(event => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(event.category.id);
      const locationMatch = selectedLocations.length === 0 || selectedLocations.includes(event.location.id);
      return categoryMatch && locationMatch;
    });
  }, [events, aiGeneratedEvents, selectedCategories, selectedLocations]);

  const filteredLawyers = useMemo(() => {
    const sourceLawyers = aiGeneratedLawyers.length > 0 ? aiGeneratedLawyers : lawyers;
    return sourceLawyers.filter(lawyer => {
      const practiceAreaMatch = selectedPracticeAreas.length === 0 || 
        lawyer.practiceAreas.some(pa => selectedPracticeAreas.includes(pa.id));
      const locationMatch = selectedLocations.length === 0 || selectedLocations.includes(lawyer.location.id);
      return practiceAreaMatch && locationMatch;
    });
  }, [lawyers, aiGeneratedLawyers, selectedPracticeAreas, selectedLocations]);

  const clearAiResults = () => {
    setAiGeneratedEvents([]);
    setAiGeneratedLawyers([]);
    setSelectedCategories([]);
    setSelectedPracticeAreas([]);
    setSelectedLocations([]);
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'imageUrl' | 'category' | 'location'> & { category_id: string; location_id: string }) => {
    await apiService.addEvent(eventData);
    // Refresh events list from the "database"
    await fetchEvents();
    // Switch back to client view to see the new event
    setView('client');
  };

  const addLawyer = async (lawyerData: Omit<Lawyer, 'id' | 'profilePictureUrl' | 'practiceAreas' | 'location'> & { practiceAreaIds: string[]; location_id: string }) => {
    await apiService.addLawyer(lawyerData);
    // Refresh lawyers list from the "database"
    await fetchLawyers();
    // Switch back to client view to see the new lawyer
    setView('client');
  };


  return (
    <LocalizationProvider>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
        <Header currentView={view} setView={setView} />
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          {view === 'client' ? (
            <>
              {/* Hero Section */}
              <div className="text-center mb-12 py-8 px-4">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-brand-red to-red-600 rounded-full shadow-lg">
                  <svg width="40" height="40" viewBox="0 0 40 40" className="text-white">
                    <g transform="translate(20, 20)">
                      <line x1="0" y1="-15" x2="0" y2="12" stroke="currentColor" strokeWidth="2"/>
                      <line x1="-12" y1="-8" x2="12" y2="-8" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="-10" cy="-6" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="-16" y1="-6" x2="-4" y2="-6" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="-10" y1="-8" x2="-10" y2="-6" stroke="currentColor" strokeWidth="1"/>
                      <circle cx="10" cy="-6" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="4" y1="-6" x2="16" y2="-6" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="10" y1="-8" x2="10" y2="-6" stroke="currentColor" strokeWidth="1"/>
                      <ellipse cx="0" cy="12" rx="6" ry="2" fill="currentColor"/>
                    </g>
                  </svg>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-brand-red via-brand-green to-brand-red bg-clip-text text-transparent mb-4 leading-tight">
                  Iraqi Legal Directory
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-brand-red mb-2" dir="rtl">
                  دليل القانونيين العراقي
                </h2>
                <p className="text-xl text-gray-700 mt-4 max-w-2xl mx-auto leading-relaxed">
                  Find qualified lawyers across Iraq with professional legal expertise in multiple languages
                </p>
                <p className="text-lg text-gray-600 mt-2" dir="rtl">
                  اعثر على محامين مؤهلين في جميع أنحاء العراق
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-red text-white shadow-sm">
                    Professional Legal Services
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-green text-white shadow-sm">
                    Multilingual Support
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-gold text-white shadow-sm">
                    Trusted Directory
                  </span>
                </div>
              </div>

              <SmartSearch 
                onResults={setAiGeneratedLawyers} 
                onClear={clearAiResults}
                setIsLoading={setIsAiSearching}
                hasResults={aiGeneratedLawyers.length > 0}
              />
              
              <FilterBar
                categories={PRACTICE_AREAS}
                locations={LOCATIONS}
                selectedCategories={selectedPracticeAreas}
                selectedLocations={selectedLocations}
                onFilterChange={handleFilterChange}
                filterType="practice_area"
              />

              {isAiSearching || isLoadingLawyers ? (
                <div className="text-center p-12 bg-white rounded-2xl shadow-lg border border-gray-100 mx-auto max-w-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-brand-green to-green-600 rounded-full animate-pulse">
                    <svg className="w-8 h-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-brand-green">
                    {isAiSearching ? 'Searching for legal experts...' : 'Loading lawyers...'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Please wait while we find the best matches for you
                  </p>
                </div>
              ) : (
                <LawyerList lawyers={filteredLawyers} />
              )}
            </>
          ) : (
            <OrganizerDashboard addEvent={addEvent} />
          )}
        </main>
        
        {/* Enhanced Footer */}
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Logo and Description */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <svg width="32" height="32" viewBox="0 0 32 32" className="text-brand-red mr-3">
                    <g transform="translate(16, 16)">
                      <line x1="0" y1="-12" x2="0" y2="10" stroke="currentColor" strokeWidth="2"/>
                      <line x1="-10" y1="-6" x2="10" y2="-6" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="-8" cy="-4" r="5" fill="none" stroke="#007A3D" strokeWidth="1.5"/>
                      <line x1="-13" y1="-4" x2="-3" y2="-4" stroke="#007A3D" strokeWidth="1.5"/>
                      <line x1="-8" y1="-6" x2="-8" y2="-4" stroke="#007A3D" strokeWidth="1"/>
                      <circle cx="8" cy="-4" r="5" fill="none" stroke="#007A3D" strokeWidth="1.5"/>
                      <line x1="3" y1="-4" x2="13" y2="-4" stroke="#007A3D" strokeWidth="1.5"/>
                      <line x1="8" y1="-6" x2="8" y2="-4" stroke="#007A3D" strokeWidth="1"/>
                      <ellipse cx="0" cy="10" rx="5" ry="2" fill="currentColor"/>
                    </g>
                  </svg>
                  <div>
                    <h3 className="text-lg font-bold text-white">Iraqi Legal Directory</h3>
                    <p className="text-sm text-gray-300" dir="rtl">دليل القانونيين العراقي</p>
                  </div>
                </div>
                <p className="text-gray-300 max-w-md mx-auto md:mx-0">
                  Connecting clients with qualified legal professionals across Iraq through our comprehensive multilingual directory.
                </p>
              </div>
              
              {/* Quick Links */}
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4 text-brand-gold">Services</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>Find Legal Experts</li>
                  <li>Lawyer Registration</li>
                  <li>Legal Consultations</li>
                  <li>Professional Directory</li>
                </ul>
              </div>
              
              {/* Contact Info */}
              <div className="text-center md:text-right">
                <h4 className="text-lg font-semibold mb-4 text-brand-gold">Languages</h4>
                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">🇺🇸 English</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">🇮🇶 العربية</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">🟨🔴🟢 کوردی</span>
                </div>
                <p className="text-gray-300 mt-4 text-sm">
                  Professional legal services in your preferred language
                </p>
              </div>
            </div>
            
            {/* Copyright Bar */}
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                &copy; 2024 Iraqi Legal Directory. All rights reserved. | 
                <span dir="rtl" className="mr-2">© ٢٠٢٤ دليل القانونيين العراقي. جميع الحقوق محفوظة.</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Empowering access to justice through professional legal connections
              </p>
            </div>
          </div>
        </footer>
      </div>
    </LocalizationProvider>
  );
};

export default App;
