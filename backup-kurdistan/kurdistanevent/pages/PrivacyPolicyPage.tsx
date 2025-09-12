
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { getPrivacyPolicyText } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

interface PolicyText {
    title: string;
    lastUpdated: string;
    sections: { title: string; content: string }[];
}

const PrivacyPolicyPage: React.FC = () => {
    const { t, language } = useTranslation();
    const [policy, setPolicy] = useState<PolicyText | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    usePageMetadata('meta.privacy.title', 'meta.privacy.description');

    useEffect(() => {
        getPrivacyPolicyText(language)
            .then(data => {
                setPolicy(data);
                setIsLoading(false);
            });
    }, [language]);

    return (
        <div className="max-w-3xl mx-auto bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-lg">
            <div className="mb-8">
                <Link to="/welcome">
                    <Button variant="ghost" className="flex items-center space-x-2 rtl:space-x-reverse">
                        <ArrowLeft className="h-5 w-5" />
                        <span>{t('messages.back')}</span>
                    </Button>
                </Link>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : policy ? (
                <>
                    <h1 className="text-4xl font-display font-bold text-text-primary dark:text-dark-text-primary mb-2">{policy.title}</h1>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-8">{policy.lastUpdated}</p>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none text-text-secondary dark:text-dark-text-secondary space-y-6">
                        {policy.sections.map((section, index) => (
                            <div key={index}>
                                <h2 className="text-2xl font-display font-semibold text-text-primary dark:text-dark-text-primary">{section.title}</h2>
                                <p>{section.content}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div>Could not load privacy policy.</div>
            )}
        </div>
    );
};

export default PrivacyPolicyPage;
