import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ 
  label, 
  error, 
  helper, 
  type = 'text', 
  className = '', 
  required = false,
  icon,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 glass-card text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 relative';
  const errorClasses = error ? 'ring-2 ring-red-400 focus:ring-red-400 shake' : '';

  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <motion.label 
          className="block text-sm font-medium text-white/90 font-space"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {label}
          {required && (
            <motion.span 
              className="text-red-400 ml-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              *
            </motion.span>
          )}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={`${baseClasses} ${errorClasses} ${icon ? 'pl-10' : ''} ${className}`}
          whileFocus={{ 
            scale: 1.02,
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)"
          }}
          {...props}
        />
        
        {/* Focus glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileFocus={{ opacity: 1 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            animation: 'shimmer 2s ease-in-out infinite'
          }}
        />
      </div>
      
      {helper && !error && (
        <motion.p 
          className="text-sm text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {helper}
        </motion.p>
      )}
      
      {error && (
        <motion.p 
          className="text-sm text-red-400 flex items-center space-x-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </motion.p>
      )}
    </motion.div>
  );
});

Input.displayName = 'Input';

export default Input;