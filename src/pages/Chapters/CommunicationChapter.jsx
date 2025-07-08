import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useReunion } from '../../contexts/ReunionContext';
import toast from 'react-hot-toast';

const { FiMail, FiMessageSquare, FiSend, FiSave, FiX, FiPlus, FiTrash2, FiInfo, FiEdit } = FiIcons;

const CommunicationChapter = () => {
  const { currentReunion } = useReunion();
  const [activeTab, setActiveTab] = useState('messages');
  const [showCreateTemplateForm, setShowCreateTemplateForm] = useState(false);
  const [showCreateMessageForm, setShowCreateMessageForm] = useState(false);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'save-the-date',
    content: ''
  });

  const [newMessage, setNewMessage] = useState({
    subject: '',
    type: 'save-the-date',
    content: '',
    recipients: '',
  });

  // Local state management for demo mode
  const [messages, setMessages] = useState(() => {
    // Try to load from localStorage first
    const savedMessages = localStorage.getItem('demoMessages');
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
    
    // Default initial messages
    return [
      {
        id: 1,
        type: 'save-the-date',
        subject: 'Save the Date - Family Reunion 2024',
        content: 'We are excited to announce our family reunion will take place on July 15th, 2024. Please mark your calendars and plan to join us for this special occasion. More details will follow in the coming months.',
        sent: '2024-01-01',
        recipients: 45
      },
      {
        id: 2,
        type: 'reminder',
        subject: 'Reminder: RSVP Deadline Approaching',
        content: 'This is a friendly reminder that the RSVP deadline for our family reunion is approaching. Please let us know if you will be attending by January 30th. We need an accurate headcount for venue and catering arrangements.',
        sent: '2024-01-15',
        recipients: 38
      }
    ];
  });

  const [templates, setTemplates] = useState(() => {
    // Try to load from localStorage first
    const savedTemplates = localStorage.getItem('demoTemplates');
    if (savedTemplates) {
      try {
        return JSON.parse(savedTemplates);
      } catch (e) {
        console.error('Error parsing saved templates:', e);
      }
    }
    
    // Default initial templates
    return [
      {
        id: 1,
        name: 'Save the Date',
        type: 'save-the-date',
        content: 'Mark your calendars! Our family reunion is coming up on [DATE] at [LOCATION]. We hope you can join us for this special gathering. More details will be shared as the date approaches.'
      },
      {
        id: 2,
        name: 'RSVP Reminder',
        type: 'reminder',
        content: 'Don\'t forget to RSVP for our upcoming reunion by [DEADLINE]. We need to finalize our headcount for venue and catering arrangements. Looking forward to seeing you!'
      },
      {
        id: 3,
        name: 'Thank You',
        type: 'thank-you',
        content: 'Thank you for attending our wonderful reunion! It was great to see everyone and share memories together. We have posted photos online at [LINK] and can\'t wait until we gather again.'
      }
    ];
  });

  // Save to localStorage whenever messages or templates change
  useEffect(() => {
    localStorage.setItem('demoMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('demoTemplates', JSON.stringify(templates));
  }, [templates]);

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      try {
        const template = {
          id: Date.now(),
          name: newTemplate.name,
          type: newTemplate.type,
          content: newTemplate.content
        };
        
        setTemplates(prev => [...prev, template]);
        setNewTemplate({
          name: '',
          type: 'save-the-date',
          content: ''
        });
        setShowCreateTemplateForm(false);
        toast.success('Template created successfully!');
      } catch (error) {
        console.error('Error creating template:', error);
        toast.error('Failed to create template');
      }
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const handleCreateMessage = () => {
    if (newMessage.subject && newMessage.content && newMessage.recipients) {
      try {
        const message = {
          id: Date.now(),
          type: newMessage.type,
          subject: newMessage.subject,
          content: newMessage.content,
          recipients: parseInt(newMessage.recipients) || 0,
          sent: new Date().toISOString().split('T')[0]
        };
        
        setMessages(prev => [...prev, message]);
        setNewMessage({
          subject: '',
          type: 'save-the-date',
          content: '',
          recipients: ''
        });
        setShowCreateMessageForm(false);
        toast.success('Message sent successfully!');
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
      }
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const deleteMessage = (id) => {
    try {
      setMessages(prev => prev.filter(message => message.id !== id));
      setShowMessageDetails(false);
      toast.success('Message deleted successfully!');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const deleteTemplate = (id) => {
    try {
      setTemplates(prev => prev.filter(template => template.id !== id));
      toast.success('Template deleted successfully!');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const viewMessageDetails = (message) => {
    setSelectedMessage(message);
    setShowMessageDetails(true);
  };

  const useTemplateForNewMessage = (template) => {
    setNewMessage({
      ...newMessage,
      type: template.type,
      content: template.content,
      subject: template.name
    });
    setActiveTab('messages');
    setShowCreateMessageForm(true);
  };

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
          { id: 'messages', label: 'Messages', icon: FiMail },
          { id: 'templates', label: 'Templates', icon: FiMessageSquare }
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

      {/* Message Details Modal */}
      {showMessageDetails && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Message Details</h2>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowMessageDetails(false)}
              >
                <SafeIcon icon={FiX} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-700">Subject:</span>
                <span className="block text-lg font-semibold mt-1">{selectedMessage.subject}</span>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-700">Type:</span>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                  selectedMessage.type === 'save-the-date' ? 'bg-purple-100 text-purple-800' : 
                  selectedMessage.type === 'reminder' ? 'bg-blue-100 text-blue-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedMessage.type}
                </span>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-700">Sent:</span>
                <span className="block mt-1">{new Date(selectedMessage.sent).toLocaleDateString()}</span>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-700">Recipients:</span>
                <span className="block mt-1">{selectedMessage.recipients} people</span>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-700">Content:</span>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-line">
                  {selectedMessage.content}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => deleteMessage(selectedMessage.id)}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
              >
                <SafeIcon icon={FiTrash2} />
                <span>Delete</span>
              </Button>
              
              <Button onClick={() => setShowMessageDetails(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Form */}
      {showCreateTemplateForm && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Template</h2>
            <Button 
              variant="ghost" 
              size="small" 
              onClick={() => setShowCreateTemplateForm(false)}
            >
              <SafeIcon icon={FiX} />
            </Button>
          </div>
          <div className="space-y-6">
            <Input
              label="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              placeholder="e.g., Welcome Message"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Type
              </label>
              <select
                value={newTemplate.type}
                onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="save-the-date">Save the Date</option>
                <option value="reminder">Reminder</option>
                <option value="thank-you">Thank You</option>
                <option value="invitation">Invitation</option>
                <option value="update">Update</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Content
              </label>
              <textarea
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows="5"
                placeholder="Enter the message template content..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use placeholders like [DATE], [LOCATION], [NAME] that can be replaced when using the template.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateTemplateForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} />
                <span>Save Template</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Create Message Form */}
      {showCreateMessageForm && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Message</h2>
            <Button 
              variant="ghost" 
              size="small" 
              onClick={() => setShowCreateMessageForm(false)}
            >
              <SafeIcon icon={FiX} />
            </Button>
          </div>
          <div className="space-y-6">
            <Input
              label="Subject"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
              placeholder="e.g., Save the Date - Family Reunion 2024"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Type
              </label>
              <select
                value={newMessage.type}
                onChange={(e) => setNewMessage({...newMessage, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="save-the-date">Save the Date</option>
                <option value="reminder">Reminder</option>
                <option value="thank-you">Thank You</option>
                <option value="invitation">Invitation</option>
                <option value="update">Update</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Recipients
              </label>
              <Input
                type="number"
                value={newMessage.recipients}
                onChange={(e) => setNewMessage({...newMessage, recipients: e.target.value})}
                placeholder="Number of people receiving this message"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content
              </label>
              <textarea
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows="5"
                placeholder="Enter your message content..."
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateMessageForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateMessage}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiSend} />
                <span>Send Message</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Sent Messages</h2>
              <Button 
                onClick={() => setShowCreateMessageForm(true)}
                className="flex items-center space-x-2">
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
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => viewMessageDetails(message)}
                      >
                        <SafeIcon icon={FiInfo} className="mr-1" />
                        View Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="small"
                        onClick={() => deleteMessage(message.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <SafeIcon icon={FiMail} className="text-4xl text-gray-300 mb-4 mx-auto" />
                  <p className="text-gray-500 mb-4">No messages have been sent yet</p>
                  <Button 
                    onClick={() => setShowCreateMessageForm(true)}
                    variant="outline"
                    size="small"
                  >
                    <SafeIcon icon={FiSend} className="mr-1" />
                    Create Your First Message
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Message Templates</h2>
              <Button 
                onClick={() => setShowCreateTemplateForm(true)} 
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} />
                <span>Create Template</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => deleteTemplate(template.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <SafeIcon icon={FiTrash2} />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.content.substring(0, 80)}...</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.type === 'save-the-date' ? 'bg-purple-100 text-purple-800' : 
                      template.type === 'reminder' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {template.type}
                    </span>
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => useTemplateForNewMessage(template)}
                    >
                      <SafeIcon icon={FiEdit} className="mr-1" />
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
              
              {templates.length === 0 && (
                <div className="col-span-3 text-center py-8">
                  <SafeIcon icon={FiMessageSquare} className="text-4xl text-gray-300 mb-4 mx-auto" />
                  <p className="text-gray-500 mb-4">No templates have been created yet</p>
                  <Button 
                    onClick={() => setShowCreateTemplateForm(true)}
                    variant="outline"
                    size="small"
                  >
                    <SafeIcon icon={FiPlus} className="mr-1" />
                    Create Your First Template
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CommunicationChapter;