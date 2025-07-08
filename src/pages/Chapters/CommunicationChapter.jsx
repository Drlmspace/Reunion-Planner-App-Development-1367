import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMail, FiPhone, FiMessageSquare, FiSend, FiUsers, FiCalendar } = FiIcons;

const CommunicationChapter = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '555-0123', status: 'contacted', lastContact: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-0456', status: 'pending', lastContact: null },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', phone: '555-0789', status: 'responded', lastContact: '2024-01-10' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, type: 'save-the-date', subject: 'Save the Date - Family Reunion 2024', sent: '2024-01-01', recipients: 45 },
    { id: 2, type: 'reminder', subject: 'Reminder: RSVP Deadline Approaching', sent: '2024-01-15', recipients: 38 }
  ]);

  const templates = [
    { id: 1, name: 'Save the Date', type: 'save-the-date', content: 'Mark your calendars! Our family reunion is coming...' },
    { id: 2, name: 'RSVP Reminder', type: 'reminder', content: 'Don\'t forget to RSVP for our upcoming reunion...' },
    { id: 3, name: 'Thank You', type: 'thank-you', content: 'Thank you for attending our wonderful reunion...' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 6: Communication Planning</h1>
          <p className="text-gray-600 mt-1">
            Manage outreach, messaging, and communication with all attendees.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiMail} className="text-2xl text-pink-600" />
          <span className="text-sm text-gray-500">Progress: 55%</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'contacts', label: 'Contacts', icon: FiUsers },
          { id: 'messages', label: 'Messages', icon: FiMail },
          { id: 'templates', label: 'Templates', icon: FiMessageSquare }
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

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-blue-600">{contacts.length}</div>
              <div className="text-sm text-gray-600">Total Contacts</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {contacts.filter(c => c.status === 'contacted').length}
              </div>
              <div className="text-sm text-gray-600">Contacted</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {contacts.filter(c => c.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </Card>
          </div>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact List</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(contact => (
                    <tr key={contact.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{contact.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{contact.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{contact.phone}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contact.status === 'responded' ? 'bg-green-100 text-green-800' :
                          contact.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {contact.lastContact ? new Date(contact.lastContact).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="small">
                            <SafeIcon icon={FiMail} />
                          </Button>
                          <Button variant="ghost" size="small">
                            <SafeIcon icon={FiPhone} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Sent Messages</h2>
              <Button className="flex items-center space-x-2">
                <SafeIcon icon={FiSend} />
                <span>New Message</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{message.subject}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>📧 {message.recipients} recipients</span>
                        <span>📅 {new Date(message.sent).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          message.type === 'save-the-date' ? 'bg-purple-100 text-purple-800' :
                          message.type === 'reminder' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {message.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="small">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Message Templates</h2>
              <Button className="flex items-center space-x-2">
                <SafeIcon icon={FiMessageSquare} />
                <span>Create Template</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.content.substring(0, 80)}...</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.type === 'save-the-date' ? 'bg-purple-100 text-purple-800' :
                      template.type === 'reminder' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {template.type}
                    </span>
                    <Button variant="outline" size="small">
                      Use Template
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

export default CommunicationChapter;