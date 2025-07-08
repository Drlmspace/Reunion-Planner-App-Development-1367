import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReunion } from '../contexts/ReunionContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const { 
  FiPlus, FiCalendar, FiUsers, FiDollarSign, FiCheckCircle, 
  FiClock, FiInfo, FiAlertTriangle, FiArrowRight, FiTrendingUp, 
  FiStar, FiTarget, FiZap, FiHeart, FiGift 
} = FiIcons;

const Dashboard = () => {
  const { currentReunion, reunions } = useReunion();
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);
  const [celebration, setCelebration] = useState(false);

  // Sample budget data
  const budgetData = {
    planned: 5000,
    actual: 5250,
    remaining: -250,
    categories: [
      { name: 'Venue', planned: 2000, actual: 2200 },
      { name: 'Food & Beverage', planned: 1500, actual: 1600 },
      { name: 'Entertainment', planned: 800, actual: 750 },
      { name: 'Decorations', planned: 400, actual: 400 },
      { name: 'Miscellaneous', planned: 300, actual: 300 }
    ]
  };

  useEffect(() => {
    if (budgetData.actual > budgetData.planned) {
      setShowBudgetAlert(true);
      toast.error('Budget exceeded! Please review your expenses.', {
        duration: 5000,
        icon: '⚠️',
        style: {
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
        }
      });
    }
  }, [budgetData.actual, budgetData.planned]);

  const quickStats = [
    { 
      label: 'Total Reunions', 
      value: reunions.length, 
      icon: FiUsers, 
      gradient: 'gradient-neon-1', 
      description: 'Active projects',
      emoji: '👥'
    },
    { 
      label: 'Active Planning', 
      value: 1, 
      icon: FiClock, 
      gradient: 'gradient-neon-2', 
      description: 'In progress',
      emoji: '⏰'
    },
    { 
      label: 'Completed', 
      value: 0, 
      icon: FiCheckCircle, 
      gradient: 'gradient-bg-4', 
      description: 'Finished events',
      emoji: '✅'
    },
    { 
      label: 'Budget Status', 
      value: budgetData.remaining >= 0 ? `$${budgetData.remaining} left` : `$${Math.abs(budgetData.remaining)} over`,
      icon: FiDollarSign, 
      gradient: budgetData.remaining >= 0 ? 'gradient-bg-4' : 'gradient-neon-2', 
      description: 'Financial status',
      emoji: '💰'
    }
  ];

  const recentActivity = [
    { action: 'Created new reunion', time: '2 hours ago', type: 'create', icon: FiPlus, emoji: '🎉' },
    { action: 'Updated venue details', time: '1 day ago', type: 'update', icon: FiTarget, emoji: '📍' },
    { action: 'Added committee member', time: '3 days ago', type: 'add', icon: FiUsers, emoji: '👤' }
  ];

  const chapters = [
    { name: 'Vision & Intention', progress: 100, gradient: 'gradient-neon-1', emoji: '🎯' },
    { name: 'Planning Committee', progress: 75, gradient: 'gradient-neon-2', emoji: '👥' },
    { name: 'Date & Budget', progress: 50, gradient: 'gradient-neon-3', emoji: '📅' },
    { name: 'Venue Planning', progress: 25, gradient: 'gradient-bg-4', emoji: '📍' },
    { name: 'Program Builder', progress: 0, gradient: 'gradient-bg-5', emoji: '⏰' },
    { name: 'Communication', progress: 0, gradient: 'gradient-bg-6', emoji: '💬' }
  ];

  const triggerCelebration = () => {
    setCelebration(true);
    setTimeout(() => setCelebration(false), 600);
  };

  return (
    <div className="space-y-8 relative">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-10 right-10 w-4 h-4 gradient-neon-1 rounded-full opacity-60"
        animate={{ 
          y: [-20, 20, -20],
          opacity: [0.6, 1, 0.6],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-32 left-10 w-3 h-3 gradient-neon-2 rounded-full opacity-40"
        animate={{ 
          y: [20, -20, 20],
          opacity: [0.4, 0.8, 0.4],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      />

      {/* Development Mode Notice */}
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Card glow className="overflow-hidden">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-12 h-12 rounded-full gradient-neon-3 flex items-center justify-center float"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <SafeIcon icon={FiZap} className="text-white text-xl" />
            </motion.div>
            <div>
              <motion.h3 
                className="text-lg font-semibold text-white font-fun"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Development Mode <span className="emoji-bounce">⚡</span>
              </motion.h3>
              <motion.p 
                className="text-white/70"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Authentication is disabled. You're logged in as a developer with mock data. All features are accessible for testing! 
                <span className="ml-2">🚀</span>
              </motion.p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Budget Alert */}
      <AnimatePresence>
        {showBudgetAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Card className="border-red-400/50 glow-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="w-12 h-12 rounded-full gradient-neon-2 flex items-center justify-center pulse-rainbow"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <SafeIcon icon={FiAlertTriangle} className="text-white text-xl" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white font-fun">
                      Budget Alert <span className="emoji-bounce">⚠️</span>
                    </h3>
                    <p className="text-white/70">
                      Your budget of ${budgetData.planned.toLocaleString()} has been exceeded by ${Math.abs(budgetData.remaining).toLocaleString()} 
                      <span className="ml-2">💸</span>
                    </p>
                  </div>
                </div>
                <Link to="/chapters/date-budget">
                  <Button variant="outline" size="small" className="btn-funky">
                    <span className="flex items-center space-x-2">
                      <span>Review Budget</span>
                      <SafeIcon icon={FiArrowRight} />
                    </span>
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold text-white-glass mb-2 font-fun">
            Dashboard <span className="text-3xl emoji-bounce">🎊</span>
          </h1>
          <p className="text-white/70 text-lg">
            Welcome back! Here's what's happening with your reunion planning 
            <motion.span 
              className="ml-2 text-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <Button 
            variant="funky" 
            className="flex items-center space-x-2"
            onClick={triggerCelebration}
          >
            <SafeIcon icon={FiPlus} />
            <span>New Reunion</span>
            <span className="text-lg">🎉</span>
          </Button>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1, 
              type: "spring", 
              stiffness: 100,
              damping: 10 
            }}
            className={celebration ? 'celebrate' : ''}
          >
            <Card hover glow className="text-center group relative overflow-hidden">
              <motion.div 
                className="flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1 }}
              >
                <div className={`w-16 h-16 rounded-2xl ${stat.gradient} flex items-center justify-center float group-hover:scale-110 transition-transform duration-300 morph-shape`}>
                  <SafeIcon icon={stat.icon} className="text-2xl text-white" />
                </div>
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold text-white mb-1 font-space"
                whileHover={{ scale: 1.05 }}
              >
                {stat.value}
              </motion.h3>
              
              <p className="text-white/90 font-medium">{stat.label}</p>
              <p className="text-white/60 text-sm mt-1 flex items-center justify-center space-x-1">
                <span>{stat.description}</span>
                <span className="text-lg">{stat.emoji}</span>
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Budget Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Card className="overflow-hidden" glow>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-bg-4 flex items-center justify-center float"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <SafeIcon icon={FiDollarSign} className="text-2xl text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white font-fun">
                  Budget Overview <span className="text-xl">💰</span>
                </h2>
                <p className="text-white/70">Track your spending and budget allocation</p>
              </div>
            </div>
            <Link to="/chapters/date-budget">
              <Button variant="outline" size="small">
                <span className="flex items-center space-x-2">
                  <span>Budget Details</span>
                  <SafeIcon icon={FiArrowRight} />
                </span>
              </Button>
            </Link>
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Planned Budget', value: budgetData.planned, emoji: '📊' },
                { label: 'Actual Expenses', value: budgetData.actual, emoji: '💸' },
                { 
                  label: budgetData.remaining >= 0 ? 'Remaining' : 'Over Budget', 
                  value: Math.abs(budgetData.remaining),
                  emoji: budgetData.remaining >= 0 ? '💚' : '🔴'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="glass-card p-6 rounded-2xl relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-white/70 mb-2 flex items-center space-x-2">
                    <span>{item.label}</span>
                    <span className="text-lg">{item.emoji}</span>
                  </div>
                  <div className={`text-3xl font-bold ${
                    item.label.includes('Over') ? 'text-red-400' : 
                    item.label.includes('Remaining') ? 'text-green-400' : 'text-white'
                  } font-space`}>
                    ${item.value.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>Category Breakdown</span>
                <span className="text-xl">📈</span>
              </h3>
              {budgetData.categories.map((category, index) => (
                <motion.div 
                  key={index} 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">{category.name}</span>
                    <span className={`font-semibold ${
                      category.actual > category.planned ? 'text-red-400' : 'text-white'
                    }`}>
                      ${category.actual.toLocaleString()} / ${category.planned.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className={`h-3 rounded-full progress-rainbow ${
                        category.actual > category.planned ? 'gradient-neon-2' : 'gradient-bg-4'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (category.actual / category.planned) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Reunion */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card glow>
            <div className="flex items-center space-x-3 mb-6">
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-neon-1 flex items-center justify-center float"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <SafeIcon icon={FiCalendar} className="text-2xl text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white font-fun">
                  Current Reunion <span className="text-lg">🎪</span>
                </h2>
                <p className="text-white/70">Your active planning project</p>
              </div>
            </div>
            
            {currentReunion ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center space-x-2">
                    <span>{currentReunion.title}</span>
                    <span className="text-xl">🎊</span>
                  </h3>
                  <p className="text-white/70">{currentReunion.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="glass-card p-4 rounded-xl">
                    <span className="text-white/70 flex items-center space-x-1">
                      <span>Type:</span>
                      <span>🏷️</span>
                    </span>
                    <div className="font-semibold text-white capitalize mt-1">{currentReunion.type}</div>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <span className="text-white/70 flex items-center space-x-1">
                      <span>Date:</span>
                      <span>📅</span>
                    </span>
                    <div className="font-semibold text-white mt-1">
                      {currentReunion.planned_date 
                        ? new Date(currentReunion.planned_date).toLocaleDateString() 
                        : 'Not set'
                      }
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/70 flex items-center space-x-1">
                      <span>Progress</span>
                      <span>📊</span>
                    </span>
                    <span className="text-white font-semibold">25%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="gradient-neon-1 h-3 rounded-full progress-rainbow"
                      initial={{ width: 0 }}
                      animate={{ width: '25%' }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 morph-shape"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <SafeIcon icon={FiCalendar} className="text-2xl text-white/50" />
                </motion.div>
                <p className="text-white/70 mb-6 flex items-center justify-center space-x-2">
                  <span>No reunion selected</span>
                  <span className="text-xl">😢</span>
                </p>
                <Button variant="outline" size="small">
                  Create Your First Reunion 🚀
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card glow>
            <div className="flex items-center space-x-3 mb-6">
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-neon-3 flex items-center justify-center float"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <SafeIcon icon={FiClock} className="text-2xl text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white font-fun">
                  Recent Activity <span className="text-lg">⚡</span>
                </h2>
                <p className="text-white/70">Latest planning updates</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4 p-4 glass-card rounded-xl group hover:bg-white/15 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <motion.div 
                    className="w-8 h-8 rounded-lg gradient-neon-2 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SafeIcon icon={activity.icon} className="text-sm text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-medium text-white flex items-center space-x-2">
                      <span>{activity.action}</span>
                      <span className="text-lg">{activity.emoji}</span>
                    </p>
                    <p className="text-white/60 text-sm">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Chapter Progress */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <Card glow>
          <div className="flex items-center space-x-3 mb-8">
            <motion.div 
              className="w-12 h-12 rounded-xl gradient-bg-5 flex items-center justify-center float"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <SafeIcon icon={FiTrendingUp} className="text-2xl text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white font-fun">
                Chapter Progress <span className="text-xl">📚</span>
              </h2>
              <p className="text-white/70">Track your planning journey</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 rounded-2xl group hover:bg-white/15 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center space-x-2">
                    <span>{chapter.name}</span>
                    <span className="text-lg">{chapter.emoji}</span>
                  </h3>
                  <span className="text-white/70 font-medium">{chapter.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className={`${chapter.gradient} progress-rainbow`}
                    style={{ height: '100%', borderRadius: '9999px' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${chapter.progress}%` }}
                    transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;