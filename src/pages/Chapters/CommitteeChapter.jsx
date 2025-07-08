import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUsers, FiUserPlus, FiMail, FiPhone, FiEdit, FiTrash2, FiCheck, FiPlus, FiX, FiSave } = FiIcons;

const CommitteeChapter = () => {
  const [activeTab, setActiveTab] = useState('roles');
  
  // Predefined roles with descriptions
  const [roles, setRoles] = useState([
    {
      id: 1,
      title: 'Event Coordinator',
      description: "This person's job is to oversee the planning process and help keep the team on track. They should ensure that meetings happen regularly and that everyone stays engaged and motivated.",
      isCustom: false
    },
    {
      id: 2,
      title: 'Budget Manager',
      description: 'This role focuses on the financial side of the reunion. The manager will track expenses, manage funds, and help ensure that all spending aligns with the budget you\'ve set. They will also coordinate fundraising efforts if necessary.',
      isCustom: false
    },
    {
      id: 3,
      title: 'Venue and Logistics Coordinator',
      description: 'This person will handle the selection of venue, transportation, accommodations, and all logistical details. They are responsible for making sure everything runs smoothly on the day of the event.',
      isCustom: false
    },
    {
      id: 4,
      title: 'Communications Coordinator',
      description: 'This role entails managing all communications related to the reunion. They are tasked with keeping guests informed and engaged, handling invitations, tracking RSVPs, and updating participants on important details.',
      isCustom: false
    },
    {
      id: 5,
      title: 'Social Media and Marketing Manager',
      description: 'If you plan to leverage social media or a website, this individual will manage those platforms. They can share updates, promote the reunion, and help build excitement before the event.',
      isCustom: false
    },
    {
      id: 6,
      title: 'Programs and Activities Coordinator',
      description: 'This person will take charge of planning the activities and programs that will occur during the reunion. From determining games and entertainment to managing timelines for activities, their creativity can shape the overall experience.',
      isCustom: false
    },
    {
      id: 7,
      title: 'Memory Keeper',
      description: 'Ideal for someone who enjoys documenting events, this role consists of capturing memories through photos or videos, creating a memory book or wall, or setting up a project to compile stories from guests.',
      isCustom: false
    }
  ]);

  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '555-0123',
      role: 'Event Coordinator',
      responsibilities: ['Overall coordination', 'Budget management'],
      status: 'confirmed'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '555-0456',
      role: 'Communications Coordinator',
      responsibilities: ['Venue coordination', 'Vendor management'],
      status: 'pending'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    responsibilities: []
  });

  const [newRole, setNewRole] = useState({
    title: '',
    description: ''
  });

  const responsibilityOptions = [
    'Budget Management',
    'Venue Coordination',
    'Food & Beverage',
    'Communication',
    'RSVP Management',
    'Travel & Lodging',
    'Vendor Management',
    'Program Planning',
    'Registration',
    'Photography/Video',
    'Social Media',
    'Activities Planning',
    'Memory Documentation'
  ];

  const addMember = () => {
    if (newMember.name && newMember.email) {
      setMembers([...members, {
        ...newMember,
        id: Date.now(),
        status: 'pending'
      }]);
      setNewMember({
        name: '',
        email: '',
        phone: '',
        role: '',
        responsibilities: []
      });
      setShowAddForm(false);
    }
  };

  const removeMember = (id) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const updateMemberStatus = (id, status) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, status } : member
    ));
  };

  const addRole = () => {
    if (newRole.title && newRole.description) {
      setRoles([...roles, {
        id: Date.now(),
        title: newRole.title,
        description: newRole.description,
        isCustom: true
      }]);
      setNewRole({ title: '', description: '' });
      setShowRoleForm(false);
    }
  };

  const updateRole = () => {
    if (editingRole && newRole.title && newRole.description) {
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, title: newRole.title, description: newRole.description }
          : role
      ));
      setEditingRole(null);
      setNewRole({ title: '', description: '' });
      setShowRoleForm(false);
    }
  };

  const removeRole = (id) => {
    setRoles(roles.filter(role => role.id !== id));
    // Also remove this role from any assigned members
    setMembers(members.map(member => 
      member.role === roles.find(r => r.id === id)?.title 
        ? { ...member, role: '' }
        : member
    ));
  };

  const startEditingRole = (role) => {
    setEditingRole(role);
    setNewRole({ title: role.title, description: role.description });
    setShowRoleForm(true);
  };

  const cancelRoleForm = () => {
    setShowRoleForm(false);
    setEditingRole(null);
    setNewRole({ title: '', description: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 2: Planning Committee</h1>
          <p className="text-gray-600 mt-1">
            Assemble your planning team and assign roles and responsibilities.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiUsers} className="text-2xl text-blue-600" />
          <span className="text-sm text-gray-500">Progress: 40%</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'roles', label: 'Roles & Responsibilities', icon: FiEdit },
          { id: 'members', label: 'Committee Members', icon: FiUsers }
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

      {/* Roles & Responsibilities Tab */}
      {activeTab === 'roles' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Introduction */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Defining Roles and Responsibilities</h2>
            <p className="text-gray-600 mb-4">
              Once you've assembled your team, it's essential to define clear roles and responsibilities to maximize efficiency. 
              Consider breaking down the planning roles into specific categories, each with clear tasks and timelines.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">💡 Best Practice</h3>
              <p className="text-sm text-blue-800">
                Have an initial meeting where you can go over everyone's responsibilities, establishing a code of communication 
                and a regular meeting schedule. A successful committee thrives on open dialogue—everyone should feel free to 
                share updates, concerns, and new ideas as planning progresses.
              </p>
            </div>
          </Card>

          {/* Add/Edit Role Form */}
          {showRoleForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingRole ? 'Edit Role' : 'Add Custom Role'}
                  </h2>
                  <Button variant="ghost" size="small" onClick={cancelRoleForm}>
                    <SafeIcon icon={FiX} />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Input
                    label="Role Title"
                    value={newRole.title}
                    onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                    placeholder="e.g., Special Events Coordinator"
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Description
                    </label>
                    <textarea
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      placeholder="Describe the responsibilities and expectations for this role..."
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={cancelRoleForm}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={editingRole ? updateRole : addRole}
                    className="flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} />
                    <span>{editingRole ? 'Update Role' : 'Add Role'}</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Roles List */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Available Roles</h2>
              <Button 
                onClick={() => setShowRoleForm(true)}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} />
                <span>Add Custom Role</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              {roles.map(role => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{role.title}</h3>
                        {role.isCustom && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => startEditingRole(role)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={FiEdit} />
                      </Button>
                      {role.isCustom && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => removeRole(role.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <SafeIcon icon={FiTrash2} />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Committee Members Tab */}
      {activeTab === 'members' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Committee Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-blue-600">{members.length}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {members.filter(m => m.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {members.filter(m => m.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </Card>
          </div>

          {/* Add Member Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Add Committee Member</h2>
                  <Button variant="ghost" size="small" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Role
                    </label>
                    <select
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a role</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.title}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Responsibilities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {responsibilityOptions.map(responsibility => (
                      <label key={responsibility} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newMember.responsibilities.includes(responsibility)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewMember({
                                ...newMember,
                                responsibilities: [...newMember.responsibilities, responsibility]
                              });
                            } else {
                              setNewMember({
                                ...newMember,
                                responsibilities: newMember.responsibilities.filter(r => r !== responsibility)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{responsibility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addMember} className="flex items-center space-x-2">
                    <SafeIcon icon={FiUserPlus} />
                    <span>Add Member</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Committee Members */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Committee Members</h2>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiUserPlus} />
                <span>Add Member</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              {members.map(member => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {member.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiMail} />
                          <span>{member.email}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiPhone} />
                            <span>{member.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Role:</span>
                        <span className="ml-2 text-gray-600">{member.role || 'Unassigned'}</span>
                      </div>
                      
                      {member.responsibilities && member.responsibilities.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700">Responsibilities:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.responsibilities.map(responsibility => (
                              <span
                                key={responsibility}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {responsibility}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {member.status === 'pending' && (
                        <Button
                          variant="success"
                          size="small"
                          onClick={() => updateMemberStatus(member.id, 'confirmed')}
                          className="flex items-center space-x-1"
                        >
                          <SafeIcon icon={FiCheck} />
                          <span>Confirm</span>
                        </Button>
                      )}
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
                        onClick={() => removeMember(member.id)}
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
    </div>
  );
};

export default CommitteeChapter;