import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useReunion } from '../../contexts/ReunionContext';

const { FiClock, FiPlus, FiEdit, FiTrash2, FiUser, FiMove, FiDollarSign, FiTrendingUp, FiCalendar, FiDownload } = FiIcons;

const ProgramChapter = () => {
  const { currentReunion } = useReunion();
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState('');
  
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Registration & Welcome',
      date: '2024-07-15',
      startTime: '10:00',
      endTime: '10:30',
      duration: 30,
      description: 'Check-in and welcome refreshments',
      owner: 'Sarah Johnson',
      tags: ['logistics', 'welcome'],
      location: 'Main Entrance',
      cost: 150,
      category: 'Entertainment'
    },
    {
      id: 2,
      title: 'Opening Ceremony',
      date: '2024-07-15',
      startTime: '10:30',
      endTime: '11:00',
      duration: 30,
      description: 'Welcome speech and group photo',
      owner: 'John Smith',
      tags: ['ceremony', 'memory'],
      location: 'Main Hall',
      cost: 0,
      category: 'Entertainment'
    },
    {
      id: 3,
      title: 'Lunch & Mingling',
      date: '2024-07-15',
      startTime: '12:00',
      endTime: '13:30',
      duration: 90,
      description: 'Buffet lunch with open networking',
      owner: 'Mike Davis',
      tags: ['food', 'networking'],
      location: 'Dining Room',
      cost: 1200,
      category: 'Food & Beverage'
    },
    {
      id: 4,
      title: 'Evening Banquet',
      date: '2024-07-16',
      startTime: '18:00',
      endTime: '22:00',
      duration: 240,
      description: 'Formal dinner and awards ceremony',
      owner: 'Lisa Wilson',
      tags: ['food', 'ceremony'],
      location: 'Grand Ballroom',
      cost: 2500,
      category: 'Food & Beverage'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showBudgetSync, setShowBudgetSync] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    owner: '',
    tags: [],
    location: '',
    cost: '',
    category: ''
  });

  // Budget categories that match the Date & Budget chapter
  const budgetCategories = [
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

  const eventTags = [
    'food', 'speech', 'fun', 'memory', 'logistics', 'ceremony', 
    'networking', 'entertainment', 'awards', 'presentation'
  ];

  const tagColors = {
    food: 'bg-orange-100 text-orange-800',
    speech: 'bg-blue-100 text-blue-800',
    fun: 'bg-green-100 text-green-800',
    memory: 'bg-purple-100 text-purple-800',
    logistics: 'bg-gray-100 text-gray-800',
    ceremony: 'bg-red-100 text-red-800',
    networking: 'bg-yellow-100 text-yellow-800',
    entertainment: 'bg-pink-100 text-pink-800',
    awards: 'bg-indigo-100 text-indigo-800',
    presentation: 'bg-teal-100 text-teal-800'
  };

  // Calculate total costs by category
  const costSummary = budgetCategories.map(category => {
    const categoryEvents = events.filter(event => event.category === category);
    const totalCost = categoryEvents.reduce((sum, event) => sum + (event.cost || 0), 0);
    return {
      category,
      cost: totalCost,
      eventCount: categoryEvents.length
    };
  }).filter(item => item.cost > 0 || item.eventCount > 0);

  const totalProgramCost = events.reduce((sum, event) => sum + (event.cost || 0), 0);

  // Get unique dates from events
  const eventDates = [...new Set(events.map(event => event.date))].sort();

  // Filter events by selected date
  const filteredEvents = selectedDate 
    ? events.filter(event => event.date === selectedDate)
    : events;

  const calculateDuration = (start, end) => {
    const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
    const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
    return endMinutes - startMinutes;
  };

  const addEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.startTime && newEvent.endTime) {
      const duration = calculateDuration(newEvent.startTime, newEvent.endTime);
      setEvents([...events, {
        ...newEvent,
        id: Date.now(),
        duration,
        cost: parseFloat(newEvent.cost) || 0
      }]);
      setNewEvent({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        description: '',
        owner: '',
        tags: [],
        location: '',
        cost: '',
        category: ''
      });
      setShowAddForm(false);
    }
  };

  const removeEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const updateEventCost = (id, cost) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, cost: parseFloat(cost) || 0 } : event
    ));
  };

  const toggleTag = (tag) => {
    setNewEvent({
      ...newEvent,
      tags: newEvent.tags.includes(tag)
        ? newEvent.tags.filter(t => t !== tag)
        : [...newEvent.tags, tag]
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const syncToBudget = () => {
    // This would sync the program costs to the budget chapter
    console.log('Syncing program costs to budget:', costSummary);
    setShowBudgetSync(false);
    alert(`Program costs synced to budget! Total: $${totalProgramCost.toLocaleString()}`);
  };
  
  const exportScheduleToPdf = async () => {
    try {
      // Dynamic import to avoid build issues
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Add title with reunion name
      doc.setFontSize(18);
      doc.text(`${currentReunion?.title || 'Reunion'} - Event Schedule`, 14, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      if (selectedDate) {
        doc.text(`Showing events for: ${new Date(selectedDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`, 14, 40);
        
        // Events for selected date
        exportEventsForDate(doc, selectedDate, 50);
      } else {
        // Group events by date
        let yPosition = 40;
        
        eventDates.forEach(date => {
          // Check if we need a new page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(14);
          doc.text(`Events for ${new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}`, 14, yPosition);
          
          yPosition += 10;
          yPosition = exportEventsForDate(doc, date, yPosition);
          yPosition += 15; // Add spacing between dates
        });
      }
      
      // Save the PDF
      doc.save(`${currentReunion?.title || 'reunion'}_schedule.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Unable to generate PDF. Please try again.');
    }
  };
  
  const exportEventsForDate = (doc, date, startY) => {
    const dateEvents = events
      .filter(event => event.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    // Create table data for this date
    const tableData = dateEvents.map(event => [
      event.title,
      `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`,
      event.location,
      event.description,
      event.tags.join(', '),
      event.cost > 0 ? `$${event.cost}` : 'Free'
    ]);
    
    doc.autoTable({
      startY: startY,
      head: [['Event', 'Time', 'Location', 'Description', 'Tags', 'Cost']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 135, 245] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 }
      },
      styles: { overflow: 'linebreak' },
      margin: { top: 10 }
    });
    
    // Return the final Y position for the next content
    return doc.lastAutoTable.finalY;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 5: Program Builder</h1>
          <p className="text-gray-600 mt-1">
            Create and organize your reunion schedule with detailed event planning and cost tracking.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiClock} className="text-2xl text-orange-600" />
          <span className="text-sm text-gray-500">Progress: 45%</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'schedule', label: 'Event Schedule', icon: FiClock },
          { id: 'budget', label: 'Budget Summary', icon: FiDollarSign }
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
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Program Summary */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.reduce((sum, event) => sum + event.duration, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Minutes</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.tags.includes('food')).length}
              </div>
              <div className="text-sm text-gray-600">Food Events</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {eventDates.length}
              </div>
              <div className="text-sm text-gray-600">Event Days</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-emerald-600">${totalProgramCost.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Cost</div>
            </Card>
          </div>

          {/* Date Filter */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filter by Date</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Days</option>
                  {eventDates.map(date => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </option>
                  ))}
                </select>
                <Button onClick={exportScheduleToPdf} className="flex items-center space-x-2">
                  <SafeIcon icon={FiDownload} />
                  <span>Export PDF</span>
                </Button>
                <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
                  <SafeIcon icon={FiPlus} />
                  <span>Add Event</span>
                </Button>
              </div>
            </div>
            
            {eventDates.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {eventDates.map(date => {
                  const dayEvents = events.filter(e => e.date === date);
                  return (
                    <div key={date} className="p-3 border rounded-lg text-center">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-lg font-bold text-blue-600">{dayEvents.length}</div>
                      <div className="text-xs text-gray-500">events</div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Add Event Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Event</h2>
                  <Button variant="ghost" size="small" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Event Title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                  <Input
                    label="Location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Where will this take place?"
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                  <Input
                    label="Event Owner"
                    value={newEvent.owner}
                    onChange={(e) => setNewEvent({ ...newEvent, owner: e.target.value })}
                    placeholder="Who is responsible for this event?"
                  />
                  <Input
                    label="Start Time"
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    required
                  />
                  <Input
                    label="End Time"
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    required
                  />
                  <Input
                    label="Estimated Cost"
                    type="number"
                    value={newEvent.cost}
                    onChange={(e) => setNewEvent({ ...newEvent, cost: e.target.value })}
                    placeholder="0.00"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Category
                    </label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select category</option>
                      {budgetCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Describe the event..."
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Event Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {eventTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          newEvent.tags.includes(tag)
                            ? tagColors[tag]
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addEvent} className="flex items-center space-x-2">
                    <SafeIcon icon={FiPlus} />
                    <span>Add Event</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Schedule Timeline */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Event Schedule
                {selectedDate && (
                  <span className="text-base font-normal text-gray-600 ml-2">
                    - {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                )}
              </h2>
              <div className="text-sm text-gray-500">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredEvents
                .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
                .map(event => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {formatTime(event.startTime)} - {formatTime(event.endTime)} ({event.duration} min)
                        </span>
                        {event.cost > 0 && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                            ${event.cost.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiUser} />
                          <span>{event.owner || 'Unassigned'}</span>
                        </div>
                        <span>📍 {event.location}</span>
                        {event.category && <span>💼 {event.category}</span>}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {event.tags.map(tag => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs rounded-full ${tagColors[tag]}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiDollarSign} className="text-emerald-600" />
                          <input
                            type="number"
                            value={event.cost || ''}
                            onChange={(e) => updateEventCost(event.id, e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
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
                        onClick={() => removeEvent(event.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Budget Summary Tab */}
      {activeTab === 'budget' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Budget Integration */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <SafeIcon icon={FiDollarSign} className="text-emerald-600" />
                <span>Program Budget Summary</span>
              </h2>
              <Button
                onClick={() => setShowBudgetSync(true)}
                className="flex items-center space-x-2"
                variant="outline"
              >
                <SafeIcon icon={FiTrendingUp} />
                <span>Sync to Budget</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {costSummary.map(item => (
                <div key={item.category} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{item.category}</h3>
                    <span className="text-lg font-bold text-emerald-600">
                      ${item.cost.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.eventCount} event{item.eventCount !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
            
            {costSummary.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No events with costs have been added yet.
              </div>
            )}
          </Card>

          {/* Budget Sync Modal */}
          {showBudgetSync && (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Program Costs to Budget</h3>
                <p className="text-gray-600 mb-6">
                  This will add your program event costs to the main budget as individual line items. 
                  Total cost to sync: <strong>${totalProgramCost.toLocaleString()}</strong>
                </p>
                <div className="space-y-2 mb-6">
                  {costSummary.map(item => (
                    <div key={item.category} className="flex justify-between text-sm">
                      <span>{item.category}:</span>
                      <span>${item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowBudgetSync(false)}
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
        </motion.div>
      )}
    </div>
  );
};

export default ProgramChapter;