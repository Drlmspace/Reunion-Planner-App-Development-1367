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
  const baseClasses = 'w-full px-4 py-3 glass-card text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300';
  const errorClasses = error ? 'ring-2 ring-red-400 focus:ring-red-400' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/90">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {helper && !error && (
        <p className="text-sm text-white/60">{helper}</p>
      )}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;