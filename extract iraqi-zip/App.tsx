
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Language, Event, City, Category, AuthMode, AIAutofillData, User, Review } from './types';
import { Header } from './components/Header';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { SearchBar } from './components/SearchBar';
import { EventGrid } from './components/EventGrid';
import { DiscoveryBar } from './components/DiscoveryBar';
import { CreateEventModal } from './components/CreateEventModal';
import { EventDetailModal } from './components/EventDetailModal';
import { AuthModal } from './components/AuthModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { UserProfileModal } from './components/UserProfileModal';
import { EventMap } from './components/EventMap';
import { TopEventsCarousel } from './components/TopEventsCarousel';

import { USERS, CITIES, CATEGORIES, EVENTS } from './data/mockData';


interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  lang: Language;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, lang }) => {
  if (!isOpen) return null;
  
  const t = {
    cancel: { en: 'Cancel', ar: 'إلغاء', ku: 'هەڵوەشاندنەوە' },
    confirm: { en: 'Confirm', ar: 'تأكيد', ku: 'دڵنیاکردنەوە' },
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className="bg-gray-800 text-gray-200 rounded-lg shadow-xl w-full max-w-md p-6 modal-animate">
        <h2 id="confirm-modal-title" className="text-xl font-bold text-gray-100">{title}</h2>
        <p className="mt-2 text-gray-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500">
            {t.cancel[lang]}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            {confirmText || t.confirm[lang]}
          </button>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
    const [lang, setLang] = useState<Language>('en');
    const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [users, setUsers] = useState<User[]>(USERS);
    const [events, setEvents] = useState<Event[]>(EVENTS);
    const [cities] = useState<City[]>(CITIES);
    const [categories] = useState<Category[]>(CATEGORIES);

    const [filters, setFilters] = useState({
        query: '',
        month: '',
        category: null as string | null,
        city: null as string | null,
    });
    
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [showMyEvents, setShowMyEvents] = useState(false);


    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAIAssistantModalOpen, setIsAIAssistantModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [confirmModalState, setConfirmModalState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });


    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [aiAutofillData, setAiAutofillData] = useState<AIAutofillData | null>(null);

    useEffect(() => {
        const newDirection = (lang === 'ar' || lang === 'ku') ? 'rtl' : 'ltr';
        setDirection(newDirection);
        document.documentElement.lang = lang;
        document.documentElement.dir = newDirection;
    }, [lang]);

    const handleFilterChange = useCallback((type: string, value: string) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    }, []);

    const handleDiscoveryFilter = useCallback((type: 'city' | 'category', id: string) => {
        setFilters(prev => ({ ...prev, query: '', [type]: id }));
    }, []);
    
    const handleAuthClick = useCallback((mode: AuthMode) => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    }, []);

    const filteredEvents = useMemo(() => {
        let baseEvents = events;
        if (showMyEvents && currentUser) {
            baseEvents = events.filter(e => e.organizerId === currentUser.id);
        }

        return baseEvents.filter(event => {
            const queryLower = filters.query.toLowerCase();
            const matchesQuery =
                filters.query === '' ||
                event.title[lang].toLowerCase().includes(queryLower) ||
                event.description[lang].toLowerCase().includes(queryLower) ||
                event.organizerName.toLowerCase().includes(queryLower) ||
                event.venue.toLowerCase().includes(queryLower);

            const eventDate = new Date(event.date);
            const matchesMonth = filters.month === '' || eventDate.getMonth().toString() === filters.month;

            const matchesCategory = !filters.category || filters.category === 'all' || event.categoryId === filters.category;
            const matchesCity = !filters.city || event.cityId === filters.city;

            return matchesQuery && matchesMonth && matchesCategory && matchesCity;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [events, filters, lang, showMyEvents, currentUser]);

    const handleSelectEvent = useCallback((event: Event) => {
        setSelectedEvent(event);
        setIsDetailModalOpen(true);
    }, []);

    const handleOpenCreateModal = useCallback(() => {
        setEventToEdit(null);
        setAiAutofillData(null);
        setIsCreateModalOpen(true);
    }, []);

    const handleOpenAIAssistant = useCallback(() => {
        setIsAIAssistantModalOpen(true);
    }, []);

    
    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        setShowMyEvents(false);
    }, []);

    const handleLogin = useCallback(() => {
        // Mock login
        setCurrentUser(users[0]);
        setIsAuthModalOpen(false);
    }, [users]);
    
    const handleSaveEvent = (eventData: Omit<Event, 'id' | 'reviews' | 'organizerId' | 'attendees'>) => {
      if (eventToEdit) {
        // Edit existing event
        const updatedEvent: Event = { ...eventToEdit, ...eventData };
        setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
      } else {
        // Create new event
        const newEvent: Event = {
            ...eventData,
            id: `evt${Date.now()}`,
            reviews: [],
            attendees: [],
            organizerId: currentUser?.id || 'user_anon',
        };
        setEvents([newEvent, ...events]);
      }
      setIsCreateModalOpen(false);
      setEventToEdit(null);
      setAiAutofillData(null);
    };
    
    const handleEditEvent = useCallback((event: Event) => {
        setIsDetailModalOpen(false);
        setEventToEdit(event);
        setAiAutofillData(null);
        setIsCreateModalOpen(true);
    }, []);

    const handleDeleteEvent = useCallback((eventId: string) => {
        const eventToDelete = events.find(e => e.id === eventId);
        if (!eventToDelete) return;

        const t = {
            deleteEvent: { en: 'Delete Event', ar: 'حذف الفعالية', ku: 'سڕینەوەی ڕووداو' },
            areYouSure: { en: 'Are you sure you want to permanently delete "{eventName}"? This action cannot be undone.', ar: 'هل أنت متأكد أنك تريد حذف "{eventName}" بشكل دائم؟ لا يمكن التراجع عن هذا الإجراء.', ku: 'دڵنیای لە سڕینەوەی هەمیشەیی "{eventName}"؟ ئەم کارە ناتوانرێت بگەڕێنرێتەوە.' },
            delete: { en: 'Delete', ar: 'حذف', ku: 'سڕینەوە' }
        };

        setConfirmModalState({
            isOpen: true,
            title: t.deleteEvent[lang],
            message: t.areYouSure[lang].replace('{eventName}', eventToDelete.title[lang]),
            confirmText: t.delete[lang],
            onConfirm: () => {
                setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
                setIsDetailModalOpen(false);
                setConfirmModalState(prev => ({ ...prev, isOpen: false }));
            }
        });
    }, [events, lang]);
    
    const handleViewProfile = useCallback((userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsProfileModalOpen(true);
        }
    }, [users]);

    const handleOpenCurrentUserProfile = useCallback(() => {
        if (currentUser) {
            setSelectedUser(currentUser);
            setIsProfileModalOpen(true);
        }
    }, [currentUser]);

    const handleSaveProfile = (updatedData: Partial<User>) => {
        if (!selectedUser) return;

        const updatedUsers = users.map(u => 
            u.id === selectedUser.id ? { ...u, ...updatedData } : u
        );
        setUsers(updatedUsers);

        const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser?.id);
        if (updatedCurrentUser) {
            setCurrentUser(updatedCurrentUser);
        }
        
        const updatedEvents = events.map(event => ({
            ...event,
            reviews: event.reviews.map(review => {
                if (review.user.id === selectedUser.id) {
                    const updatedReviewUser = updatedUsers.find(u => u.id === review.user.id);
                    return { ...review, user: updatedReviewUser || review.user };
                }
                return review;
            }),
            attendees: event.attendees.map(attendee => {
                if (attendee.id === selectedUser.id) {
                    return updatedUsers.find(u => u.id === attendee.id) || attendee;
                }
                return attendee;
            })
        }));
        setEvents(updatedEvents);

        setIsProfileModalOpen(false);
    };

    const handleApplyAI = (data: AIAutofillData) => {
      setAiAutofillData(data);
      setIsCreateModalOpen(true);
    };

    const handleAddReview = (eventId: string, reviewData: Omit<Review, 'id' | 'user' | 'timestamp'>) => {
        if (!currentUser) return;
        const newReview: Review = {
            id: `rev${Date.now()}`,
            user: currentUser,
            timestamp: new Date().toISOString(),
            ...reviewData
        };
        const updatedEvents = events.map(event => {
            if (event.id === eventId) {
                return { ...event, reviews: [newReview, ...event.reviews] };
            }
            return event;
        });
        setEvents(updatedEvents);
        setSelectedEvent(prev => prev ? { ...prev, reviews: [newReview, ...prev.reviews] } : null);
    };

    const handleToggleAttendance = useCallback((eventId: string) => {
        if (!currentUser) {
            handleAuthClick('login');
            return;
        }
        const updatedEvents = events.map(event => {
            if (event.id === eventId) {
                const isAttending = event.attendees.some(attendee => attendee.id === currentUser.id);
                const newAttendees = isAttending
                    ? event.attendees.filter(attendee => attendee.id !== currentUser.id)
                    : [...event.attendees, currentUser];
                return { ...event, attendees: newAttendees };
            }
            return event;
        });
        setEvents(updatedEvents);
        setSelectedEvent(prev => {
            if (prev && prev.id === eventId) {
                const updatedSelectedEvent = updatedEvents.find(e => e.id === eventId);
                return updatedSelectedEvent || null;
            }
            return prev;
        });
    }, [currentUser, events, handleAuthClick]);


    const handleToggleMyEvents = useCallback(() => {
        setShowMyEvents(prev => !prev);
    }, []);


    const featuredEvents = useMemo(() => events.slice(0, 5), [events]);
    const topEvents = useMemo(() => [...events].sort((a,b) => b.attendees.length - a.attendees.length).slice(0, 8), [events]);

    return (
        <div className="bg-gray-900 min-h-screen font-sans" dir={direction}>
            <Header
                lang={lang}
                onLangChange={setLang}
                onOpenCreateModal={handleOpenCreateModal}
                onOpenAIAssistant={handleOpenAIAssistant}
                currentUser={currentUser}
                onAuthClick={handleAuthClick}
                onLogout={handleLogout}
                onOpenCurrentUserProfile={handleOpenCurrentUserProfile}
                onToggleMyEvents={handleToggleMyEvents}
                isMyEventsActive={showMyEvents}
            />

            <main>
                <FeaturedCarousel events={featuredEvents} lang={lang} onSelectEvent={handleSelectEvent} />
                <DiscoveryBar cities={cities} categories={categories} onFilterChange={handleDiscoveryFilter} activeFilters={filters} lang={lang} />
                
                <SearchBar 
                    cities={cities} 
                    categories={categories} 
                    lang={lang} 
                    onFilterChange={handleFilterChange} 
                    currentFilters={filters}
                    isMyEventsActive={showMyEvents}
                    onClearMyEvents={() => setShowMyEvents(false)}
                 />
                <TopEventsCarousel events={topEvents} lang={lang} onSelectEvent={handleSelectEvent} />

                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center mb-6 bg-gray-800 p-1 rounded-full w-max mx-auto border border-gray-700">
                        <button onClick={() => setViewMode('grid')} className={`px-6 py-2 text-sm font-semibold rounded-full ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}>Grid</button>
                        <button onClick={() => setViewMode('map')} className={`px-6 py-2 text-sm font-semibold rounded-full ${viewMode === 'map' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}>Map</button>
                    </div>

                    {viewMode === 'grid' ? (
                        <EventGrid events={filteredEvents} lang={lang} onSelectEvent={handleSelectEvent} />
                    ) : (
                        <EventMap events={filteredEvents} lang={lang} onSelectEvent={handleSelectEvent} />
                    )}
                </div>
            </main>

            <footer className="bg-gray-900/80 border-t border-gray-700/50 py-6 text-center">
                <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Iraq Events. All rights reserved.</p>
            </footer>

            {isCreateModalOpen && (
                <CreateEventModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={handleSaveEvent}
                    cities={cities}
                    categories={categories}
                    lang={lang}
                    eventToEdit={eventToEdit}
                    aiAutofillData={aiAutofillData}
                    currentUser={currentUser}
                />
            )}
            
            {isDetailModalOpen && selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => setIsDetailModalOpen(false)}
                    lang={lang}
                    onAddReview={handleAddReview}
                    currentUser={currentUser}
                    onEdit={handleEditEvent}
                    onViewProfile={handleViewProfile}
                    onDelete={handleDeleteEvent}
                    onToggleAttendance={handleToggleAttendance}
                />
            )}
            
            {isAuthModalOpen && (
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    onLogin={handleLogin}
                    onSignUp={handleLogin} // Mock signup logs in user
                    initialMode={authMode}
                    onForgotPassword={() => {}}
                    lang={lang}
                />
            )}

            {isAIAssistantModalOpen && (
                <AIAssistantModal
                    isOpen={isAIAssistantModalOpen}
                    onClose={() => setIsAIAssistantModalOpen(false)}
                    onApply={handleApplyAI}
                    cities={cities}
                    categories={categories}
                    lang={lang}
                />
            )}

            {isProfileModalOpen && selectedUser && (
                <UserProfileModal
                    user={selectedUser}
                    onClose={() => setIsProfileModalOpen(false)}
                    isEditable={currentUser?.id === selectedUser.id}
                    onSave={handleSaveProfile}
                    lang={lang}
                />
            )}

            <ConfirmationModal
                isOpen={confirmModalState.isOpen}
                onClose={() => setConfirmModalState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModalState.onConfirm}
                title={confirmModalState.title}
                message={confirmModalState.message}
                confirmText={confirmModalState.confirmText}
                lang={lang}
            />
        </div>
    );
};

export default App;