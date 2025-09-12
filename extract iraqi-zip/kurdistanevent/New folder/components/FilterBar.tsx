
import React from 'react';
import type { Category, Location, PracticeArea } from '../types';
import { useLocalization } from '../hooks/useLocalization';

interface FilterBarProps {
  categories: Category[] | PracticeArea[];
  locations: Location[];
  selectedCategories: string[];
  selectedLocations: string[];
  onFilterChange: (type: 'category' | 'practice_area' | 'location', value: string) => void;
  filterType?: 'category' | 'practice_area';
}

const FilterChip: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105";
  const selectedClasses = "bg-green-700 text-white shadow-md";
  const unselectedClasses = "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100";
  return (
    <button onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
      {label}
    </button>
  );
};

export const FilterBar: React.FC<FilterBarProps> = ({ categories, locations, selectedCategories, selectedLocations, onFilterChange, filterType = 'category' }) => {
  const { t, translateName } = useLocalization();

  return (
    <div className="space-y-4 mb-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          {filterType === 'practice_area' ? t('filter_by_practice_area') : t('filter_by_category')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <FilterChip
              key={category.id}
              label={translateName(category)}
              isSelected={selectedCategories.includes(category.id)}
              onClick={() => onFilterChange(filterType, category.id)}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">{t('filter_by_location')}</h3>
        <div className="flex flex-wrap gap-2">
          {locations.map(location => (
            <FilterChip
              key={location.id}
              label={translateName(location)}
              isSelected={selectedLocations.includes(location.id)}
              onClick={() => onFilterChange('location', location.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
