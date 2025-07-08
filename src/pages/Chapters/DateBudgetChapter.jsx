import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiCalendar, FiDollarSign, FiPlus, FiEdit, FiTrash2, FiAlertCircle, FiLink, FiAlertTriangle } = FiIcons;

const DateBudgetChapter = () => {
  const [activeTab, setActiveTab] = useState('date');
  const [budgetItems, setBudgetItems] = useState([
    {
      id: 1,
      category: 'Venue',
      item: 'Reception Hall',
      estimated: 2000,
      actual: 2200,
      notes: 'Includes tables and chairs',
      source: 'manual'
    },
    {
      id: 2,
      category: 'Food & Beverage',
      item: 'Catering',
      estimated: 3000,
      actual: 3000,
      notes: 'Buffet style for 100 people',
      source: 'manual'
    },
    {
      id: 3,
      category: 'Entertainment',
      item: 'DJ Services',
      estimated: 800,
      actual: 750,
      notes: '6-hour service',
      source: 'manual'
    },
    {
      id: 4,
      category: 'Decorations',
      item: 'Centerpieces',
      estimated: 300,
      actual: 300,
      notes: 'Floral arrangements',
      source: 'manual'
    },
    // These would be synced from Program Chapter
    {
      id: 5,
      category: 'Food & Beverage',
      item: 'Lunch & Mingling Event',
      estimated: 1200,
      actual: 1200,
      notes: 'From Program Schedule',
      source: 'program'
    },
    {
      id: 6,
      category: 'Entertainment',
      item: 'Registration & Welcome Event',
      estimated: 150,
      actual: 150,
      notes: 'From Program Schedule',
      source: 'program'
    }
  ]);

  const [newItem, setNewItem] = useState({
    category: '',
    item: '',
    estimated: '',
    notes: ''
  });

  const [showProgramItems, setShowProgramItems] = useState(true);
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);
  
  const categories = [
    'Venue',
    'Food & Beverage',
    'Entertainment',
    'Decorations',
    'Photography/Video',
    'Transportation',
    'Invitations',
    'Gifts/Favors',
    'Miscellaneous'
  ];

  const filteredBudgetItems = showProgramItems
    ? budgetItems
    : budgetItems.filter(item => item.source !== 'program');

  const totalEstimated = filteredBudgetItems.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = filteredBudgetItems.reduce((sum, item) => sum + item.actual, 0);
  const programItemsTotal = budgetItems
    .filter(item => item.source === 'program')
    .reduce((sum, item) => sum + item.estimated, 0);

  useEffect(() => {
    // Check if budget is exceeded
    if (totalActual > totalEstimated) {
      setShowBudgetAlert(true);
      toast.error('Budget exceeded! Please review your expenses.', {
        duration: 5000,
        icon: '⚠️'
      });
    } else {
      setShowBudgetAlert(false);
    }
  }, [totalActual, totalEstimated]);

  const addBudgetItem = () => {
    if (newItem.category && newItem.item && newItem.estimated) {
      setBudgetItems([
        ...budgetItems,
        {
          ...newItem,
          id: Date.now(),
          estimated: parseFloat(newItem.estimated),
          actual: 0,
          source: 'manual'
        }
      ]);
      setNewItem({
        category: '',
        item: '',
        estimated: '',
        notes: ''
      });
    }
  };

  const removeBudgetItem = (id) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const updateBudgetItem = (id, field, value) => {
    setBudgetItems(
      budgetItems.map(item =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'estimated' || field === 'actual'
                  ? parseFloat(value) || 0
                  : value
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 3: Date & Budget</h1>
          <p className="text-gray-600 mt-1">
            Set your reunion date and establish a comprehensive budget plan.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiCalendar} className="text-2xl text-green-600" />
          <span className="text-sm text-gray-500">Progress: 60%</span>
        </div>
      </div>

      {/* Budget Alert */}
      {showBudgetAlert && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiAlertTriangle} className="text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Budget Alert</h3>
              <p className="text-sm text-red-700">
                Your estimated budget of ${totalEstimated.toLocaleString()} has been exceeded by 
                ${Math.abs(totalEstimated - totalActual).toLocaleString()}. Please review your expenses 
                or adjust your budget.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('date')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'date'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiCalendar} />
            <span>Date Planning</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'budget'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiDollarSign} />
            <span>Budget Planning</span>
          </div>
        </button>
      </div>

      {/* Date Planning Tab */}
      {activeTab === 'date' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Date Selection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternative Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Preferences
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Morning', 'Afternoon', 'Evening', 'All Day'].map(time => (
                  <label key={time} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{time}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>2-3 hours</option>
                <option>Half day (4-6 hours)</option>
                <option>Full day (8+ hours)</option>
                <option>Weekend (2 days)</option>
                <option>Multi-day (3+ days)</option>
              </select>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Conflict Detection</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <SafeIcon icon={FiAlertCircle} className="text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Potential Conflicts</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your selected date conflicts with:
                  </p>
                  <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
                    <li>Memorial Day Weekend</li>
                    <li>Local High School Graduation</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Consider These Factors:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'National holidays',
                    'School schedules',
                    'Weather patterns',
                    'Travel costs',
                    'Venue availability',
                    'Religious observances'
                  ].map(factor => (
                    <label key={factor} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Budget Planning Tab */}
      {activeTab === 'budget' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Budget Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-blue-600">${totalEstimated.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Estimated Budget</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-green-600">${totalActual.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Actual Spent</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div
                className={`text-2xl font-bold ${
                  totalEstimated - totalActual >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ${Math.abs(totalEstimated - totalActual).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {totalEstimated - totalActual >= 0 ? 'Remaining' : 'Over Budget'}
              </div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-purple-600">${programItemsTotal.toLocaleString()}</div>
              <div className="text-sm text-gray-600">From Programs</div>
            </Card>
          </div>

          {/* Program Integration Notice */}
          {programItemsTotal > 0 && (
            <Card>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <SafeIcon icon={FiLink} className="text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900">Program Costs Integrated</h3>
                  <p className="text-sm text-blue-800 mt-1">
                    ${programItemsTotal.toLocaleString()} in costs have been synced from your Program
                    Chapter. These items are automatically updated when you modify event costs in the
                    Program Builder.
                  </p>
                </div>
                <button
                  onClick={() => setShowProgramItems(!showProgramItems)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showProgramItems ? 'Hide' : 'Show'} Program Items
                </button>
              </div>
            </Card>
          )}

          {/* Add Budget Item */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Budget Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Item"
                value={newItem.item}
                onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                placeholder="e.g., Reception hall"
              />
              <Input
                label="Estimated Cost"
                type="number"
                value={newItem.estimated}
                onChange={(e) => setNewItem({ ...newItem, estimated: e.target.value })}
                placeholder="0.00"
              />
              <div className="flex items-end">
                <Button onClick={addBudgetItem} className="flex items-center space-x-2 w-full">
                  <SafeIcon icon={FiPlus} />
                  <span>Add Item</span>
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Input
                label="Notes"
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                placeholder="Additional details..."
              />
            </div>
          </Card>

          {/* Budget Items Table */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estimated</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actual</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Difference</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBudgetItems.map(item => {
                    const difference = item.actual - item.estimated;
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{item.category}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.item}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              item.source === 'program'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {item.source === 'program' ? 'Program' : 'Manual'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          ${item.estimated.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          {item.source === 'program' ? (
                            <span className="text-sm text-gray-900">
                              ${item.actual.toLocaleString()}
                            </span>
                          ) : (
                            <input
                              type="number"
                              value={item.actual}
                              onChange={(e) => updateBudgetItem(item.id, 'actual', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          )}
                        </td>
                        <td
                          className={`py-3 px-4 text-sm font-medium ${
                            difference > 0
                              ? 'text-red-600'
                              : difference < 0
                              ? 'text-green-600'
                              : 'text-gray-900'
                          }`}
                        >
                          ${Math.abs(difference).toLocaleString()}
                          {difference > 0 && ' over'}
                          {difference < 0 && ' under'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {item.source !== 'program' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="small"
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <SafeIcon icon={FiEdit} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="small"
                                  onClick={() => removeBudgetItem(item.id)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <SafeIcon icon={FiTrash2} />
                                </Button>
                              </>
                            )}
                            {item.source === 'program' && (
                              <span className="text-xs text-gray-500">Auto-synced</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DateBudgetChapter;