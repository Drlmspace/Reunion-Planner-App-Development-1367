import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, padding = 'normal', ...props }) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  
  const paddingClasses = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -2 },
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