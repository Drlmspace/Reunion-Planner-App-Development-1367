import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { 
  FiHome, FiTarget, FiUsers, FiCalendar, FiDollarSign, FiMapPin, 
  FiClock, FiMail, FiUserCheck, FiPlane, FiCoffee, FiTruck, 
  FiShield, FiBookOpen, FiStar, FiChevronLeft, FiChevronRight
} = FiIcons;

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const chapters = [
    { id: 1, title: 'Vision & Intention', icon: FiTarget, path: '/chapters/vision', gradient: 'gradient-neon-1', emoji: '🎯' },
    { id: 2, title: 'Planning Committee', icon: FiUsers, path: '/chapters/committee', gradient: 'gradient-neon-2', emoji: '👥' },
    { id: 3, title: 'Date & Budget', icon: FiCalendar, path: '/chapters/date-budget', gradient: 'gradient-neon-3', emoji: '📅' },
    { id: 4, title: 'Venue Planning', icon: FiMapPin, path: '/chapters/venue', gradient: 'gradient-bg-4', emoji: '📍' },
    { id: 5, title: 'Program Builder', icon: FiClock, path: '/chapters/program', gradient: 'gradient-bg-5', emoji: '⏰' },
    { id: 6, title: 'Communication', icon: FiMail, path: '/chapters/communication', gradient: 'gradient-bg-6', emoji: '💬' },
    { id: 7, title: 'RSVP Management', icon: FiUserCheck, path: '/chapters/rsvp', gradient: 'gradient-neon-1', emoji: '✅' },
    { id: 8, title: 'Travel & Lodging', icon: FiPlane, path: '/chapters/travel', gradient: 'gradient-neon-2', emoji: '✈️' },
    { id: 9, title: 'Food & Beverage', icon: FiCoffee, path: '/chapters/food', gradient: 'gradient-neon-3', emoji: '🍽️' },
    { id: 10, title: 'Vendor Management', icon: FiTruck, path: '/chapters/vendors', gradient: 'gradient-bg-4', emoji: '🚛' },
    { id: 11, title: 'Contingency Planning', icon: FiShield, path: '/chapters/contingency', gradient: 'gradient-bg-5', emoji: '🛡️' },
    { id: 12, title: 'Debrief & Reflection', icon: FiBookOpen, path: '/chapters/debrief', gradient: 'gradient-bg-6', emoji: '📝' },
  ];

  return (
    <motion.div 
      className={`${isCollapsed ? 'w-20' : 'w-80'} glass-card m-4 mr-0 overflow-hidden transition-all duration-300 relative`}
      animate={{ width: isCollapsed ? 80 : 320 }}
    >
      {/* Collapse Toggle */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full gradient-neon-1 flex items-center justify-center text-white hover:scale-110 transition-transform"
        whileHover={{ rotate: 180 }}
        whileTap={{ scale: 0.9 }}
      >
        <SafeIcon icon={isCollapsed ? FiChevronRight : FiChevronLeft} className="text-sm" />
      </motion.button>

      <div className="p-8">
        <motion.div 
          className="flex items-center space-x-3 mb-8"
          animate={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <div className="w-12 h-12 rounded-full gradient-neon-1 flex items-center justify-center pulse-rainbow float">
            <SafeIcon icon={FiStar} className="text-2xl text-white" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-xl font-bold text-white-glass font-fun">Reunion Planner</h1>
                <p className="text-white/60 text-sm">Your planning companion ✨</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <nav className="px-6">
        <div className="mb-6">
          <NavLink 
            to="/" 
            className={({isActive}) => 
              `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive ? 'glass-card text-white glow-border' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <div className={`w-8 h-8 rounded-lg gradient-neon-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 float-delayed`}>
              <SafeIcon icon={FiHome} className="text-sm text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span 
                  className="font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Dashboard
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span 
              className="absolute right-2 text-lg emoji-bounce"
              animate={{ opacity: isCollapsed ? 0 : 1 }}
            >
              🏠
            </motion.span>
          </NavLink>
        </div>

        <div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h2 
                className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 px-4 font-space"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                Planning Chapters ✨
              </motion.h2>
            )}
          </AnimatePresence>
          
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <motion.div 
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: isCollapsed ? 0 : 4 }}
              >
                <NavLink 
                  to={chapter.path} 
                  className={({isActive}) => 
                    `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive ? 'glass-card text-white glow-border' : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`
                  }
                  title={isCollapsed ? chapter.title : ''}
                >
                  <div className={`w-8 h-8 rounded-lg ${chapter.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 wiggle`}>
                    <SafeIcon icon={chapter.icon} className="text-sm text-white" />
                  </div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span 
                        className="font-medium text-sm flex-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {chapter.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <motion.span 
                    className={`text-lg interactive-scale ${isCollapsed ? 'text-center' : ''}`}
                    animate={{ 
                      opacity: isCollapsed ? 1 : 0.7,
                      scale: isCollapsed ? 1.2 : 1 
                    }}
                    whileHover={{ scale: isCollapsed ? 1.4 : 1.1 }}
                  >
                    {chapter.emoji}
                  </motion.span>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>
      </nav>

      {/* Fun background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
    </motion.div>
  );
};

export default Sidebar;