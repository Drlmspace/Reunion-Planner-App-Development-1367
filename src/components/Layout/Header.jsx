import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useReunion } from '../../contexts/ReunionContext';
import Button from '../UI/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUser, FiSettings, FiStar, FiBell, FiGift, FiZap } = FiIcons;

const Header = () => {
  const { user, signOut } = useAuth();
  const { currentReunion } = useReunion();
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const getGreeting = () => {
    const greetings = {
      morning: '🌅 Good Morning',
      afternoon: '☀️ Good Afternoon', 
      evening: '🌙 Good Evening'
    };
    return greetings[timeOfDay] || '👋 Hello';
  };

  const notifications = [
    { id: 1, text: 'Budget updated successfully! 💰', type: 'success' },
    { id: 2, text: 'New RSVP received from John! 🎉', type: 'info' },
    { id: 3, text: 'Venue booking confirmation needed ⏰', type: 'warning' }
  ];

  return (
    <motion.header 
      className="glass-card m-4 mb-0 relative overflow-hidden"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="px-8 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-12 h-12 rounded-full gradient-neon-1 flex items-center justify-center float morph-shape"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <SafeIcon icon={FiStar} className="text-2xl text-white" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-2xl font-bold text-white-glass font-fun"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentReunion ? (
                  <>
                    {currentReunion.title} <span className="text-lg">🎊</span>
                  </>
                ) : (
                  'Select a Reunion ✨'
                )}
              </motion.h1>
              {currentReunion && (
                <motion.p 
                  className="text-white/70 mt-1 flex items-center space-x-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="capitalize">{currentReunion.type}</span>
                  <span className="text-white/50">•</span>
                  <span>
                    {currentReunion.planned_date 
                      ? new Date(currentReunion.planned_date).toLocaleDateString() 
                      : 'Date TBD'
                    }
                  </span>
                  <motion.span 
                    className="text-lg"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📅
                  </motion.span>
                </motion.p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Greeting */}
            <motion.div 
              className="hidden md:flex items-center space-x-2 text-white/80"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <span className="text-sm font-medium font-space">{getGreeting()}</span>
            </motion.div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiBell} className="text-lg text-white" />
                <motion.div 
                  className="absolute -top-1 -right-1 w-5 h-5 gradient-neon-3 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-xs text-white font-bold">{notifications.length}</span>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="absolute top-12 right-0 w-80 glass-card p-4 z-50"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  >
                    <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <span>Notifications</span>
                      <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                        🔔
                      </motion.span>
                    </h3>
                    <div className="space-y-2">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          className="p-3 glass-card rounded-lg text-sm text-white/90"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {notification.text}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3 text-white/80">
              <motion.div 
                className="w-8 h-8 rounded-full gradient-neon-2 flex items-center justify-center bounce-fun"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <SafeIcon icon={FiUser} className="text-sm text-white" />
              </motion.div>
              <div className="hidden md:block">
                <span className="text-sm font-medium">{user?.email}</span>
                <motion.div 
                  className="flex items-center space-x-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="px-3 py-1 gradient-neon-3 text-white text-xs rounded-full font-medium flex items-center space-x-1">
                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                      ⚡
                    </motion.span>
                    <span>DEV MODE</span>
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Settings Button */}
            <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
              <Button 
                variant="glass" 
                size="small" 
                onClick={signOut} 
                className="flex items-center space-x-2 btn-funky"
              >
                <SafeIcon icon={FiSettings} className="text-lg" />
                <span className="hidden md:inline">Settings</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-4 left-1/4 w-2 h-2 gradient-neon-1 rounded-full opacity-60"
        animate={{ 
          y: [-10, 10, -10],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-4 right-1/3 w-3 h-3 gradient-neon-2 rounded-full opacity-40"
        animate={{ 
          y: [10, -10, 10],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
    </motion.header>
  );
};

export default Header;