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
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors';
  const errorClasses = error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : '';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
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
        <p className="text-sm text-gray-500">{helper}</p>
      )}
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;