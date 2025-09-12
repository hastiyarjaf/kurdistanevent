import React from 'react';
import { Banner } from '../types';
import { trackBannerClick } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

interface BannerAdProps {
    banner: Banner;
}

const BannerAd: React.FC<BannerAdProps> = ({ banner }) => {
    const { t } = useTranslation();

    const handleClick = () => {
        trackBannerClick(banner.id);
    }

    return (
        <div className="w-full bg-border dark:bg-dark-border rounded-lg shadow-md overflow-hidden relative group">
            <a 
                href={banner.link_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleClick}
                aria-label={`Advertisement from ${banner.sponsor?.name}`}
            >
                <img 
                    src={banner.image_url} 
                    alt={`Ad from ${banner.sponsor?.name}`}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </a>
            <div className="absolute top-2 end-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded">
                {t('banner.ad')}
            </div>
        </div>
    );
};

export default BannerAd;