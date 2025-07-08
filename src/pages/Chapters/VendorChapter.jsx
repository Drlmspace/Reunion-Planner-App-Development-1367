import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTruck, FiPlus, FiCheck, FiClock, FiDollarSign, FiPhone, FiTrendingUp, FiEdit } = FiIcons;

const VendorChapter = () => {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'Elegant Affairs Catering',
      category: 'Catering',
      contact: 'John Doe',
      phone: '555-0123',
      email: 'john@elegant.com',
      status: 'booked',
      cost: 2500,
      notes: 'Confirmed for Saturday dinner',
      budgetSynced: true
    },
    {
      id: 2,
      name: 'Sound & Vision AV',
      category: 'Audio/Visual',
      contact: 'Sarah Smith',
      phone: '555-0456',
      email: 'sarah@soundvision.com',
      status: 'quoted',
      cost: 800,
      notes: 'Includes microphone and projector',
      budgetSynced: false
    },
    {
      id: 3,
      name: 'Bloom Floral Design',
      category: 'Decorations',
      contact: 'Mike Johnson',
      phone: '555-0789',
      email: 'mike@bloom.com',
      status: 'contacted',
      cost: 400,
      notes: 'Centerpieces and entrance arrangements',
      budgetSynced: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showBudgetSyncModal, setShowBudgetSyncModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    category: '',
    contact: '',
    phone: '',
    email: '',
    cost: '',
    notes: ''
  });

  const categories = [
    'Catering',
    'Audio/Visual',
    'Decorations',
    'Photography',
    'Entertainment',
    'Transportation',
    'Venue Services',
    'Security',
    'Cleaning',
    'Other'
  ];

  const statusColors = {
    booked: 'bg-green-100 text-green-800',
    quoted: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-orange-100 text-orange-800'
  };

  const addVendor = () => {
    if (newVendor.name && newVendor.category) {
      setVendors([...vendors, {
        ...newVendor,
        id: Date.now(),
        status: 'contacted',
        cost: parseFloat(newVendor.cost) || 0,
        budgetSynced: false
      }]);
      setNewVendor({
        name: '',
        category: '',
        contact: '',
        phone: '',
        email: '',
        cost: '',
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const updateVendorStatus = (id, status) => {
    setVendors(vendors.map(vendor => 
      vendor.id === id ? { ...vendor, status } : vendor
    ));
  };

  const updateVendorCost = (id, cost) => {
    setVendors(vendors.map(vendor => 
      vendor.id === id ? { ...vendor, cost: parseFloat(cost) || 0, budgetSynced: false } : vendor
    ));
  };

  const removeVendor = (id) => {
    setVendors(vendors.filter(vendor => vendor.id !== id));
  };

  const syncToBudget = () => {
    // In a real app, this would communicate with the budget system
    // For now, we'll just mark all vendors as synced
    setVendors(vendors.map(vendor => ({ ...vendor, budgetSynced: true })));
    setShowBudgetSyncModal(false);
    // Show success message
    alert(`Vendor costs synced to budget! Total: $${unsyncedCost.toLocaleString()}`);
  };

  const totalCost = vendors.reduce((sum, v) => sum + v.cost, 0);
  const bookedCost = vendors.filter(v => v.status === 'booked').reduce((sum, v) => sum + v.cost, 0);
  const quotedCost = vendors.filter(v => v.status === 'quoted').reduce((sum, v) => sum + v.cost, 0);
  const unsyncedCost = vendors.filter(v => !v.budgetSynced).reduce((sum, v) => sum + v.cost, 0);

  // Budget mapping for vendor categories
  const budgetCategoryMapping = {
    'Catering': 'Food & Beverage',
    'Audio/Visual': 'Entertainment',
    'Decorations': 'Decorations',
    'Photography': 'Photography/Video',
    'Entertainment': 'Entertainment',
    'Transportation': 'Transportation',
    'Venue Services': 'Venue',
    'Security': 'Miscellaneous',
    'Cleaning': 'Miscellaneous',
    'Other': 'Miscellaneous'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 10: Vendor Management</h1>
          <p className="text-gray-600 mt-1">
            Coordinate with all service providers and manage vendor relationships.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiTruck} className="text-2xl text-gray-600" />
          <span className="text-sm text-gray-500">Progress: 75%</span>
        </div>
      </div>

      {/* Vendor Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-blue-600">{vendors.length}</div>
          <div className="text-sm text-gray-600">Total Vendors</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {vendors.filter(v => v.status === 'booked').length}
          </div>
          <div className="text-sm text-gray-600">Booked</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-purple-600">${totalCost.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Cost</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-orange-600">${unsyncedCost.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Unsynced to Budget</div>
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
                  You have ${unsyncedCost.toLocaleString()} in vendor costs that are not synced to your budget.
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Vendor Costs to Budget</h3>
            <p className="text-gray-600 mb-6">
              This will add your vendor costs to the main budget according to their categories.
              Total cost to sync: <strong>${unsyncedCost.toLocaleString()}</strong>
            </p>
            <div className="space-y-2 mb-6">
              {vendors.filter(v => !v.budgetSynced).map(vendor => (
                <div key={vendor.id} className="flex justify-between text-sm">
                  <span>{vendor.name} ({vendor.category}):</span>
                  <span>${vendor.cost.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="p-3 mb-4 bg-blue-50 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1">Budget Category Mapping:</p>
              <ul className="space-y-1">
                {Object.entries(
                  vendors.filter(v => !v.budgetSynced).reduce((acc, vendor) => {
                    const budgetCategory = budgetCategoryMapping[vendor.category] || 'Miscellaneous';
                    if (!acc[budgetCategory]) acc[budgetCategory] = 0;
                    acc[budgetCategory] += vendor.cost;
                    return acc;
                  }, {})
                ).map(([category, amount]) => (
                  <li key={category}>• {category}: ${amount.toLocaleString()}</li>
                ))}
              </ul>
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

      {/* Add Vendor Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Vendor</h2>
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Vendor Name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newVendor.category}
                  onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Contact Person"
                value={newVendor.contact}
                onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
              />
              <Input
                label="Phone"
                type="tel"
                value={newVendor.phone}
                onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
              />
              <Input
                label="Estimated Cost"
                type="number"
                value={newVendor.cost}
                onChange={(e) => setNewVendor({ ...newVendor, cost: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="mt-6">
              <Input
                label="Notes"
                value={newVendor.notes}
                onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                placeholder="Additional details, requirements, etc."
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={addVendor}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} />
                <span>Add Vendor</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Vendor List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Vendor Directory</h2>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Vendor</span>
          </Button>
        </div>
        <div className="space-y-4">
          {vendors.map(vendor => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vendor.status]}`}>
                      {vendor.status}
                    </span>
                    {vendor.budgetSynced && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Budget Synced
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Category:</span> {vendor.category}
                    </div>
                    <div>
                      <span className="font-medium">Contact:</span> {vendor.contact}
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiPhone} />
                      <span>{vendor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiDollarSign} />
                      <input
                        type="number"
                        value={vendor.cost}
                        onChange={(e) => updateVendorCost(vendor.id, e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {vendor.email}
                  </div>
                  {vendor.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {vendor.notes}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="flex space-x-1">
                    <Button
                      variant={vendor.status === 'contacted' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => updateVendorStatus(vendor.id, 'contacted')}
                    >
                      Contacted
                    </Button>
                    <Button
                      variant={vendor.status === 'quoted' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => updateVendorStatus(vendor.id, 'quoted')}
                    >
                      Quoted
                    </Button>
                    <Button
                      variant={vendor.status === 'booked' ? 'success' : 'outline'}
                      size="small"
                      onClick={() => updateVendorStatus(vendor.id, 'booked')}
                    >
                      Booked
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Vendor Categories */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Vendor Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(category => {
            const categoryVendors = vendors.filter(v => v.category === category);
            return (
              <div key={category} className="p-3 border rounded-lg text-center">
                <h3 className="font-medium text-gray-900 text-sm mb-1">{category}</h3>
                <div className="text-2xl font-bold text-blue-600">{categoryVendors.length}</div>
                <div className="text-xs text-gray-500">vendors</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default VendorChapter;