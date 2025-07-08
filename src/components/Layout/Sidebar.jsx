import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { 
  FiHome, FiTarget, FiUsers, FiCalendar, FiDollarSign, FiMapPin, 
  FiClock, FiMail, FiUserCheck, FiPlane, FiCoffee, FiTruck, 
  FiShield, FiBookOpen, FiStar
} = FiIcons;

const Sidebar = () => {
  const location = useLocation();

  const chapters = [
    { id: 1, title: 'Vision & Intention', icon: FiTarget, path: '/chapters/vision', gradient: 'gradient-bg' },
    { id: 2, title: 'Planning Committee', icon: FiUsers, path: '/chapters/committee', gradient: 'gradient-bg-2' },
    { id: 3, title: 'Date & Budget', icon: FiCalendar, path: '/chapters/date-budget', gradient: 'gradient-bg-3' },
    { id: 4, title: 'Venue Planning', icon: FiMapPin, path: '/chapters/venue', gradient: 'gradient-bg-4' },
    { id: 5, title: 'Program Builder', icon: FiClock, path: '/chapters/program', gradient: 'gradient-bg-5' },
    { id: 6, title: 'Communication', icon: FiMail, path: '/chapters/communication', gradient: 'gradient-bg-6' },
    { id: 7, title: 'RSVP Management', icon: FiUserCheck, path: '/chapters/rsvp', gradient: 'gradient-bg' },
    { id: 8, title: 'Travel & Lodging', icon: FiPlane, path: '/chapters/travel', gradient: 'gradient-bg-2' },
    { id: 9, title: 'Food & Beverage', icon: FiCoffee, path: '/chapters/food', gradient: 'gradient-bg-3' },
    { id: 10, title: 'Vendor Management', icon: FiTruck, path: '/chapters/vendors', gradient: 'gradient-bg-4' },
    { id: 11, title: 'Contingency Planning', icon: FiShield, path: '/chapters/contingency', gradient: 'gradient-bg-5' },
    { id: 12, title: 'Debrief & Reflection', icon: FiBookOpen, path: '/chapters/debrief', gradient: 'gradient-bg-6' },
  ];

  return (
    <div className="w-80 glass-card m-4 mr-0 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center pulse-glow">
            <SafeIcon icon={FiStar} className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white-glass">Reunion Planner</h1>
            <p className="text-white/60 text-sm">Your planning companion</p>
          </div>
        </div>
      </div>

      <nav className="px-6">
        <div className="mb-6">
          <NavLink 
            to="/" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive ? 'glass-card text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <div className={`w-8 h-8 rounded-lg gradient-bg flex items-center justify-center`}>
              <SafeIcon icon={FiHome} className="text-sm text-white" />
            </div>
            <span className="font-medium">Dashboard</span>
          </NavLink>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 px-4">
            Planning Chapters
          </h2>
          <div className="space-y-2">
            {chapters.map((chapter) => (
              <motion.div 
                key={chapter.id}
                whileHover={{x: 4}}
                transition={{duration: 0.2}}
              >
                <NavLink 
                  to={chapter.path} 
                  className={({isActive}) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive ? 'glass-card text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <div className={`w-8 h-8 rounded-lg ${chapter.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <SafeIcon icon={chapter.icon} className="text-sm text-white" />
                  </div>
                  <span className="font-medium text-sm">{chapter.title}</span>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;