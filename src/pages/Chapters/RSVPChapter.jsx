import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUserCheck, FiUsers, FiCheck, FiX, FiClock } = FiIcons;

const RSVPChapter = () => {
  const [rsvps, setRsvps] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', status: 'confirmed', guests: 2, dietary: 'Vegetarian', notes: 'Excited to attend!' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'declined', guests: 0, dietary: '', notes: 'Will be out of town' },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', status: 'pending', guests: 1, dietary: 'None', notes: '' }
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    dietary: 'all'
  });

  const stats = {
    total: rsvps.length,
    confirmed: rsvps.filter(r => r.status === 'confirmed').length,
    declined: rsvps.filter(r => r.status === 'declined').length,
    pending: rsvps.filter(r => r.status === 'pending').length,
    totalGuests: rsvps.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.guests, 0)
  };

  const filteredRsvps = rsvps.filter(rsvp => {
    if (filters.status !== 'all' && rsvp.status !== filters.status) return false;
    if (filters.dietary !== 'all' && rsvp.dietary !== filters.dietary) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 7: RSVP Management</h1>
          <p className="text-gray-600 mt-1">
            Track responses and manage attendee information for your reunion.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiUserCheck} className="text-2xl text-indigo-600" />
          <span className="text-sm text-gray-500">Progress: 65%</span>
        </div>
      </div>

      {/* RSVP Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Invited</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
          <div className="text-sm text-gray-600">Declined</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalGuests}</div>
          <div className="text-sm text-gray-600">Total Guests</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
            <select
              value={filters.dietary}
              onChange={(e) => setFilters({...filters, dietary: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Dietary</option>
              <option value="None">None</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => setFilters({status: 'all', dietary: 'all'})}
              variant="outline"
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* RSVP List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">RSVP Responses</h2>
          <div className="text-sm text-gray-500">
            Showing {filteredRsvps.length} of {stats.total} responses
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Guests</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Dietary</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Notes</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRsvps.map(rsvp => (
                <tr key={rsvp.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{rsvp.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{rsvp.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rsvp.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      rsvp.status === 'declined' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      <SafeIcon 
                        icon={rsvp.status === 'confirmed' ? FiCheck : rsvp.status === 'declined' ? FiX : FiClock} 
                        className="mr-1 text-xs"
                      />
                      {rsvp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{rsvp.guests}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{rsvp.dietary || 'None'}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                    {rsvp.notes || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="small">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Response Rate Chart */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Response Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Confirmed</span>
            <span className="text-sm text-gray-600">{stats.confirmed} ({Math.round((stats.confirmed / stats.total) * 100)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${(stats.confirmed / stats.total) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Declined</span>
            <span className="text-sm text-gray-600">{stats.declined} ({Math.round((stats.declined / stats.total) * 100)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full" 
              style={{ width: `${(stats.declined / stats.total) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Pending</span>
            <span className="text-sm text-gray-600">{stats.pending} ({Math.round((stats.pending / stats.total) * 100)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full" 
              style={{ width: `${(stats.pending / stats.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RSVPChapter;