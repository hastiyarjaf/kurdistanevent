import React, { useState, useEffect } from 'react';
import type { Event, Language, OrganizerProfile } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { CATEGORIES, LOCATIONS, LANGUAGES } from '../constants';
import { getOrganizerProfile, updateOrganizerProfile } from '../services/api';
import { PencilIcon, XMarkIcon, PlusCircleIcon, ArrowPathIcon } from './icons/Icons';

interface OrganizerDashboardProps {
  addEvent: (eventData: Omit<Event, 'id' | 'imageUrl' | 'category' | 'location'> & { category_id: string; location_id: string }) => Promise<void>;
}

const initialFormState = {
  title: { en: '', ku_sorani: '', ku_kurmanji: '', ar: '' },
  description: { en: '', ku_sorani: '', ku_kurmanji: '', ar: '' },
  date: '',
  organizer: '',
  category_id: '',
  location_id: '',
};

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ addEvent }) => {
  const { translateName } = useLocalization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [organizerProfile, setOrganizerProfile] = useState<OrganizerProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getOrganizerProfile();
      setOrganizerProfile(profile);
    };
    fetchProfile();
  }, []);

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [field, lang] = name.split('.') as ['title' | 'description', Language];
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.en || !formData.description.en || !formData.date || !formData.category_id || !formData.location_id) {
      alert('Please fill in all required fields (English is mandatory).');
      return;
    }
    setIsSubmitting(true);

    const finalData = {
        ...formData,
        organizer: organizerProfile?.name || 'Anonymous Organizer',
        title: {
            en: formData.title.en,
            ku_sorani: formData.title.ku_sorani || formData.title.en,
            ku_kurmanji: formData.title.ku_kurmanji || formData.title.en,
            ar: formData.title.ar || formData.title.en,
        },
        description: {
            en: formData.description.en,
            ku_sorani: formData.description.ku_sorani || formData.description.en,
            ku_kurmanji: formData.description.ku_kurmanji || formData.description.en,
            ar: formData.description.ar || formData.description.en,
        }
    }

    try {
      await addEvent(finalData);
      setFormData(initialFormState); // Reset form
    } catch (error) {
      console.error("Failed to add event:", error);
      alert("There was an error creating the event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = async (editedProfile: OrganizerProfile) => {
    const updatedProfile = await updateOrganizerProfile(editedProfile);
    setOrganizerProfile(updatedProfile);
    setIsEditProfileOpen(false);
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  
  if (!organizerProfile) {
    return <div className="text-center p-10"><p className="text-lg text-green-700 animate-pulse">Loading Organizer Dashboard...</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Organizer Profile Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
                <img src={organizerProfile.profilePictureUrl} alt={organizerProfile.name} className="w-20 h-20 rounded-full object-cover border-4 border-green-200" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{organizerProfile.name}</h2>
                    <p className="text-gray-600">{organizerProfile.biography}</p>
                </div>
            </div>
            <button onClick={() => setIsEditProfileOpen(true)} className="flex items-center text-sm font-medium text-green-700 hover:text-green-900">
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit Profile
            </button>
        </div>
        <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Cultural Specializations</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {organizerProfile.specializations.map(spec => (
                    <span key={spec} className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">{spec}</span>
                ))}
            </div>
        </div>
      </div>

      {/* Create New Event Form */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={isSubmitting} className="space-y-6">
            <div className="border p-4 rounded-md">
                <legend className="text-lg font-semibold px-2">Event Details</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <label htmlFor="date" className={labelClasses}>Date & Time</label>
                        <input type="datetime-local" id="date" name="date" value={formData.date} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="category_id" className={labelClasses}>Category</label>
                        <select id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} className={inputClasses} required>
                            <option value="" disabled>Select a category</option>
                            {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{translateName(cat)}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="location_id" className={labelClasses}>Location</label>
                        <select id="location_id" name="location_id" value={formData.location_id} onChange={handleChange} className={inputClasses} required>
                            <option value="" disabled>Select a location</option>
                            {LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{translateName(loc)}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="border p-4 rounded-md">
                <legend className="text-lg font-semibold px-2">Event Content (Multi-language)</legend>
                <p className="text-sm text-gray-500 mb-4">English is required. Other languages will default to English if left blank.</p>
                <div className="space-y-4">
                    {LANGUAGES.map(lang => (
                        <div key={lang.code} className="p-4 border rounded-md bg-gray-50">
                            <h4 className="font-semibold text-gray-700 mb-2">{lang.flag} {lang.name}</h4>
                            <div className="space-y-2">
                                 <div>
                                    <label htmlFor={`title.${lang.code}`} className={`${labelClasses} text-xs`}>Title</label>
                                    <input
                                        type="text"
                                        id={`title.${lang.code}`}
                                        name={`title.${lang.code}`}
                                        value={formData.title[lang.code]}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required={lang.code === 'en'}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`description.${lang.code}`} className={`${labelClasses} text-xs`}>Description</label>
                                    <textarea
                                        id={`description.${lang.code}`}
                                        name={`description.${lang.code}`}
                                        value={formData.description[lang.code]}
                                        onChange={handleChange}
                                        rows={3}
                                        className={inputClasses}
                                        required={lang.code === 'en'}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </fieldset>

          <div>
            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center px-6 py-3 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <PlusCircleIcon className="w-6 h-6 mr-2" />
                  Add Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {isEditProfileOpen && (
        <EditProfileModal
          profile={organizerProfile}
          onSave={handleSaveProfile}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}
    </div>
  );
};

// EditProfileModal Sub-component
interface EditProfileModalProps {
  profile: OrganizerProfile;
  onSave: (editedProfile: OrganizerProfile) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onSave, onClose }) => {
  const [editedProfile, setEditedProfile] = useState(profile);
  const [newSpec, setNewSpec] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSpec = () => {
    if (newSpec && !editedProfile.specializations.includes(newSpec)) {
      setEditedProfile(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpec]
      }));
      setNewSpec('');
    }
  };

  const handleRemoveSpec = (specToRemove: string) => {
    setEditedProfile(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== specToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedProfile);
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit Organizer Profile</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className={labelClasses}>Organizer Name</label>
                        <input type="text" id="name" name="name" value={editedProfile.name} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="profilePictureUrl" className={labelClasses}>Profile Picture URL</label>
                        <input type="text" id="profilePictureUrl" name="profilePictureUrl" value={editedProfile.profilePictureUrl} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="biography" className={labelClasses}>Biography / Mission</label>
                        <textarea id="biography" name="biography" value={editedProfile.biography} onChange={handleChange} rows={3} className={inputClasses}></textarea>
                    </div>
                    <div>
                        <label className={labelClasses}>Cultural Specializations</label>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={newSpec}
                                onChange={(e) => setNewSpec(e.target.value)}
                                placeholder="e.g., Kurdish Literature"
                                className={inputClasses}
                            />
                            <button type="button" onClick={handleAddSpec} className="px-4 py-2 bg-green-100 text-green-800 rounded-md font-semibold hover:bg-green-200">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {editedProfile.specializations.map(spec => (
                                <span key={spec} className="flex items-center px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                                    {spec}
                                    <button type="button" onClick={() => handleRemoveSpec(spec)} className="ml-1.5 text-red-500 hover:text-red-700">
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800">Save Changes</button>
            </div>
        </form>
      </div>
    </div>
  );
};
