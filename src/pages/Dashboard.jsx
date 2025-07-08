import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReunion } from '../contexts/ReunionContext';
import { isSupabaseAvailable } from '../lib/supabase';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const { FiPlus, FiCalendar, FiUsers, FiDollarSign, FiCheckCircle, FiClock, FiMessageSquare, FiAlertTriangle, FiArrowRight, FiX, FiSave, FiRefreshCw, FiTrash2 } = FiIcons;

const Dashboard = () => {
  const { currentReunion, reunions, createReunion, setCurrentReunion, loading, deleteReunion } = useReunion();
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reunionToDelete, setReunionToDelete] = useState(null);
  const [newReunion, setNewReunion] = useState({
    title: '',
    description: '',
    type: 'family',
    planned_date: ''
  });

  const MAX_REUNIONS = 2;
  const canCreateReunion = reunions.length < MAX_REUNIONS;

  // Sample budget data - in a real app, this would come from the budget context or API
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

  const quickStats = [
    { label: 'Total Reunions', value: reunions.length, icon: FiUsers, color: 'text-blue-600' },
    { label: 'Active Planning', value: currentReunion ? 1 : 0, icon: FiClock, color: 'text-orange-600' },
    { label: 'Completed', value: 0, icon: FiCheckCircle, color: 'text-green-600' },
    { 
      label: 'Budget Status', 
      value: budgetData.remaining >= 0 ? `$${budgetData.remaining} left` : `$${Math.abs(budgetData.remaining)} over`, 
      icon: FiDollarSign, 
      color: budgetData.remaining >= 0 ? 'text-green-600' : 'text-red-600' 
    }
  ];

  const recentActivity = [
    { action: 'Created new reunion', time: '2 hours ago', type: 'create' },
    { action: 'Updated venue details', time: '1 day ago', type: 'update' },
    { action: 'Added committee member', time: '3 days ago', type: 'add' }
  ];

  const handleCreateReunion = async () => {
    if (!newReunion.title.trim()) {
      toast.error('Please enter a reunion title');
      return;
    }
    
    if (!newReunion.type) {
      toast.error('Please select a reunion type');
      return;
    }

    if (reunions.length >= MAX_REUNIONS) {
      toast.error(`You can only create up to ${MAX_REUNIONS} reunions. Please delete an existing reunion first.`);
      return;
    }

    try {
      const { data, error } = await createReunion(newReunion);
      
      if (error) {
        toast.error('Failed to create reunion: ' + error.message);
        return;
      }
      
      // Set the newly created reunion as current
      if (data) {
        setCurrentReunion(data);
      }
      
      // Reset form and close modal
      setNewReunion({
        title: '',
        description: '',
        type: 'family',
        planned_date: ''
      });
      setShowCreateForm(false);
      
      // Success message is handled in the context
    } catch (error) {
      console.error('Error creating reunion:', error);
      toast.error('Failed to create reunion');
    }
  };

  const handleDeleteReunion = async (reunion) => {
    setReunionToDelete(reunion);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteReunion = async () => {
    if (!reunionToDelete) return;
    
    try {
      const { error } = await deleteReunion(reunionToDelete.id);
      
      if (error) {
        toast.error('Failed to delete reunion: ' + error.message);
      } else {
        toast.success('Reunion deleted successfully');
        
        // If we deleted the current reunion, select another one if available
        if (currentReunion && currentReunion.id === reunionToDelete.id) {
          const remainingReunions = reunions.filter(r => r.id !== reunionToDelete.id);
          if (remainingReunions.length > 0) {
            setCurrentReunion(remainingReunions[0]);
          } else {
            setCurrentReunion(null);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting reunion:', error);
      toast.error('Failed to delete reunion');
    } finally {
      setShowDeleteConfirm(false);
      setReunionToDelete(null);
    }
  };

  const switchReunion = (reunion) => {
    setCurrentReunion(reunion);
    toast.success(`Switched to ${reunion.title}`);
  };

  const openFeedbackForm = () => {
    window.open('https://formdesigner.pro/form/view/230279', '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Budget Alert */}
      {showBudgetAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiAlertTriangle} className="text-red-600" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Budget Alert</h3>
                <p className="text-sm text-red-700">
                  Your budget of ${budgetData.planned.toLocaleString()} has been exceeded by ${Math.abs(budgetData.remaining).toLocaleString()}
                </p>
              </div>
            </div>
            <Link to="/chapters/date-budget">
              <Button
                variant="outline"
                size="small"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <span className="flex items-center space-x-1">
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your reunion planning.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2"
          disabled={loading || !canCreateReunion}
          title={!canCreateReunion ? `Maximum limit of ${MAX_REUNIONS} reunions reached` : undefined}
        >
          <SafeIcon icon={FiPlus} />
          <span>New Reunion</span>
        </Button>
      </div>

      {/* Reunion Limit Alert */}
      {!canCreateReunion && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiAlertTriangle} className="text-yellow-600" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Reunion Limit Reached</h3>
              <p className="text-sm text-yellow-700">
                You can create up to {MAX_REUNIONS} reunions. Please delete an existing reunion to create a new one.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Reunion Modal */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Reunion</h2>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowCreateForm(false)}
                disabled={loading}
              >
                <SafeIcon icon={FiX} />
              </Button>
            </div>
            <div className="space-y-4">
              <Input
                label="Reunion Title"
                value={newReunion.title}
                onChange={(e) => setNewReunion({ ...newReunion, title: e.target.value })}
                placeholder="e.g., Smith Family Reunion 2024"
                required
                disabled={loading}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reunion Type
                </label>
                <select
                  value={newReunion.type}
                  onChange={(e) => setNewReunion({ ...newReunion, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={loading}
                >
                  <option value="family">Family Reunion</option>
                  <option value="class">Class Reunion</option>
                  <option value="military">Military Reunion</option>
                  <option value="corporate">Corporate Reunion</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input
                label="Planned Date (Optional)"
                type="date"
                value={newReunion.planned_date}
                onChange={(e) => setNewReunion({ ...newReunion, planned_date: e.target.value })}
                disabled={loading}
              />
              <Input
                label="Description (Optional)"
                value={newReunion.description}
                onChange={(e) => setNewReunion({ ...newReunion, description: e.target.value })}
                placeholder="Brief description of your reunion"
                disabled={loading}
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateReunion}
                className="flex-1 flex items-center justify-center space-x-2"
                loading={loading}
                disabled={loading}
              >
                <SafeIcon icon={FiSave} />
                <span>Create Reunion</span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && reunionToDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <SafeIcon icon={FiAlertTriangle} className="text-xl" />
              <h2 className="text-xl font-semibold">Delete Reunion</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{reunionToDelete.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setReunionToDelete(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDeleteReunion}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiTrash2} />
                <span>Delete Reunion</span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover padding="normal" className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-gray-100 p-3 rounded-full">
                  <SafeIcon icon={stat.icon} className={`text-2xl ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* All Reunions List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Reunions</h2>
          <div className="text-sm text-gray-500">
            {reunions.length} of {MAX_REUNIONS} reunions
          </div>
        </div>

        <div className="space-y-4">
          {reunions.map(reunion => (
            <div 
              key={reunion.id} 
              className={`p-4 border rounded-lg ${currentReunion?.id === reunion.id ? 'border-blue-400 bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{reunion.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <span className="capitalize">{reunion.type}</span>
                    {reunion.planned_date && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{new Date(reunion.planned_date).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                  {reunion.description && (
                    <p className="text-sm text-gray-600 mt-2">{reunion.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {currentReunion?.id !== reunion.id && (
                    <Button 
                      size="small" 
                      onClick={() => switchReunion(reunion)}
                      className="flex items-center space-x-1"
                    >
                      <SafeIcon icon={FiRefreshCw} />
                      <span>Switch</span>
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleDeleteReunion(reunion)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {reunions.length === 0 && (
            <div className="text-center py-6">
              <SafeIcon icon={FiCalendar} className="text-4xl text-gray-300 mb-3 mx-auto" />
              <p className="text-gray-500 mb-4">No reunions created yet</p>
              <Button variant="outline" size="small" onClick={() => setShowCreateForm(true)}>
                Create Your First Reunion
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Budget Overview */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <SafeIcon icon={FiDollarSign} className="text-emerald-600" />
            <span>Budget Overview</span>
          </h2>
          <Link to="/chapters/date-budget">
            <Button variant="outline" size="small">
              <span className="flex items-center space-x-1">
                <span>Budget Details</span>
                <SafeIcon icon={FiArrowRight} />
              </span>
            </Button>
          </Link>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="bg-gray-50 p-4 rounded-lg flex-1">
              <div className="text-sm text-gray-500 mb-1">Planned Budget</div>
              <div className="text-2xl font-bold text-gray-900">${budgetData.planned.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex-1">
              <div className="text-sm text-gray-500 mb-1">Actual Expenses</div>
              <div className="text-2xl font-bold text-gray-900">${budgetData.actual.toLocaleString()}</div>
            </div>
            <div className={`p-4 rounded-lg flex-1 ${budgetData.remaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="text-sm text-gray-500 mb-1">{budgetData.remaining >= 0 ? 'Remaining' : 'Over Budget'}</div>
              <div className={`text-2xl font-bold ${budgetData.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(budgetData.remaining).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Category Breakdown</h3>
            {budgetData.categories.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className={category.actual > category.planned ? 'text-red-600' : 'text-gray-600'}>
                    ${category.actual.toLocaleString()} / ${category.planned.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${category.actual > category.planned ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (category.actual / category.planned) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Current Reunion & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Reunion */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Current Reunion</h2>
            <SafeIcon icon={FiCalendar} className="text-gray-400" />
          </div>
          {currentReunion ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{currentReunion.title}</h3>
                <p className="text-sm text-gray-600">{currentReunion.description}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{currentReunion.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {currentReunion.planned_date
                    ? new Date(currentReunion.planned_date).toLocaleDateString()
                    : 'Not set'}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: '25%' }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <SafeIcon icon={FiCalendar} className="text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No reunion selected</p>
              <Button variant="outline" size="small" onClick={() => setShowCreateForm(true)}>
                Create Your First Reunion
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <SafeIcon icon={FiClock} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Chapter Progress */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Chapter Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Vision & Intention', progress: 100, color: 'bg-green-500' },
            { name: 'Planning Committee', progress: 75, color: 'bg-blue-500' },
            { name: 'Date & Budget', progress: 50, color: 'bg-yellow-500' },
            { name: 'Venue Planning', progress: 25, color: 'bg-red-500' },
            { name: 'Program Builder', progress: 0, color: 'bg-gray-300' },
            { name: 'Communication', progress: 0, color: 'bg-gray-300' }
          ].map((chapter, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 text-sm">{chapter.name}</h3>
                <span className="text-xs text-gray-500">{chapter.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${chapter.color}`}
                  style={{ width: `${chapter.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Feedback Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card hover className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <SafeIcon icon={FiMessageSquare} className="text-blue-600" />
                <span>Your Opinion Matters</span>
              </h2>
              <p className="text-gray-700 mb-4">
                Help us make the Reunion Planner better by sharing your thoughts, suggestions, or reporting any issues you've encountered.
              </p>
              <Button onClick={openFeedbackForm} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
                <span>Submit Feedback</span>
                <SafeIcon icon={FiArrowRight} />
              </Button>
            </div>
            <div className="hidden md:flex items-center justify-center h-24 w-24 bg-blue-100 rounded-full">
              <SafeIcon icon={FiMessageSquare} className="text-4xl text-blue-500" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;