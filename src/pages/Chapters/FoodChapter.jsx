import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiCoffee, FiPlus, FiCheck, FiClock, FiDollarSign, FiSave, FiTrendingUp, FiEdit, FiTrash2, FiAlertTriangle } = FiIcons;

const FoodChapter = () => {
  const [activeTab, setActiveTab] = useState('meals');
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: 'Welcome Breakfast',
      time: '9:00 AM',
      date: '2024-07-15',
      type: 'Catered',
      vendor: 'Sunrise Catering',
      cost: 800,
      status: 'confirmed',
      budgetSynced: true,
      programLinked: true,
      attendees: 85
    },
    {
      id: 2,
      name: 'Lunch Buffet',
      time: '12:30 PM',
      date: '2024-07-15',
      type: 'Catered',
      vendor: 'Main Street Deli',
      cost: 1200,
      status: 'pending',
      budgetSynced: false,
      programLinked: true,
      attendees: 100
    },
    {
      id: 3,
      name: 'Evening Banquet',
      time: '6:00 PM',
      date: '2024-07-16',
      type: 'Catered',
      vendor: 'Elegant Affairs',
      cost: 2500,
      status: 'confirmed',
      budgetSynced: true,
      programLinked: false,
      attendees: 95
    }
  ]);

  const [dietary, setDietary] = useState([
    { restriction: 'Vegetarian', count: 8, notes: 'No meat or fish' },
    { restriction: 'Vegan', count: 3, notes: 'No animal products' },
    { restriction: 'Gluten-Free', count: 5, notes: 'Celiac disease' },
    { restriction: 'Nut Allergy', count: 2, notes: 'Severe allergy' }
  ]);

  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [showBudgetSyncModal, setShowBudgetSyncModal] = useState(false);
  const [showOverlapWarning, setShowOverlapWarning] = useState(false);
  
  const [newMeal, setNewMeal] = useState({
    name: '',
    time: '',
    date: '',
    type: 'Catered',
    vendor: '',
    cost: '',
    notes: '',
    attendees: ''
  });

  // Mock program events for overlap detection
  const programEvents = [
    { id: 1, title: 'Lunch & Mingling', date: '2024-07-15', startTime: '12:00', endTime: '13:30', tags: ['food'] },
    { id: 2, title: 'Welcome Breakfast Event', date: '2024-07-15', startTime: '09:00', endTime: '10:00', tags: ['food'] }
  ];

  const totalCost = meals.reduce((sum, meal) => sum + meal.cost, 0);
  const syncedCost = meals.filter(m => m.budgetSynced).reduce((sum, m) => sum + m.cost, 0);
  const unsyncedCost = meals.filter(m => !m.budgetSynced).reduce((sum, m) => sum + m.cost, 0);
  const programLinkedMeals = meals.filter(m => m.programLinked).length;

  // Check for overlaps with program events
  const checkForOverlaps = (newMealData) => {
    const newMealTime = new Date(`${newMealData.date} ${newMealData.time}`);
    const overlaps = programEvents.filter(event => {
      if (event.date !== newMealData.date) return false;
      if (!event.tags.includes('food')) return false;
      
      const eventStart = new Date(`${event.date} ${event.startTime}`);
      const eventEnd = new Date(`${event.date} ${event.endTime}`);
      
      return newMealTime >= eventStart && newMealTime <= eventEnd;
    });
    
    return overlaps;
  };

  const addMeal = () => {
    if (newMeal.name && newMeal.cost && newMeal.date && newMeal.time) {
      const overlaps = checkForOverlaps(newMeal);
      
      if (overlaps.length > 0) {
        setShowOverlapWarning(true);
        toast.warning(`This meal overlaps with program event: ${overlaps[0].title}`, {
          duration: 4000
        });
        return;
      }

      setMeals([...meals, {
        ...newMeal,
        id: Date.now(),
        cost: parseFloat(newMeal.cost) || 0,
        attendees: parseInt(newMeal.attendees) || 0,
        status: 'pending',
        budgetSynced: false,
        programLinked: false
      }]);
      
      setNewMeal({
        name: '',
        time: '',
        date: '',
        type: 'Catered',
        vendor: '',
        cost: '',
        notes: '',
        attendees: ''
      });
      setShowAddMealForm(false);
      setShowOverlapWarning(false);
    }
  };

  const updateMealStatus = (id, status) => {
    setMeals(meals.map(meal => 
      meal.id === id ? { ...meal, status } : meal
    ));
    
    if (status === 'confirmed') {
      toast.success('Meal confirmed successfully!');
    }
  };

  const updateMealCost = (id, cost) => {
    setMeals(meals.map(meal => 
      meal.id === id ? { ...meal, cost: parseFloat(cost) || 0, budgetSynced: false } : meal
    ));
  };

  const removeMeal = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const syncToBudget = () => {
    setMeals(meals.map(meal => ({ ...meal, budgetSynced: true })));
    setShowBudgetSyncModal(false);
    toast.success(`Food & Beverage costs synced to budget! Total: $${totalCost.toLocaleString()}`);
  };

  const getMealsByDate = () => {
    const grouped = meals.reduce((acc, meal) => {
      const date = meal.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(meal);
      return acc;
    }, {});
    
    // Sort meals by time within each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.time.localeCompare(b.time));
    });
    
    return grouped;
  };

  const mealsByDate = getMealsByDate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 9: Food & Beverage</h1>
          <p className="text-gray-600 mt-1">
            Plan menus, coordinate catering, and manage dietary requirements.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiCoffee} className="text-2xl text-yellow-600" />
          <span className="text-sm text-gray-500">Progress: 70%</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'meals', label: 'Meal Planning' },
          { id: 'dietary', label: 'Dietary Restrictions' },
          { id: 'vendors', label: 'Catering Vendors' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Meal Planning Tab */}
      {activeTab === 'meals' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-blue-600">{meals.length}</div>
              <div className="text-sm text-gray-600">Planned Meals</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {meals.filter(m => m.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-purple-600">${totalCost.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Cost</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-orange-600">${unsyncedCost.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Unsynced to Budget</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{programLinkedMeals}</div>
              <div className="text-sm text-gray-600">Program Linked</div>
            </Card>
          </div>

          {/* Budget Integration Card */}
          {unsyncedCost > 0 && (
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiDollarSign} className="text-xl text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Budget Integration</h3>
                    <p className="text-sm text-gray-600">
                      You have ${unsyncedCost.toLocaleString()} in food costs that are not synced to your budget.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowBudgetSyncModal(true)}
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={FiTrendingUp} />
                  <span>Sync to Budget</span>
                </Button>
              </div>
            </Card>
          )}

          {/* Program Integration Warning */}
          {showOverlapWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiAlertTriangle} className="text-yellow-600" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Program Overlap Detected</h3>
                  <p className="text-sm text-yellow-700">
                    This meal time conflicts with an existing program event. Consider adjusting the time or linking it to the program event.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Budget Sync Modal */}
          {showBudgetSyncModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Food Costs to Budget</h3>
                <p className="text-gray-600 mb-6">
                  This will add your food & beverage costs to the main budget as individual line items under the "Food & Beverage" category. 
                  Total cost to sync: <strong>${unsyncedCost.toLocaleString()}</strong>
                </p>
                <div className="space-y-2 mb-6">
                  {meals.filter(m => !m.budgetSynced).map(meal => (
                    <div key={meal.id} className="flex justify-between text-sm">
                      <span>{meal.name}:</span>
                      <span>${meal.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowBudgetSyncModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={syncToBudget} className="flex-1">
                    Sync to Budget
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Add Meal Form */}
          {showAddMealForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Meal</h2>
                  <Button variant="ghost" size="small" onClick={() => setShowAddMealForm(false)}>
                    Cancel
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Meal Name"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    placeholder="e.g., Welcome Dinner"
                    required
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={newMeal.date}
                    onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                    required
                  />
                  <Input
                    label="Time"
                    type="time"
                    value={newMeal.time}
                    onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={newMeal.type}
                      onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="Catered">Catered</option>
                      <option value="Buffet">Buffet</option>
                      <option value="Plated">Plated</option>
                      <option value="Family Style">Family Style</option>
                      <option value="Potluck">Potluck</option>
                    </select>
                  </div>
                  <Input
                    label="Vendor"
                    value={newMeal.vendor}
                    onChange={(e) => setNewMeal({ ...newMeal, vendor: e.target.value })}
                    placeholder="e.g., Elegant Affairs Catering"
                  />
                  <Input
                    label="Estimated Cost"
                    type="number"
                    value={newMeal.cost}
                    onChange={(e) => setNewMeal({ ...newMeal, cost: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                  <Input
                    label="Expected Attendees"
                    type="number"
                    value={newMeal.attendees}
                    onChange={(e) => setNewMeal({ ...newMeal, attendees: e.target.value })}
                    placeholder="Number of people"
                  />
                  <Input
                    label="Notes"
                    value={newMeal.notes}
                    onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                    placeholder="Additional details..."
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowAddMealForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addMeal} className="flex items-center space-x-2">
                    <SafeIcon icon={FiPlus} />
                    <span>Add Meal</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Meal Schedule by Date */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Meal Schedule</h2>
              <Button onClick={() => setShowAddMealForm(true)} className="flex items-center space-x-2">
                <SafeIcon icon={FiPlus} />
                <span>Add Meal</span>
              </Button>
            </div>
            
            <div className="space-y-6">
              {Object.keys(mealsByDate).sort().map(date => (
                <div key={date} className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  
                  <div className="space-y-4">
                    {mealsByDate[date].map(meal => (
                      <div
                        key={meal.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-gray-900">{meal.name}</h4>
                              <span className="text-sm text-gray-600">{meal.time}</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  meal.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800'
                                    : meal.status === 'pending'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                <SafeIcon
                                  icon={meal.status === 'confirmed' ? FiCheck : FiClock}
                                  className="mr-1"
                                />
                                {meal.status}
                              </span>
                              {meal.budgetSynced && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Budget Synced
                                </span>
                              )}
                              {meal.programLinked && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                  Program Linked
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Type:</span> {meal.type}
                              </div>
                              <div>
                                <span className="font-medium">Vendor:</span> {meal.vendor}
                              </div>
                              <div>
                                <span className="font-medium">Attendees:</span> {meal.attendees}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">Cost:</span>
                                <div className="flex items-center">
                                  <span className="text-green-600">$</span>
                                  <input
                                    type="number"
                                    value={meal.cost}
                                    onChange={(e) => updateMealCost(meal.id, e.target.value)}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <div className="flex space-x-1">
                              <Button
                                variant={meal.status === 'pending' ? 'primary' : 'outline'}
                                size="small"
                                onClick={() => updateMealStatus(meal.id, 'pending')}
                              >
                                Pending
                              </Button>
                              <Button
                                variant={meal.status === 'confirmed' ? 'success' : 'outline'}
                                size="small"
                                onClick={() => updateMealStatus(meal.id, 'confirmed')}
                              >
                                Confirmed
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => removeMeal(meal.id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <SafeIcon icon={FiTrash2} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Dietary Restrictions Tab */}
      {activeTab === 'dietary' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Dietary Restrictions Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dietary.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{item.restriction}</h3>
                    <span className="text-2xl font-bold text-blue-600">{item.count}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.notes}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Special Menu Requirements</h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Vegetarian Options</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Ensure all meals have substantial vegetarian protein options</li>
                  <li>• Label all vegetarian dishes clearly</li>
                  <li>• Consider separate serving utensils to avoid cross-contamination</li>
                </ul>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">Allergy Considerations</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Nut-free preparation areas required</li>
                  <li>• All ingredients must be clearly labeled</li>
                  <li>• Have emergency contact info for severe allergies</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Gluten-Free Requirements</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Separate preparation to avoid cross-contamination</li>
                  <li>• Certified gluten-free ingredients only</li>
                  <li>• Dedicated serving utensils and plates</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Catering Vendors</h2>
              <Button className="flex items-center space-x-2">
                <SafeIcon icon={FiPlus} />
                <span>Add Vendor</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Sunrise Catering',
                  specialty: 'Breakfast & Brunch',
                  rating: 4.8,
                  phone: '555-0123',
                  email: 'info@sunrise.com'
                },
                {
                  name: 'Main Street Deli',
                  specialty: 'Lunch & Sandwiches',
                  rating: 4.5,
                  phone: '555-0456',
                  email: 'orders@mainst.com'
                },
                {
                  name: 'Elegant Affairs',
                  specialty: 'Fine Dining',
                  rating: 4.9,
                  phone: '555-0789',
                  email: 'events@elegant.com'
                }
              ].map((vendor, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{vendor.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{vendor.specialty}</p>
                  <div className="flex items-center space-x-1 mb-3">
                    <span className="text-sm font-medium text-gray-700">Rating:</span>
                    <span className="text-sm text-yellow-600">★ {vendor.rating}</span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600 mb-4">
                    <div>📞 {vendor.phone}</div>
                    <div>✉️ {vendor.email}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="small" className="flex-1">
                      Contact
                    </Button>
                    <Button size="small" className="flex-1">
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default FoodChapter;