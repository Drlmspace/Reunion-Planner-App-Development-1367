import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPlane, FiCar, FiHome, FiMapPin } = FiIcons;

const TravelChapter = () => {
  const [activeTab, setActiveTab] = useState('travel');
  const [travelInfo, setTravelInfo] = useState([
    { id: 1, name: 'John Smith', method: 'Flying', arrival: '2024-06-15', departure: '2024-06-17', accommodation: 'Holiday Inn', needsPickup: true },
    { id: 2, name: 'Sarah Johnson', method: 'Driving', arrival: '2024-06-15', departure: '2024-06-16', accommodation: 'Staying with family', needsPickup: false }
  ]);

  const [lodging, setLodging] = useState([
    { id: 1, name: 'Holiday Inn Downtown', address: '123 Main St', phone: '555-0123', rate: '$120/night', discount: '15% group rate', availability: 'Available' },
    { id: 2, name: 'Comfort Suites', address: '456 Oak Ave', phone: '555-0456', rate: '$95/night', discount: '10% group rate', availability: 'Limited' }
  ]);

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
              <Button className="flex items-center space-x-2">
                <SafeIcon icon={FiPlane} />
                <span>Add Travel Info</span>
              </Button>
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
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recommended Lodging</h2>
              <Button className="flex items-center space-x-2">
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

                  <div className="flex space-x-2">
                    <Button variant="outline" size="small" className="flex-1">
                      View Details
                    </Button>
                    <Button size="small" className="flex-1">
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Lodging Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Booking Instructions</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Mention "Family Reunion 2024" for group rates</li>
                  <li>• Book by May 15th to secure discount</li>
                  <li>• Cancellation available up to 48 hours prior</li>
                  <li>• Contact hotel directly for best rates</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Alternative Options</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Airbnb rentals in downtown area</li>
                  <li>• Extended stay hotels for longer visits</li>
                  <li>• Camping options at nearby state park</li>
                  <li>• Host family volunteer program</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default TravelChapter;