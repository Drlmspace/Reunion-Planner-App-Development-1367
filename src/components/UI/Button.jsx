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
  const baseClasses = 'font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-lift relative overflow-hidden';
  
  const variantClasses = {
    primary: 'gradient-neon-1 text-white hover:shadow-lg focus:ring-pink-500',
    secondary: 'glass-card text-white hover:bg-white/20 focus:ring-white/50',
    outline: 'border-2 border-white/30 text-white hover:bg-white/10 focus:ring-white/50 glow-border',
    glass: 'glass-card text-white hover:bg-white/20 focus:ring-white/50',
    danger: 'gradient-neon-2 text-white hover:shadow-lg focus:ring-red-500',
    success: 'gradient-bg-4 text-white hover:shadow-lg focus:ring-green-500',
    gradient: 'gradient-neon-3 text-white hover:shadow-lg focus:ring-blue-500',
    funky: 'btn-funky'
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        boxShadow: disabled ? undefined : "0 10px 25px rgba(0, 0, 0, 0.2)"
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      {...props}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      <div className="relative z-10 flex items-center justify-center">
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="spinner-rainbow" style={{ width: '16px', height: '16px' }} />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </motion.button>
  );
};

export default Button;