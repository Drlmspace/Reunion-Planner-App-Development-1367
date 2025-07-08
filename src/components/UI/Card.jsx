import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'normal',
  variant = 'glass',
  ...props 
}) => {
  const baseClasses = variant === 'glass' ? 'glass-card' : 'bg-white/95 backdrop-blur-md rounded-xl border border-white/20';
  const hoverClasses = hover ? 'hover:bg-white/20 transition-all duration-300 cursor-pointer' : '';
  
  const paddingClasses = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -4, scale: 1.02 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;