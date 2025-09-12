import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { Lawyer } from '../types';

interface LawyerListProps {
  lawyers: Lawyer[];
}

export const LawyerList: React.FC<LawyerListProps> = ({ lawyers }) => {
  const { t, currentLanguage } = useLocalization();

  const handleWhatsAppClick = (whatsapp: string) => {
    window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const handlePhoneClick = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (lawyers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">⚖️</div>
        <p className="text-gray-500 text-lg">{t('no_lawyers_found')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lawyers.map((lawyer) => (
        <div key={lawyer.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            {/* Profile Header */}
            <div className="flex items-center mb-4">
              <img
                src={lawyer.profilePictureUrl}
                alt={lawyer.name[currentLanguage]}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {lawyer.name[currentLanguage]}
                  {lawyer.isVerified && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  {lawyer.location.name[currentLanguage]}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">
                    {lawyer.experienceYears} years experience
                  </span>
                  {lawyer.rating && (
                    <div className="ml-2 flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {lawyer.rating.toFixed(1)}
                        {lawyer.reviewCount && ` (${lawyer.reviewCount})`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Practice Areas */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Practice Areas:</h4>
              <div className="flex flex-wrap gap-1">
                {lawyer.practiceAreas.slice(0, 3).map((area) => (
                  <span
                    key={area.id}
                    className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                  >
                    {area.name[currentLanguage]}
                  </span>
                ))}
                {lawyer.practiceAreas.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    +{lawyer.practiceAreas.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Biography */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {lawyer.biography[currentLanguage]}
              </p>
            </div>

            {/* Languages */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Languages:</h4>
              <div className="flex flex-wrap gap-1">
                {lawyer.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {lang === 'en' ? 'English' : 
                     lang === 'ku_sorani' ? 'Kurdî (Soranî)' :
                     lang === 'ku_kurmanji' ? 'Kurdî (Kurmancî)' :
                     lang === 'ar' ? 'العربية' : lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handlePhoneClick(lawyer.phoneNumber)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                📞 Call
              </button>
              {lawyer.whatsapp && (
                <button
                  onClick={() => handleWhatsAppClick(lawyer.whatsapp!)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  📱 WhatsApp
                </button>
              )}
              <button
                onClick={() => window.location.href = `mailto:${lawyer.email}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ✉️ Email
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
