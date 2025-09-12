
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
        {label}
      </label>
      <input
        id={id}
        className="w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:border-dark-border dark:text-dark-text-primary"
        {...props}
      />
    </div>
  );
};

export default Input;