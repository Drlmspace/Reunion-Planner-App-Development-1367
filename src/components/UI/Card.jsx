import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'normal', 
  variant = 'glass',
  glow = false,
  ...props 
}) => {
  const baseClasses = variant === 'glass' ? 'glass-card' : 'bg-white/95 backdrop-blur-md rounded-xl border border-white/20';
  const hoverClasses = hover ? 'card-hover-scale cursor-pointer' : '';
  const glowClasses = glow ? 'glow-border' : '';
  
  const paddingClasses = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { 
      y: -4, 
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
    },
    transition: { duration: 0.3, ease: "easeOut" }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${glowClasses} ${paddingClasses[padding]} ${className} relative overflow-hidden`}
      {...motionProps}
      {...props}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '20px 20px'],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};

export default Card;