import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { 
  FiHome, FiTarget, FiUsers, FiCalendar, FiDollarSign, FiMapPin, 
  FiClock, FiMail, FiUserCheck, FiPlane, FiCoffee, FiTruck, 
  FiShield, FiBookOpen 
} = FiIcons;

const Sidebar = () => {
  const location = useLocation();

  const chapters = [
    { id: 1, title: 'Vision & Intention', icon: FiTarget, path: '/chapters/vision', color: 'text-purple-600' },
    { id: 2, title: 'Planning Committee', icon: FiUsers, path: '/chapters/committee', color: 'text-blue-600' },
    { id: 3, title: 'Date & Budget', icon: FiCalendar, path: '/chapters/date-budget', color: 'text-green-600' },
    { id: 4, title: 'Venue Planning', icon: FiMapPin, path: '/chapters/venue', color: 'text-red-600' },
    { id: 5, title: 'Program Builder', icon: FiClock, path: '/chapters/program', color: 'text-orange-600' },
    { id: 6, title: 'Communication', icon: FiMail, path: '/chapters/communication', color: 'text-pink-600' },
    { id: 7, title: 'RSVP Management', icon: FiUserCheck, path: '/chapters/rsvp', color: 'text-indigo-600' },
    { id: 8, title: 'Travel & Lodging', icon: FiPlane, path: '/chapters/travel', color: 'text-cyan-600' },
    { id: 9, title: 'Food & Beverage', icon: FiCoffee, path: '/chapters/food', color: 'text-yellow-600' },
    { id: 10, title: 'Vendor Management', icon: FiTruck, path: '/chapters/vendors', color: 'text-gray-600' },
    { id: 11, title: 'Contingency Planning', icon: FiShield, path: '/chapters/contingency', color: 'text-teal-600' },
    { id: 12, title: 'Debrief & Reflection', icon: FiBookOpen, path: '/chapters/debrief', color: 'text-emerald-600' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiHome} className="text-2xl text-primary-600" />
          <h1 className="text-xl font-bold text-gray-800">Reunion Planner</h1>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-6 mb-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <SafeIcon icon={FiHome} className="text-lg" />
            <span className="font-medium">Dashboard</span>
          </NavLink>
        </div>

        <div className="px-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Chapters
          </h2>
          <div className="space-y-1">
            {chapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <NavLink
                  to={chapter.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors group ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <SafeIcon 
                    icon={chapter.icon} 
                    className={`text-lg ${chapter.color} group-hover:scale-110 transition-transform`} 
                  />
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