import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useTranslation } from '../hooks/useTranslation';
import { usePageMetadata } from '../hooks/usePageMetadata';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  usePageMetadata('meta.notFound.title', 'meta.notFound.description');

  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-9xl font-display font-extrabold text-primary">404</h1>
      <h2 className="text-4xl font-display font-bold text-text-primary dark:text-dark-text-primary mt-4 mb-2">{t('notFound.title')}</h2>
      <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-8">
        {t('notFound.subtitle')}
      </p>
      <Link to="/">
        <Button size="lg">{t('notFound.goHome')}</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;