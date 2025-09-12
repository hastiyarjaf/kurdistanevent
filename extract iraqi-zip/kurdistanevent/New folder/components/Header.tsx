
import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLocalization } from '../hooks/useLocalization';
import { CalendarIcon, UserGroupIcon } from './icons/Icons';

interface HeaderProps {
  currentView: 'client' | 'lawyer';
  setView: (view: 'client' | 'lawyer') => void;
}

// Logo Component
const Logo: React.FC = () => (
  <div className="flex items-center space-x-3">
    <div className="relative">
      {/* Scales of Justice Icon */}
      <svg width="40" height="40" viewBox="0 0 40 40" className="text-brand-red">
        <g transform="translate(20, 20)">
          {/* Central pole */}
          <line x1="0" y1="-15" x2="0" y2="12" stroke="currentColor" strokeWidth="2"/>
          {/* Balance beam */}
          <line x1="-12" y1="-8" x2="12" y2="-8" stroke="currentColor" strokeWidth="2"/>
          {/* Left scale */}
          <circle cx="-10" cy="-6" r="6" fill="none" stroke="#007A3D" strokeWidth="1.5"/>
          <line x1="-16" y1="-6" x2="-4" y2="-6" stroke="#007A3D" strokeWidth="1.5"/>
          <line x1="-10" y1="-8" x2="-10" y2="-6" stroke="#007A3D" strokeWidth="1"/>
          {/* Right scale */}
          <circle cx="10" cy="-6" r="6" fill="none" stroke="#007A3D" strokeWidth="1.5"/>
          <line x1="4" y1="-6" x2="16" y2="-6" stroke="#007A3D" strokeWidth="1.5"/>
          <line x1="10" y1="-8" x2="10" y2="-6" stroke="#007A3D" strokeWidth="1"/>
          {/* Base */}
          <ellipse cx="0" cy="12" rx="6" ry="2" fill="currentColor"/>
        </g>
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold text-brand-red leading-tight">
        دليل القانونيين العراقي
      </span>
      <span className="text-sm font-semibold text-brand-green leading-tight">
        Iraqi Legal Directory
      </span>
    </div>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const { t } = useLocalization();

  const navLinkClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out";
  const activeClasses = "bg-brand-green text-white shadow-md transform scale-105";
  const inactiveClasses = "text-gray-700 hover:bg-gray-100 hover:text-brand-green hover:shadow-sm";

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo Section */}
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl shadow-inner">
            <button
              onClick={() => setView('client')}
              className={`${navLinkClasses} ${currentView === 'client' ? activeClasses : inactiveClasses}`}
              aria-label="Find Lawyers"
            >
              <CalendarIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{t('find_lawyers')}</span>
              <span className="sm:hidden">Find</span>
            </button>
            <button
              onClick={() => setView('lawyer')}
              className={`${navLinkClasses} ${currentView === 'lawyer' ? activeClasses : inactiveClasses}`}
              aria-label="Lawyer Dashboard"
            >
              <UserGroupIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{t('lawyer_dashboard')}</span>
              <span className="sm:hidden">Dashboard</span>
            </button>
          </nav>
          
          {/* Language Switcher */}
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};
