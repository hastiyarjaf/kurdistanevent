
import React, { useState, useEffect } from 'react';
import type { User, Language } from '../types';
import { EmailIcon, PhoneIcon, UserCircleIcon } from './icons';

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
  onSave?: (updatedData: Partial<Pick<User, 'name' | 'phone' | 'avatarUrl'>>) => void;
  isEditable: boolean;
  lang: Language;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onSave, isEditable, lang }) => {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    onSave?.({ name, phone, avatarUrl });
  };
  
  const t = {
    editProfile: { en: 'Edit Profile', ar: 'تعديل الملف الشخصي', ku: 'دەستکاری پڕۆفایل' },
    name: { en: 'Name', ar: 'الاسم', ku: 'ناو' },
    phone: { en: 'Phone', ar: 'الهاتف', ku: 'مۆبایل' },
    avatarUrl: { en: 'Avatar URL', ar: 'رابط الصورة الرمزية', ku: 'بەسەری وێنەی پڕۆفایل' },
    cancel: { en: 'Cancel', ar: 'إلغاء', ku: 'هەڵوەشاندنەوە' },
    save: { en: 'Save Changes', ar: 'حفظ التغييرات', ku: 'پاشەکەوتکردنی گۆڕانکارییەکان' },
    organizer: { en: 'Event Organizer', ar: 'منظم فعاليات', ku: 'ڕێکخەری ڕووداو' },
    contactInfo: { en: 'Contact Info', ar: 'معلومات الاتصال', ku: 'زانیاری پەیوەندی' },
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="user-profile-modal-title">
      <div className="bg-gray-800 text-gray-200 rounded-lg shadow-xl w-full max-w-sm p-8 text-center relative modal-animate">
        <button onClick={onClose} className="absolute top-3 right-3 rtl:left-3 rtl:right-auto text-gray-500 hover:text-gray-300 text-3xl leading-none">&times;</button>
        {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-32 h-32 rounded-full mx-auto border-4 border-orange-400 shadow-lg object-cover" loading="lazy" />
        ) : (
            <div className="w-32 h-32 rounded-full mx-auto border-4 border-orange-400 shadow-lg bg-gray-600 flex items-center justify-center">
                <UserCircleIcon className="w-24 h-24 text-gray-400" />
            </div>
        )}
        
        {isEditable ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="mt-4 text-left">
                <h2 id="user-profile-modal-title" className="text-2xl font-bold text-gray-100 text-center mb-4">{t.editProfile[lang]}</h2>
                <div>
                    <label htmlFor="profile-name" className="block text-sm font-medium text-gray-400">{t.name[lang]}</label>
                    <input type="text" id="profile-name" value={name} onChange={e => setName(e.target.value)} className={inputClasses} />
                </div>
                <div className="mt-4">
                    <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-400">{t.phone[lang]}</label>
                    <input type="tel" id="profile-phone" value={phone} onChange={e => setPhone(e.target.value)} className={inputClasses} />
                </div>
                <div className="mt-4">
                    <label htmlFor="profile-avatar" className="block text-sm font-medium text-gray-400">{t.avatarUrl[lang]}</label>
                    <input type="text" id="profile-avatar" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className={inputClasses} />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500">{t.cancel[lang]}</button>
                    <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">{t.save[lang]}</button>
                </div>
            </form>
        ) : (
            <>
                <h2 id="user-profile-modal-title" className="text-2xl font-bold text-gray-100 mt-4">{user.name}</h2>
                <p className="text-orange-400 mt-1">{t.organizer[lang]}</p>
                <div className="mt-6 w-full border-t border-gray-700 pt-4 text-left">
                    <h3 className="text-lg font-semibold text-gray-100 text-center mb-3">{t.contactInfo[lang]}</h3>
                    <p className="text-gray-300 mt-2 flex items-center gap-2"><EmailIcon className="h-5 w-5 text-gray-500" /> {user.email}</p>
                    <p className="text-gray-300 mt-1 flex items-center gap-2"><PhoneIcon className="h-5 w-5 text-gray-500" /> {user.phone}</p>
                </div>
            </>
        )}
      </div>
    </div>
  );
};