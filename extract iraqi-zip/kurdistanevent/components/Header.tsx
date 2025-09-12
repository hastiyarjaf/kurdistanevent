
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, PlusCircle, LifeBuoy } from 'lucide-react';
import Button from './Button';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  const canCreateEvents = isAuthenticated && (user?.role === 'attendee' || user?.role === 'host');

  return (
    <header className="bg-surface dark:bg-dark-surface shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to={isAuthenticated ? "/" : "/welcome"} className="flex items-center space-x-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-display font-bold text-text-primary dark:text-dark-text-primary">
            {t('header.title1')} <span className="text-primary">{t('header.title2')}</span>
          </h1>
        </Link>
        <nav className="flex items-center space-x-1 md:space-x-2">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-text-secondary dark:text-dark-text-secondary mr-2">{t('header.welcome', { name: user?.name.split(' ')[0] })}</span>
              {canCreateEvents && (
                <Link to="/create-event" title={t('header.createEvent')}>
                  <Button variant="ghost" className="p-2">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </Link>
              )}
               <Link to="/messages/admin-user" title={t('header.help')}>
                  <Button variant="ghost" className="p-2">
                    <LifeBuoy className="h-5 w-5" />
                  </Button>
                </Link>
              <Button onClick={handleLogout} variant="danger" size="sm" className="p-2" aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
             <Link to="/welcome">
                <Button variant="primary">{t('header.loginSignUp')}</Button>
             </Link>
          )}
          <div className="border-l border-border dark:border-dark-border h-8 mx-2"></div>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;