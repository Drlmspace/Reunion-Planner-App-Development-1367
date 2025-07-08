import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReunion } from '../contexts/ReunionContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const { FiPlus, FiCalendar, FiUsers, FiDollarSign, FiCheckCircle, FiClock, FiInfo, FiAlertTriangle, FiArrowRight, FiTrendingUp, FiStar, FiTarget } = FiIcons;

const Dashboard = () => {
  const { currentReunion, reunions } = useReunion();
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);

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
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }
      });
    }
  }, [budgetData.actual, budgetData.planned]);

  const quickStats = [
    { 
      label: 'Total Reunions', 
      value: reunions.length, 
      icon: FiUsers, 
      gradient: 'gradient-bg',
      description: 'Active projects'
    },
    { 
      label: 'Active Planning', 
      value: 1, 
      icon: FiClock, 
      gradient: 'gradient-bg-2',
      description: 'In progress'
    },
    { 
      label: 'Completed', 
      value: 0, 
      icon: FiCheckCircle, 
      gradient: 'gradient-bg-4',
      description: 'Finished events'
    },
    { 
      label: 'Budget Status', 
      value: budgetData.remaining >= 0 ? `$${budgetData.remaining} left` : `$${Math.abs(budgetData.remaining)} over`,
      icon: FiDollarSign, 
      gradient: budgetData.remaining >= 0 ? 'gradient-bg-4' : 'gradient-bg-2',
      description: 'Financial status'
    }
  ];

  const recentActivity = [
    { action: 'Created new reunion', time: '2 hours ago', type: 'create', icon: FiPlus },
    { action: 'Updated venue details', time: '1 day ago', type: 'update', icon: FiTarget },
    { action: 'Added committee member', time: '3 days ago', type: 'add', icon: FiUsers }
  ];

  const chapters = [
    { name: 'Vision & Intention', progress: 100, gradient: 'gradient-bg' },
    { name: 'Planning Committee', progress: 75, gradient: 'gradient-bg-2' },
    { name: 'Date & Budget', progress: 50, gradient: 'gradient-bg-3' },
    { name: 'Venue Planning', progress: 25, gradient: 'gradient-bg-4' },
    { name: 'Program Builder', progress: 0, gradient: 'gradient-bg-5' },
    { name: 'Communication', progress: 0, gradient: 'gradient-bg-6' }
  ];

  return (
    <div className="space-y-8">
      {/* Development Mode Notice */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full gradient-bg-5 flex items-center justify-center">
            <SafeIcon icon={FiInfo} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Development Mode</h3>
            <p className="text-white/70">
              Authentication is disabled. You're logged in as a developer with mock data. All features are accessible for testing and development.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Budget Alert */}
      {showBudgetAlert && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-red-400/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full gradient-bg-2 flex items-center justify-center pulse-glow">
                <SafeIcon icon={FiAlertTriangle} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Budget Alert</h3>
                <p className="text-white/70">
                  Your budget of ${budgetData.planned.toLocaleString()} has been exceeded by ${Math.abs(budgetData.remaining).toLocaleString()}
                </p>
              </div>
            </div>
            <Link to="/chapters/date-budget">
              <Button variant="outline" size="small">
                <span className="flex items-center space-x-2">
                  <span>Review Budget</span>
                  <SafeIcon icon={FiArrowRight} />
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white-glass mb-2">Dashboard</h1>
          <p className="text-white/70 text-lg">
            Welcome back! Here's what's happening with your reunion planning.
          </p>
        </div>
        <Button variant="gradient" className="flex items-center space-x-2">
          <SafeIcon icon={FiPlus} />
          <span>New Reunion</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="text-center group">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-16 h-16 rounded-2xl ${stat.gradient} flex items-center justify-center float group-hover:scale-110 transition-transform duration-300`}>
                  <SafeIcon icon={stat.icon} className="text-2xl text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-white/90 font-medium">{stat.label}</p>
              <p className="text-white/60 text-sm mt-1">{stat.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Budget Overview */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl gradient-bg-4 flex items-center justify-center">
              <SafeIcon icon={FiDollarSign} className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Budget Overview</h2>
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
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-white/70 mb-2">Planned Budget</div>
              <div className="text-3xl font-bold text-white">${budgetData.planned.toLocaleString()}</div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-white/70 mb-2">Actual Expenses</div>
              <div className="text-3xl font-bold text-white">${budgetData.actual.toLocaleString()}</div>
            </div>
            <div className={`glass-card p-6 rounded-2xl ${budgetData.remaining >= 0 ? 'border-green-400/50' : 'border-red-400/50'}`}>
              <div className="text-white/70 mb-2">{budgetData.remaining >= 0 ? 'Remaining' : 'Over Budget'}</div>
              <div className={`text-3xl font-bold ${budgetData.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${Math.abs(budgetData.remaining).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Category Breakdown</h3>
            {budgetData.categories.map((category, index) => (
              <motion.div 
                key={index} 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">{category.name}</span>
                  <span className={`font-semibold ${category.actual > category.planned ? 'text-red-400' : 'text-white'}`}>
                    ${category.actual.toLocaleString()} / ${category.planned.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className={`h-3 rounded-full ${category.actual > category.planned ? 'gradient-bg-2' : 'gradient-bg-4'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (category.actual / category.planned) * 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Reunion */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <SafeIcon icon={FiCalendar} className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Current Reunion</h2>
              <p className="text-white/70">Your active planning project</p>
            </div>
          </div>
          
          {currentReunion ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{currentReunion.title}</h3>
                <p className="text-white/70">{currentReunion.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="glass-card p-4 rounded-xl">
                  <span className="text-white/70">Type:</span>
                  <div className="font-semibold text-white capitalize mt-1">{currentReunion.type}</div>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <span className="text-white/70">Date:</span>
                  <div className="font-semibold text-white mt-1">
                    {currentReunion.planned_date ? new Date(currentReunion.planned_date).toLocaleDateString() : 'Not set'}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/70">Progress</span>
                  <span className="text-white font-semibold">25%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="gradient-bg h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '25%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCalendar} className="text-2xl text-white/50" />
              </div>
              <p className="text-white/70 mb-6">No reunion selected</p>
              <Button variant="outline" size="small">
                Create Your First Reunion
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-bg-3 flex items-center justify-center">
              <SafeIcon icon={FiClock} className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <p className="text-white/70">Latest planning updates</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={index} 
                className="flex items-center space-x-4 p-4 glass-card rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-8 h-8 rounded-lg gradient-bg-2 flex items-center justify-center flex-shrink-0">
                  <SafeIcon icon={activity.icon} className="text-sm text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{activity.action}</p>
                  <p className="text-white/60 text-sm">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Chapter Progress */}
      <Card>
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-bg-5 flex items-center justify-center">
            <SafeIcon icon={FiTrendingUp} className="text-2xl text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Chapter Progress</h2>
            <p className="text-white/70">Track your planning journey</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <motion.div 
              key={index} 
              className="glass-card p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">{chapter.name}</h3>
                <span className="text-white/70 font-medium">{chapter.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className={chapter.gradient}
                  style={{ height: '100%', borderRadius: '9999px' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${chapter.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;