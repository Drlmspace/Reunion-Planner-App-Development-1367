import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  helper, 
  type = 'text', 
  className = '', 
  required = false,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500';
  const errorClasses = error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : '';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {helper && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helper}</p>
      )}
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;