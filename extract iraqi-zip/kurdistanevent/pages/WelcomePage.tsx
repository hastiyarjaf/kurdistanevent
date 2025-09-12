import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login as apiLogin, signUp as apiSignUp, signInWithGoogle as apiSignInWithGoogle, sendPasswordResetEmail as apiSendPasswordResetEmail } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTranslation } from '../hooks/useTranslation';
import { usePageMetadata } from '../hooks/usePageMetadata';

type FormMode = 'login' | 'signup' | 'reset';
type UserRole = 'attendee' | 'host';

const WelcomePage: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('login');
  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Reset password fields
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  // Sign-up fields
  const [role, setRole] = useState<UserRole>('attendee');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  // General state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  usePageMetadata('meta.welcome.title', 'meta.welcome.description');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const { user } = await apiSignInWithGoogle();
        login(user);
        navigate('/');
    } catch (err) {
        setError('errors.unexpected');
    } finally {
        setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResetMessage(null);
    try {
        await apiSendPasswordResetEmail(resetEmail);
        setResetMessage('welcome.resetLinkSent');
        setResetEmail('');
        setTimeout(() => {
            setMode('login');
            setResetMessage(null);
        }, 5000);
    } catch(err) {
        setError('errors.unexpected');
    } finally {
        setIsLoading(false);
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        const { user } = await apiLogin(email, password);
        login(user);
        navigate('/');
      } else {
        const { user } = await apiSignUp({
            name,
            email,
            password,
            role,
        });
        login(user);
        navigate('/');
      }
    } catch (err: any) {
      // Map known error messages to translation keys
      if (err.message.includes('already exists')) {
        setError('errors.emailExists');
      } else if (err.message.includes('Invalid email or password')) {
        setError('errors.invalidCredentials');
      } else {
        setError('errors.unexpected');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (newMode: FormMode) => {
    setMode(newMode);
    setError(null);
    // Clear all fields
    setName('');
    setEmail('');
    setPassword('');
    setResetEmail('');
    setResetMessage(null);
    setRole('attendee');
    setAgreedToTerms(false);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-2xl">
        {mode === 'reset' ? (
          <div>
            <h2 className="text-3xl font-display font-bold text-center text-text-primary dark:text-dark-text-primary mb-4">
              {t('welcome.resetPasswordTitle')}
            </h2>
            <p className="text-center text-text-secondary dark:text-dark-text-secondary mb-6">
              {t('welcome.resetPasswordInstructions')}
            </p>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <Input id="reset-email" label={t('welcome.emailLabel')} type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required />
              {resetMessage && <p className="text-green-600 dark:text-green-400 text-sm text-center bg-green-50 dark:bg-green-900/50 p-3 rounded-md">{t(resetMessage)}</p>}
              {error && <p className="text-red-500 text-sm text-center">{t(error)}</p>}
              <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                {t('welcome.sendResetLink')}
              </Button>
            </form>
            <div className="text-center mt-4">
              <button onClick={() => toggleMode('login')} className="text-sm font-medium text-primary hover:underline">
                {t('welcome.backToLogin')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex border-b border-border dark:border-dark-border mb-6">
              <button
                onClick={() => toggleMode('login')}
                className={`flex-1 py-3 text-lg font-display font-semibold text-center transition-colors ${mode === 'login' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary'}`}
              >
                {t('welcome.login')}
              </button>
              <button
                onClick={() => toggleMode('signup')}
                className={`flex-1 py-3 text-lg font-display font-semibold text-center transition-colors ${mode === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary'}`}
              >
                {t('welcome.signup')}
              </button>
            </div>
            
            <h2 className="text-3xl font-display font-bold text-center text-text-primary dark:text-dark-text-primary mb-6">
              {mode === 'login' ? t('welcome.welcomeBack') : t('welcome.createAccount')}
            </h2>
            
            <div className="space-y-4">
                <Button onClick={handleGoogleSignIn} variant="ghost" className="w-full border border-border dark:border-dark-border" size="lg">
                     <svg role="img" viewBox="0 0 24 24" className="me-2 h-5 w-5"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>
                    {t('welcome.signInWithGoogle')}
                </Button>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border dark:border-dark-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-surface dark:bg-dark-surface text-text-secondary dark:text-dark-text-secondary">
                        Or
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <>
                <fieldset className="space-y-4">
                  <legend className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">{t('welcome.registerAs')}</legend>
                  <div className="flex gap-4">
                    <label className={`flex-1 p-3 border rounded-md cursor-pointer text-center ${role === 'attendee' ? 'border-primary bg-primary/10' : 'border-border dark:border-dark-border'}`}>
                      <input type="radio" name="role" value="attendee" checked={role === 'attendee'} onChange={() => setRole('attendee')} className="sr-only" />
                      {t('welcome.attendee')}
                    </label>
                    <label className={`flex-1 p-3 border rounded-md cursor-pointer text-center ${role === 'host' ? 'border-primary bg-primary/10' : 'border-border dark:border-dark-border'}`}>
                      <input type="radio" name="role" value="host" checked={role === 'host'} onChange={() => setRole('host')} className="sr-only" />
                      {t('welcome.host')}
                    </label>
                  </div>
                </fieldset>
                <Input id="name" label={t('welcome.nameLabel')} type="text" value={name} onChange={e => setName(e.target.value)} required />
                </>
              )}
              
              <Input id="email" label={t('welcome.emailLabel')} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              <Input id="password" label={t('welcome.passwordLabel')} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              
              {mode === 'login' && (
                  <div className="text-sm text-end">
                    <button type="button" onClick={() => toggleMode('reset')} className="font-medium text-primary hover:text-primary/90 hover:underline">
                        {t('welcome.forgotPassword')}
                    </button>
                  </div>
              )}

              {mode === 'signup' && (
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                        />
                    </div>
                    <div className="ms-3 text-sm">
                        <label htmlFor="terms" className="text-text-secondary dark:text-dark-text-secondary">
                            {t('welcome.agreeToTerms').split('Privacy Policy')[0]}
                            <Link to="/privacy-policy" className="font-medium text-primary hover:underline">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm text-center">{t(error)}</p>}
              
              <Button type="submit" className="w-full" isLoading={isLoading} size="lg" disabled={isLoading || (mode === 'signup' && !agreedToTerms)}>
                {mode === 'login' ? t('welcome.login') : t('welcome.signup')}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
