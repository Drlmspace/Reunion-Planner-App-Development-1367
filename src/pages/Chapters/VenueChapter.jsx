import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMapPin, FiPlus, FiStar, FiCheck, FiX, FiEdit, FiTrash2, FiDownload } = FiIcons;

const VenueChapter = () => {
  const [venues, setVenues] = useState([
    {
      id: 1,
      name: 'Grand Ballroom Hotel',
      address: '123 Main St, Downtown',
      capacity: 200,
      cost: 2500,
      pros: ['Central location', 'Parking available', 'Full catering'],
      cons: ['Expensive', 'Limited decoration options'],
      rating: 4,
      status: 'considering',
      contact: 'events@grandballroom.com',
      phone: '555-0123'
    },
    {
      id: 2,
      name: 'Community Center',
      address: '456 Oak Ave, Suburb',
      capacity: 150,
      cost: 800,
      pros: ['Affordable', 'Flexible setup', 'Kitchen access'],
      cons: ['Basic amenities', 'Need own catering'],
      rating: 3,
      status: 'visited',
      contact: 'info@communitycenter.org',
      phone: '555-0456'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVenue, setNewVenue] = useState({
    name: '',
    address: '',
    capacity: '',
    cost: '',
    contact: '',
    phone: '',
    pros: [],
    cons: [],
    rating: 0
  });
  
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  
  // For editing existing venues
  const [editingVenue, setEditingVenue] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editPro, setEditPro] = useState('');
  const [editCon, setEditCon] = useState('');
  
  const addVenue = () => {
    if (newVenue.name && newVenue.address) {
      setVenues([...venues, {
        ...newVenue,
        id: Date.now(),
        capacity: parseInt(newVenue.capacity) || 0,
        cost: parseFloat(newVenue.cost) || 0,
        status: 'considering'
      }]);
      setNewVenue({
        name: '',
        address: '',
        capacity: '',
        cost: '',
        contact: '',
        phone: '',
        pros: [],
        cons: [],
        rating: 0
      });
      setNewPro('');
      setNewCon('');
      setShowAddForm(false);
    }
  };

  const updateVenueStatus = (id, status) => {
    setVenues(venues.map(venue => 
      venue.id === id ? { ...venue, status } : venue
    ));
  };

  const removeVenue = (id) => {
    setVenues(venues.filter(venue => venue.id !== id));
  };
  
  const addNewPro = () => {
    if (newPro.trim()) {
      setNewVenue({
        ...newVenue,
        pros: [...newVenue.pros, newPro.trim()]
      });
      setNewPro('');
    }
  };
  
  const removePro = (index) => {
    setNewVenue({
      ...newVenue,
      pros: newVenue.pros.filter((_, i) => i !== index)
    });
  };
  
  const addNewCon = () => {
    if (newCon.trim()) {
      setNewVenue({
        ...newVenue,
        cons: [...newVenue.cons, newCon.trim()]
      });
      setNewCon('');
    }
  };
  
  const removeCon = (index) => {
    setNewVenue({
      ...newVenue,
      cons: newVenue.cons.filter((_, i) => i !== index)
    });
  };
  
  // Functions for editing existing venues
  const startEditVenue = (venue) => {
    setEditingVenue(venue);
    setShowEditForm(true);
  };
  
  const addProToExistingVenue = () => {
    if (editPro.trim() && editingVenue) {
      const updatedVenue = {
        ...editingVenue,
        pros: [...editingVenue.pros, editPro.trim()]
      };
      setEditingVenue(updatedVenue);
      setEditPro('');
      
      // Update the venue in the venues array
      setVenues(venues.map(v => 
        v.id === updatedVenue.id ? updatedVenue : v
      ));
    }
  };
  
  const removeProFromExistingVenue = (index) => {
    if (editingVenue) {
      const updatedVenue = {
        ...editingVenue,
        pros: editingVenue.pros.filter((_, i) => i !== index)
      };
      setEditingVenue(updatedVenue);
      
      // Update the venue in the venues array
      setVenues(venues.map(v => 
        v.id === updatedVenue.id ? updatedVenue : v
      ));
    }
  };
  
  const addConToExistingVenue = () => {
    if (editCon.trim() && editingVenue) {
      const updatedVenue = {
        ...editingVenue,
        cons: [...editingVenue.cons, editCon.trim()]
      };
      setEditingVenue(updatedVenue);
      setEditCon('');
      
      // Update the venue in the venues array
      setVenues(venues.map(v => 
        v.id === updatedVenue.id ? updatedVenue : v
      ));
    }
  };
  
  const removeConFromExistingVenue = (index) => {
    if (editingVenue) {
      const updatedVenue = {
        ...editingVenue,
        cons: editingVenue.cons.filter((_, i) => i !== index)
      };
      setEditingVenue(updatedVenue);
      
      // Update the venue in the venues array
      setVenues(venues.map(v => 
        v.id === updatedVenue.id ? updatedVenue : v
      ));
    }
  };
  
  const closeEditForm = () => {
    setEditingVenue(null);
    setShowEditForm(false);
    setEditPro('');
    setEditCon('');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <SafeIcon 
        key={i} 
        icon={FiStar} 
        className={`text-sm ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };
  
  const handleRatingChange = (rating) => {
    setNewVenue({...newVenue, rating});
  };
  
  const exportVenuesToPdf = async () => {
    try {
      // Dynamic import to avoid build issues
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Venue Options Report', 14, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Create venue table data
      const tableData = venues.map(venue => [
        venue.name,
        venue.status.charAt(0).toUpperCase() + venue.status.slice(1),
        venue.address,
        `$${venue.cost.toLocaleString()}`,
        venue.capacity.toString(),
        venue.rating.toString() + '/5'
      ]);
      
      // Add venues table
      doc.autoTable({
        startY: 40,
        head: [['Name', 'Status', 'Address', 'Cost', 'Capacity', 'Rating']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [66, 135, 245] }
      });
      
      // Add detailed venue information
      let currentY = doc.lastAutoTable.finalY + 15;
      
      venues.forEach(venue => {
        // Check if we need a new page
        if (currentY > 260) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFontSize(14);
        doc.text(`${venue.name} Details:`, 14, currentY);
        currentY += 8;
        
        doc.setFontSize(10);
        
        // Pros
        doc.setTextColor(34, 139, 34); // Green color
        doc.text("Pros:", 14, currentY);
        currentY += 5;
        
        venue.pros.forEach(pro => {
          doc.text(`• ${pro}`, 20, currentY);
          currentY += 5;
        });
        
        currentY += 3;
        
        // Cons
        doc.setTextColor(220, 20, 60); // Red color
        doc.text("Cons:", 14, currentY);
        currentY += 5;
        
        venue.cons.forEach(con => {
          doc.text(`• ${con}`, 20, currentY);
          currentY += 5;
        });
        
        doc.setTextColor(0, 0, 0); // Reset to black
        currentY += 8;
      });
      
      // Save the PDF
      doc.save('venue_options.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Unable to generate PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 4: Venue Planning</h1>
          <p className="text-gray-600 mt-1">
            Research, evaluate, and select the perfect venue for your reunion.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiMapPin} className="text-2xl text-red-600" />
          <span className="text-sm text-gray-500">Progress: 35%</span>
        </div>
      </div>

      {/* Venue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-blue-600">{venues.length}</div>
          <div className="text-sm text-gray-600">Total Venues</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {venues.filter(v => v.status === 'considering').length}
          </div>
          <div className="text-sm text-gray-600">Considering</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {venues.filter(v => v.status === 'visited').length}
          </div>
          <div className="text-sm text-gray-600">Visited</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {venues.filter(v => v.status === 'booked').length}
          </div>
          <div className="text-sm text-gray-600">Booked</div>
        </Card>
      </div>

      {/* Add Venue Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Venue</h2>
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
                label="Venue Name"
                value={newVenue.name}
                onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                required
              />
              <Input
                label="Address"
                value={newVenue.address}
                onChange={(e) => setNewVenue({ ...newVenue, address: e.target.value })}
                required
              />
              <Input
                label="Capacity"
                type="number"
                value={newVenue.capacity}
                onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })}
                placeholder="Number of guests"
              />
              <Input
                label="Cost"
                type="number"
                value={newVenue.cost}
                onChange={(e) => setNewVenue({ ...newVenue, cost: e.target.value })}
                placeholder="Total cost"
              />
              <Input
                label="Contact Email"
                type="email"
                value={newVenue.contact}
                onChange={(e) => setNewVenue({ ...newVenue, contact: e.target.value })}
              />
              <Input
                label="Phone"
                type="tel"
                value={newVenue.phone}
                onChange={(e) => setNewVenue({ ...newVenue, phone: e.target.value })}
              />
              
              {/* Rating selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <SafeIcon
                        icon={FiStar}
                        className={`text-2xl ${
                          star <= newVenue.rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Pros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pros
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={newPro}
                    onChange={(e) => setNewPro(e.target.value)}
                    placeholder="Add a pro"
                    className="flex-1"
                  />
                  <Button onClick={addNewPro}>Add</Button>
                </div>
                <div className="mt-3 space-y-2">
                  {newVenue.pros.map((pro, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-green-50 p-2 rounded">
                      <span className="flex-1">{pro}</span>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => removePro(index)}
                        className="text-red-500"
                      >
                        <SafeIcon icon={FiX} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Cons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cons
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={newCon}
                    onChange={(e) => setNewCon(e.target.value)}
                    placeholder="Add a con"
                    className="flex-1"
                  />
                  <Button onClick={addNewCon}>Add</Button>
                </div>
                <div className="mt-3 space-y-2">
                  {newVenue.cons.map((con, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-red-50 p-2 rounded">
                      <span className="flex-1">{con}</span>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => removeCon(index)}
                        className="text-red-500"
                      >
                        <SafeIcon icon={FiX} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={addVenue} className="flex items-center space-x-2">
                <SafeIcon icon={FiPlus} />
                <span>Add Venue</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* Edit Venue Pros/Cons Modal */}
      {showEditForm && editingVenue && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Pros & Cons: {editingVenue.name}
              </h2>
              <Button
                variant="ghost"
                size="small"
                onClick={closeEditForm}
              >
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pros
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={editPro}
                    onChange={(e) => setEditPro(e.target.value)}
                    placeholder="Add a pro"
                    className="flex-1"
                  />
                  <Button onClick={addProToExistingVenue}>Add</Button>
                </div>
                <div className="mt-3 space-y-2">
                  {editingVenue.pros.map((pro, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-green-50 p-2 rounded">
                      <span className="flex-1">{pro}</span>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => removeProFromExistingVenue(index)}
                        className="text-red-500"
                      >
                        <SafeIcon icon={FiX} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Cons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cons
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={editCon}
                    onChange={(e) => setEditCon(e.target.value)}
                    placeholder="Add a con"
                    className="flex-1"
                  />
                  <Button onClick={addConToExistingVenue}>Add</Button>
                </div>
                <div className="mt-3 space-y-2">
                  {editingVenue.cons.map((con, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-red-50 p-2 rounded">
                      <span className="flex-1">{con}</span>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => removeConFromExistingVenue(index)}
                        className="text-red-500"
                      >
                        <SafeIcon icon={FiX} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={closeEditForm} className="flex items-center space-x-2">
                <SafeIcon icon={FiCheck} />
                <span>Done</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Venues List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Venue Options</h2>
          <div className="flex space-x-3">
            <Button onClick={exportVenuesToPdf} className="flex items-center space-x-2">
              <SafeIcon icon={FiDownload} />
              <span>Export PDF</span>
            </Button>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
              <SafeIcon icon={FiPlus} />
              <span>Add Venue</span>
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          {venues.map(venue => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        venue.status === 'booked'
                          ? 'bg-green-100 text-green-800'
                          : venue.status === 'visited'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {venue.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{venue.address}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    <span>Capacity: {venue.capacity} guests</span>
                    <span>Cost: ${venue.cost.toLocaleString()}</span>
                    <div className="flex items-center space-x-1">
                      <span>Rating:</span>
                      {renderStars(venue.rating)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Contact: {venue.contact}</span>
                    <span>Phone: {venue.phone}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="flex space-x-1">
                    <Button
                      variant={venue.status === 'considering' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => updateVenueStatus(venue.id, 'considering')}
                    >
                      Consider
                    </Button>
                    <Button
                      variant={venue.status === 'visited' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => updateVenueStatus(venue.id, 'visited')}
                    >
                      Visited
                    </Button>
                    <Button
                      variant={venue.status === 'booked' ? 'success' : 'outline'}
                      size="small"
                      onClick={() => updateVenueStatus(venue.id, 'booked')}
                    >
                      Booked
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => removeVenue(venue.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </Button>
                </div>
              </div>
              
              {/* Pros and Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800 flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="text-green-600" />
                      <span>Pros</span>
                    </h4>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => startEditVenue(venue)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <SafeIcon icon={FiEdit} />
                      <span className="ml-1">Edit</span>
                    </Button>
                  </div>
                  <ul className="space-y-1">
                    {venue.pros.map((pro, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center space-x-2"
                      >
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span>{pro}</span>
                      </li>
                    ))}
                    {venue.pros.length === 0 && (
                      <li className="text-sm text-gray-400 italic">
                        No pros added yet. Click Edit to add.
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-800 mb-2 flex items-center space-x-2">
                    <SafeIcon icon={FiX} className="text-red-600" />
                    <span>Cons</span>
                  </h4>
                  <ul className="space-y-1">
                    {venue.cons.map((con, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center space-x-2"
                      >
                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                        <span>{con}</span>
                      </li>
                    ))}
                    {venue.cons.length === 0 && (
                      <li className="text-sm text-gray-400 italic">
                        No cons added yet. Click Edit to add.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Venue Evaluation Criteria */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Evaluation Criteria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Location & Accessibility',
            'Capacity & Layout',
            'Cost & Value',
            'Amenities & Services',
            'Parking Availability',
            'Catering Options',
            'Audio/Visual Equipment',
            'Decoration Flexibility',
            'Cancellation Policy'
          ].map(criteria => (
            <div key={criteria} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{criteria}</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <SafeIcon
                      key={rating}
                      icon={FiStar}
                      className="text-xs text-gray-300 hover:text-yellow-500 cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default VenueChapter;