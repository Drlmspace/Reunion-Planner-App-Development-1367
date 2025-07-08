import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false, 
  fullWidth = false, 
  onClick, 
  type = 'button', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-lift';

  const variantClasses = {
    primary: 'gradient-bg text-white hover:shadow-lg focus:ring-blue-500',
    secondary: 'glass-card text-white hover:bg-white/20 focus:ring-white/50',
    outline: 'border-2 border-white/30 text-white hover:bg-white/10 focus:ring-white/50',
    glass: 'glass-card text-white hover:bg-white/20 focus:ring-white/50',
    danger: 'gradient-bg-2 text-white hover:shadow-lg focus:ring-pink-500',
    success: 'gradient-bg-4 text-white hover:shadow-lg focus:ring-green-500',
    gradient: 'gradient-bg-3 text-white hover:shadow-lg focus:ring-cyan-500'
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="small" color="white" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;