
import React, { useState, useRef, useEffect } from 'react';
import type { User, Language } from '../types';
import { UserCircleIcon, LogoutIcon, CalendarIcon } from './icons';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  onOpenProfile: () => void;
  onToggleMyEvents: () => void;
  isMyEventsActive: boolean;
  lang: Language;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onOpenProfile, onToggleMyEvents, isMyEventsActive, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = {
    myProfile: { en: 'My Profile', ar: 'ملفي الشخصي', ku: 'پڕۆفایلی من' },
    myEvents: { en: 'My Events', ar: 'فعالياتي', ku: 'ڕووداوەکانم' },
    logout: { en: 'Logout', ar: 'تسجيل الخروج', ku: 'چوونەدەرەوە' },
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 focus:outline-none">
        {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-orange-400 object-cover" />
        ) : (
            <div className="w-8 h-8 rounded-full border-2 border-orange-400 bg-gray-600 flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-gray-300" />
            </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-gray-300">{user.name}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 border border-gray-700">
          <div className="py-1">
            <button
              onClick={() => { onOpenProfile(); setIsOpen(false); }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              <UserCircleIcon className="w-5 h-5" />
              {t.myProfile[lang]}
            </button>
             <button
                onClick={() => { onToggleMyEvents(); setIsOpen(false); }}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700 ${isMyEventsActive ? 'bg-orange-900 text-orange-300' : 'text-gray-300'}`}
              >
                <CalendarIcon className="w-5 h-5" />
                {t.myEvents[lang]}
              </button>
            <div className="border-t border-gray-700 my-1"></div>
            <button
              onClick={() => { onLogout(); setIsOpen(false); }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              <LogoutIcon className="w-5 h-5" />
              {t.logout[lang]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};