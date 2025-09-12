import { useEffect } from 'react';
import { useTranslation } from './useTranslation';

export const usePageMetadata = (titleKey: string, descriptionKey: string, titleParams?: Record<string, string | number>) => {
  const { t, isInitialized } = useTranslation();

  useEffect(() => {
    // Ensure translations are loaded before setting metadata
    if (!isInitialized) return;

    const title = t(titleKey, titleParams);
    const description = t(descriptionKey);

    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.getElementsByTagName('head')[0].appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

  }, [t, titleKey, descriptionKey, titleParams, isInitialized]);
};
