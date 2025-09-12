
import React from 'react';
import { KurdistanFlag, IraqFlag, USFlag } from './icons';
import type { Language } from '../types';

type LanguageOption = {
    code: Language;
    name: string;
    flag: React.ComponentType<{ className?: string }>;
};

const languageOptions: LanguageOption[] = [
    { code: 'ku', name: 'کوردی', flag: KurdistanFlag },
    { code: 'ar', name: 'عربي', flag: IraqFlag },
    { code: 'en', name: 'English', flag: USFlag },
];

interface LanguageSwitcherProps {
    currentLang: Language;
    onLangChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onLangChange }) => {
    return (
        <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full p-1 gap-1">
            {languageOptions.map((option) => (
                <button
                    key={option.code}
                    onClick={() => onLangChange(option.code)}
                    className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none w-[88px] h-[60px] ${
                        currentLang === option.code
                            ? 'bg-orange-500/80 text-white'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                    }`}
                >
                    <span className="text-xs font-semibold">{option.name}</span>
                    <option.flag className="w-6 h-auto rounded-sm" />
                </button>
            ))}
        </div>
    );
};