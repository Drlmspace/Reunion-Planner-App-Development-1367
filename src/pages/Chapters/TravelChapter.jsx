import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useReunion } from '../../contexts/ReunionContext';

const { FiPlane, FiCar, FiHome, FiMapPin, FiEdit3, FiSave, FiX, FiDownload, FiPlus, FiCheck, FiPhone } = FiIcons;

const TravelChapter = () => {
  const { currentReunion } = useReunion();
  const [activeTab, setActiveTab] = useState('travel');
  const [editingGuidelines, setEditingGuidelines] = useState(false);

  // Travel info state
  const [travelInfo, setTravelInfo] = useState([
    {
      id: 1,
      name: 'John Smith',
      method: 'Flying',
      arrival: '2024-06-15',
      departure: '2024-06-17',
      accommodation: 'Holiday Inn',
      needsPickup: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      method: 'Driving',
      arrival: '2024-06-15',
      departure: '2024-06-16',
      accommodation: 'Staying with family',
      needsPickup: false
    }
  ]);

  // Lodging state
  const [lodging, setLodging] = useState([
    {
      id: 1,
      name: 'Holiday Inn Downtown',
      address: '123 Main St',
      phone: '555-0123',
      rate: '$120/night',
      discount: '15% group rate',
      availability: 'Available',
      pros: ['Central location', 'Free breakfast', 'Pool access'],
      cons: ['Limited parking', 'No airport shuttle']
    },
    {
      id: 2,
      name: 'Comfort Suites',
      address: '456 Oak Ave',
      phone: '555-0456',
      rate: '$95/night',
      discount: '10% group rate',
      availability: 'Limited',
      pros: ['Budget-friendly', 'Spacious rooms'],
      cons: ['Farther from venue', 'Older building']
    }
  ]);

  // Add hotel form state
  const [showAddHotelForm, setShowAddHotelForm] = useState(false);
  const [newHotel, setNewHotel] = useState({
    name: '',
    address: '',
    phone: '',
    rate: '',
    discount: '',
    availability: 'Available',
    pros: [],
    cons: []
  });

  // Pros and Cons state for new hotel
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');

  // Edit hotel state
  const [editingHotel, setEditingHotel] = useState(null);
  const [showEditProsConsForm, setShowEditProsConsForm] = useState(false);
  const [editPro, setEditPro] = useState('');
  const [editCon, setEditCon] = useState('');

  const [lodgingGuidelines, setLodgingGuidelines] = useState({
    bookingInstructions: [
      'Mention "Family Reunion 2024" for group rates',
      'Book by May 15th to secure discount',
      'Cancellation available up to 48 hours prior',
      'Contact hotel directly for best rates'
    ],
    alternativeOptions: [
      'Airbnb rentals in downtown area',
      'Extended stay hotels for longer visits',
      'Camping options at nearby state park',
      'Host family volunteer program'
    ]
  });

  const [tempGuidelines, setTempGuidelines] = useState({
    bookingInstructions: [...lodgingGuidelines.bookingInstructions],
    alternativeOptions: [...lodgingGuidelines.alternativeOptions]
  });

  // Add new hotel functions
  const addHotel = () => {
    if (newHotel.name && newHotel.address) {
      setLodging([
        ...lodging,
        {
          ...newHotel,
          id: Date.now(),
          pros: [...newHotel.pros],
          cons: [...newHotel.cons]
        }
      ]);
      setNewHotel({
        name: '',
        address: '',
        phone: '',
        rate: '',
        discount: '',
        availability: 'Available',
        pros: [],
        cons: []
      });
      setNewPro('');
      setNewCon('');
      setShowAddHotelForm(false);
      toast.success('New hotel added successfully!');
    } else {
      toast.error('Hotel name and address are required');
    }
  };

  const addNewPro = () => {
    if (newPro.trim()) {
      setNewHotel({
        ...newHotel,
        pros: [...newHotel.pros, newPro.trim()]
      });
      setNewPro('');
    }
  };

  const removeNewPro = (index) => {
    setNewHotel({
      ...newHotel,
      pros: newHotel.pros.filter((_, i) => i !== index)
    });
  };

  const addNewCon = () => {
    if (newCon.trim()) {
      setNewHotel({
        ...newHotel,
        cons: [...newHotel.cons, newCon.trim()]
      });
      setNewCon('');
    }
  };

  const removeNewCon = (index) => {
    setNewHotel({
      ...newHotel,
      cons: newHotel.cons.filter((_, i) => i !== index)
    });
  };

  // Edit Pros/Cons for existing hotel
  const startEditProsConsForHotel = (hotel) => {
    setEditingHotel(hotel);
    setShowEditProsConsForm(true);
  };

  const addProToExistingHotel = () => {
    if (editPro.trim() && editingHotel) {
      const updatedHotel = {
        ...editingHotel,
        pros: [...editingHotel.pros, editPro.trim()]
      };
      setEditingHotel(updatedHotel);
      setEditPro('');
      
      // Update the hotel in the lodging array
      setLodging(lodging.map(h => 
        h.id === updatedHotel.id ? updatedHotel : h
      ));
    }
  };

  const removeProFromExistingHotel = (index) => {
    if (editingHotel) {
      const updatedHotel = {
        ...editingHotel,
        pros: editingHotel.pros.filter((_, i) => i !== index)
      };
      setEditingHotel(updatedHotel);
      
      // Update the hotel in the lodging array
      setLodging(lodging.map(h => 
        h.id === updatedHotel.id ? updatedHotel : h
      ));
    }
  };

  const addConToExistingHotel = () => {
    if (editCon.trim() && editingHotel) {
      const updatedHotel = {
        ...editingHotel,
        cons: [...editingHotel.cons, editCon.trim()]
      };
      setEditingHotel(updatedHotel);
      setEditCon('');
      
      // Update the hotel in the lodging array
      setLodging(lodging.map(h => 
        h.id === updatedHotel.id ? updatedHotel : h
      ));
    }
  };

  const removeConFromExistingHotel = (index) => {
    if (editingHotel) {
      const updatedHotel = {
        ...editingHotel,
        cons: editingHotel.cons.filter((_, i) => i !== index)
      };
      setEditingHotel(updatedHotel);
      
      // Update the hotel in the lodging array
      setLodging(lodging.map(h => 
        h.id === updatedHotel.id ? updatedHotel : h
      ));
    }
  };

  const closeEditProsConsForm = () => {
    setEditingHotel(null);
    setShowEditProsConsForm(false);
    setEditPro('');
    setEditCon('');
  };

  // Delete hotel
  const deleteHotel = (id) => {
    setLodging(lodging.filter(hotel => hotel.id !== id));
    toast.success('Hotel removed successfully');
  };

  // Guidelines editing functions
  const handleGuidelineChange = (type, index, value) => {
    setTempGuidelines({
      ...tempGuidelines,
      [type]: tempGuidelines[type].map((item, i) => i === index ? value : item)
    });
  };

  const addGuideline = (type) => {
    setTempGuidelines({
      ...tempGuidelines,
      [type]: [...tempGuidelines[type], '']
    });
  };

  const removeGuideline = (type, index) => {
    setTempGuidelines({
      ...tempGuidelines,
      [type]: tempGuidelines[type].filter((_, i) => i !== index)
    });
  };

  const saveGuidelines = () => {
    setLodgingGuidelines(tempGuidelines);
    setEditingGuidelines(false);
    toast.success('Lodging guidelines updated successfully!');
  };

  const cancelEdit = () => {
    setTempGuidelines({
      bookingInstructions: [...lodgingGuidelines.bookingInstructions],
      alternativeOptions: [...lodgingGuidelines.alternativeOptions]
    });
    setEditingGuidelines(false);
  };

  const exportTravelInfoToPdf = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(`${currentReunion?.title || 'Reunion'} - Travel Information`, 14, 20);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Planned reunion date: ${currentReunion?.planned_date ? new Date(currentReunion.planned_date).toLocaleDateString() : 'TBD'}`, 14, 40);

    // Create travel info table data
    const tableData = travelInfo.map(info => [
      info.name,
      info.method,
      new Date(info.arrival).toLocaleDateString(),
      new Date(info.departure).toLocaleDateString(),
      info.accommodation,
      info.needsPickup ? 'Yes' : 'No'
    ]);

    // Add travel info table
    doc.autoTable({
      startY: 50,
      head: [['Name', 'Method', 'Arrival', 'Departure', 'Accommodation', 'Pickup Needed']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 135, 245] }
    });

    // Add summary statistics
    let yPos = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text('Travel Summary', 14, yPos);
    yPos += 10;
    doc.setFontSize(10);

    const flying = travelInfo.filter(t => t.method === 'Flying').length;
    const driving = travelInfo.filter(t => t.method === 'Driving').length;
    const needsPickup = travelInfo.filter(t => t.needsPickup).length;

    doc.text(`Total travelers: ${travelInfo.length}`, 14, yPos);
    yPos += 6;
    doc.text(`Flying: ${flying} (${Math.round((flying/travelInfo.length)*100)}%)`, 14, yPos);
    yPos += 6;
    doc.text(`Driving: ${driving} (${Math.round((driving/travelInfo.length)*100)}%)`, 14, yPos);
    yPos += 6;
    doc.text(`Pickup needed: ${needsPickup} travelers`, 14, yPos);
    yPos += 15;

    // Add lodging information if it fits on page
    if (yPos < 220) {
      doc.setFontSize(14);
      doc.text('Recommended Lodging', 14, yPos);
      yPos += 10;

      // Create lodging table data
      const lodgingData = lodging.map(hotel => [
        hotel.name,
        hotel.rate,
        hotel.discount,
        hotel.availability
      ]);

      // Add lodging table
      doc.autoTable({
        startY: yPos,
        head: [['Hotel', 'Rate', 'Discount', 'Availability']],
        body: lodgingData,
        theme: 'grid',
        headStyles: { fillColor: [66, 135, 245] }
      });
    }

    // Save the PDF
    doc.save(`${currentReunion?.title || 'reunion'}_travel_info.pdf`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 8: Travel & Lodging</h1>
          <p className="text-gray-600 mt-1">
            Coordinate travel arrangements and accommodation options for attendees.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiPlane} className="text-2xl text-cyan-600" />
          <span className="text-sm text-gray-500">Progress: 30%</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'travel', label: 'Travel Info', icon: FiPlane },
          { id: 'lodging', label: 'Lodging Options', icon: FiHome }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Travel Info Tab */}
      {activeTab === 'travel' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-blue-600">{travelInfo.length}</div>
              <div className="text-sm text-gray-600">Travel Submissions</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {travelInfo.filter(t => t.method === 'Flying').length}
              </div>
              <div className="text-sm text-gray-600">Flying</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {travelInfo.filter(t => t.method === 'Driving').length}
              </div>
              <div className="text-sm text-gray-600">Driving</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {travelInfo.filter(t => t.needsPickup).length}
              </div>
              <div className="text-sm text-gray-600">Need Pickup</div>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Travel Information</h2>
              <div className="flex space-x-3">
                <Button onClick={exportTravelInfoToPdf} className="flex items-center space-x-2">
                  <SafeIcon icon={FiDownload} />
                  <span>Export PDF</span>
                </Button>
                <Button className="flex items-center space-x-2">
                  <SafeIcon icon={FiPlane} />
                  <span>Add Travel Info</span>
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Arrival</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Departure</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Accommodation</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Pickup Needed</th>
                  </tr>
                </thead>
                <tbody>
                  {travelInfo.map(travel => (
                    <tr key={travel.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{travel.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={travel.method === 'Flying' ? FiPlane : FiCar} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{travel.method}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(travel.arrival).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(travel.departure).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                        {travel.accommodation}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          travel.needsPickup ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {travel.needsPickup ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Lodging Tab */}
      {activeTab === 'lodging' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Add Hotel Form */}
          {showAddHotelForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <SafeIcon icon={FiHome} className="text-cyan-600" />
                    <span>Add New Hotel</span>
                  </h2>
                  <Button variant="ghost" size="small" onClick={() => setShowAddHotelForm(false)}>
                    <SafeIcon icon={FiX} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Hotel Name" 
                    value={newHotel.name} 
                    onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
                    required
                  />
                  <Input 
                    label="Address" 
                    value={newHotel.address} 
                    onChange={(e) => setNewHotel({...newHotel, address: e.target.value})}
                    required
                  />
                  <Input 
                    label="Phone" 
                    value={newHotel.phone} 
                    onChange={(e) => setNewHotel({...newHotel, phone: e.target.value})}
                  />
                  <Input 
                    label="Rate (e.g. $120/night)" 
                    value={newHotel.rate} 
                    onChange={(e) => setNewHotel({...newHotel, rate: e.target.value})}
                  />
                  <Input 
                    label="Discount" 
                    value={newHotel.discount} 
                    onChange={(e) => setNewHotel({...newHotel, discount: e.target.value})}
                    placeholder="e.g. 10% group rate"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <select
                      value={newHotel.availability}
                      onChange={(e) => setNewHotel({...newHotel, availability: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Limited">Limited</option>
                      <option value="Filling Fast">Filling Fast</option>
                      <option value="Almost Full">Almost Full</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>
                  </div>
                </div>

                {/* Pros and Cons for new hotel */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      {newHotel.pros.map((pro, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-green-50 p-2 rounded">
                          <span className="flex-1">{pro}</span>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => removeNewPro(index)}
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
                      {newHotel.cons.map((con, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-red-50 p-2 rounded">
                          <span className="flex-1">{con}</span>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => removeNewCon(index)}
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
                  <Button variant="outline" onClick={() => setShowAddHotelForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addHotel} className="flex items-center space-x-2">
                    <SafeIcon icon={FiSave} />
                    <span>Save Hotel</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Edit Pros/Cons Form */}
          {showEditProsConsForm && editingHotel && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Edit Pros & Cons: {editingHotel.name}
                  </h2>
                  <Button variant="ghost" size="small" onClick={closeEditProsConsForm}>
                    <SafeIcon icon={FiX} />
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
                      <Button onClick={addProToExistingHotel}>Add</Button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {editingHotel.pros.map((pro, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-green-50 p-2 rounded">
                          <span className="flex-1">{pro}</span>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => removeProFromExistingHotel(index)}
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
                      <Button onClick={addConToExistingHotel}>Add</Button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {editingHotel.cons.map((con, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-red-50 p-2 rounded">
                          <span className="flex-1">{con}</span>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => removeConFromExistingHotel(index)}
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
                  <Button onClick={closeEditProsConsForm} className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} />
                    <span>Done</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recommended Lodging</h2>
              <Button 
                className="flex items-center space-x-2"
                onClick={() => setShowAddHotelForm(true)}
              >
                <SafeIcon icon={FiHome} />
                <span>Add Hotel</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lodging.map(hotel => (
                <div key={hotel.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{hotel.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <SafeIcon icon={FiMapPin} />
                        <span>{hotel.address}</span>
                      </div>
                      <p className="text-sm text-gray-600">📞 {hotel.phone}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      hotel.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {hotel.availability}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium">{hotel.rate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Group Discount:</span>
                      <span className="font-medium text-green-600">{hotel.discount}</span>
                    </div>
                  </div>
                  
                  {/* Pros and Cons */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                      <h4 className="text-xs font-semibold text-green-700 mb-1">PROS</h4>
                      <ul className="text-xs space-y-1">
                        {hotel.pros.length > 0 ? (
                          hotel.pros.map((pro, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-1">+</span> {pro}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic">No pros added</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-red-700 mb-1">CONS</h4>
                      <ul className="text-xs space-y-1">
                        {hotel.cons.length > 0 ? (
                          hotel.cons.map((con, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-1">-</span> {con}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic">No cons added</li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="small" 
                      className="flex-1 flex items-center justify-center space-x-1"
                      onClick={() => startEditProsConsForHotel(hotel)}
                    >
                      <SafeIcon icon={FiEdit3} className="text-sm" />
                      <span>Edit Pros/Cons</span>
                    </Button>
                    <Button 
                      size="small" 
                      className="flex-1"
                      onClick={() => window.open(`tel:${hotel.phone.replace(/[^0-9]/g, '')}`)}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <SafeIcon icon={FiPhone} className="text-sm" />
                        <span>Call</span>
                      </div>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {lodging.length === 0 && (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <SafeIcon icon={FiHome} className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels added yet</h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto">
                  Add hotels and accommodation options for your reunion attendees.
                </p>
                <Button 
                  onClick={() => setShowAddHotelForm(true)}
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={FiPlus} />
                  <span>Add Your First Hotel</span>
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Lodging Guidelines</h2>
              {!editingGuidelines ? (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setEditingGuidelines(true)}
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={FiEdit3} />
                  <span>Edit Guidelines</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={cancelEdit}
                    className="flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiX} />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    size="small"
                    onClick={saveGuidelines}
                    className="flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} />
                    <span>Save</span>
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Booking Instructions</h3>
                {editingGuidelines ? (
                  <div className="space-y-2">
                    {tempGuidelines.bookingInstructions.map((instruction, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-gray-400">•</span>
                        <input
                          type="text"
                          value={instruction}
                          onChange={(e) => handleGuidelineChange('bookingInstructions', index, e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => removeGuideline('bookingInstructions', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <SafeIcon icon={FiX} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => addGuideline('bookingInstructions')}
                      className="mt-2"
                    >
                      Add Instruction
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm text-gray-600">
                    {lodgingGuidelines.bookingInstructions.map((instruction, index) => (
                      <li key={index}>• {instruction}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Alternative Options</h3>
                {editingGuidelines ? (
                  <div className="space-y-2">
                    {tempGuidelines.alternativeOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-gray-400">•</span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleGuidelineChange('alternativeOptions', index, e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => removeGuideline('alternativeOptions', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <SafeIcon icon={FiX} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => addGuideline('alternativeOptions')}
                      className="mt-2"
                    >
                      Add Option
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm text-gray-600">
                    {lodgingGuidelines.alternativeOptions.map((option, index) => (
                      <li key={index}>• {option}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default TravelChapter;