import React from 'react';
import { Share2 } from 'lucide-react';
import Button from './Button';
import { useTranslation } from '../hooks/useTranslation';

interface ShareButtonProps {
    title: string;
    text: string;
    url: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
    const { t } = useTranslation();
    const [isSupported, setIsSupported] = React.useState(false);

    React.useEffect(() => {
        if (navigator.share) {
            setIsSupported(true);
        }
    }, []);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <Button onClick={handleShare} variant="secondary" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Share2 className="h-5 w-5" />
            <span>{t('eventDetails.share')}</span>
        </Button>
    );
};

export default ShareButton;
