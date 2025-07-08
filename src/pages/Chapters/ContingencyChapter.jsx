import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiShield, FiAlertTriangle, FiCheck, FiX, FiPlus, FiEdit, FiSave, FiPhone, FiMail, FiMessageSquare } = FiIcons;

const ContingencyChapter = () => {
  const [risks, setRisks] = useState([
    {
      id: 1,
      scenario: 'Bad Weather',
      impact: 'High',
      probability: 'Medium',
      plan: 'Indoor backup venue secured',
      owner: 'John Smith',
      status: 'prepared'
    },
    {
      id: 2,
      scenario: 'Vendor Cancellation',
      impact: 'Medium',
      probability: 'Low',
      plan: 'Backup vendor list ready',
      owner: 'Sarah Johnson',
      status: 'identified'
    },
    {
      id: 3,
      scenario: 'Low Attendance',
      impact: 'Medium',
      probability: 'Low',
      plan: 'Adjust catering numbers',
      owner: 'Mike Davis',
      status: 'planned'
    },
    {
      id: 4,
      scenario: 'Technical Issues',
      impact: 'Low',
      probability: 'Medium',
      plan: 'Backup AV equipment',
      owner: 'Lisa Wilson',
      status: 'prepared'
    }
  ]);

  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, title: 'Lead Planner', name: 'John Smith', phone: '555-0123', role: 'primary' },
    { id: 2, title: 'Co-Planner', name: 'Sarah Johnson', phone: '555-0456', role: 'secondary' },
    { id: 3, title: 'Venue Manager', name: 'Mike Davis', phone: '555-0789', role: 'vendor' },
    { id: 4, title: 'Catering', name: 'Elite Catering', phone: '555-0321', role: 'vendor' },
    { id: 5, title: 'Local Emergency', name: 'Emergency Services', phone: '911', role: 'emergency' }
  ]);

  const [communicationPlan, setCommunicationPlan] = useState([
    { id: 1, priority: 'Primary', method: 'Text message group', description: 'Instant alerts to all committee members' },
    { id: 2, priority: 'Secondary', method: 'Email notification', description: 'Detailed updates and instructions' },
    { id: 3, priority: 'Emergency', method: 'Phone tree activation', description: 'Direct calls for urgent situations' },
    { id: 4, priority: 'Public', method: 'Social media updates', description: 'Information for all attendees' }
  ]);

  const [showAddRiskForm, setShowAddRiskForm] = useState(false);
  const [showEditContactForm, setShowEditContactForm] = useState(false);
  const [showEditCommPlanForm, setShowEditCommPlanForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [editingCommPlan, setEditingCommPlan] = useState(null);
  const [newRisk, setNewRisk] = useState({
    scenario: '',
    impact: 'Low',
    probability: 'Low',
    plan: '',
    owner: ''
  });

  const [newContact, setNewContact] = useState({
    title: '',
    name: '',
    phone: '',
    role: 'primary'
  });

  const [newCommPlan, setNewCommPlan] = useState({
    priority: '',
    method: '',
    description: ''
  });

  const impactColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    identified: 'bg-gray-100 text-gray-800',
    planned: 'bg-blue-100 text-blue-800',
    prepared: 'bg-green-100 text-green-800'
  };

  const roleColors = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-green-100 text-green-800',
    vendor: 'bg-purple-100 text-purple-800',
    emergency: 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    Primary: 'bg-red-100 text-red-800',
    Secondary: 'bg-yellow-100 text-yellow-800',
    Emergency: 'bg-orange-100 text-orange-800',
    Public: 'bg-blue-100 text-blue-800'
  };

  const addRisk = () => {
    if (newRisk.scenario && newRisk.plan) {
      setRisks([...risks, { ...newRisk, id: Date.now(), status: 'identified' }]);
      setNewRisk({
        scenario: '',
        impact: 'Low',
        probability: 'Low',
        plan: '',
        owner: ''
      });
      setShowAddRiskForm(false);
    }
  };

  const updateRiskStatus = (id, status) => {
    setRisks(risks.map(risk => 
      risk.id === id ? { ...risk, status } : risk
    ));
  };

  const addContact = () => {
    if (newContact.title && newContact.name && newContact.phone) {
      if (editingContact) {
        setEmergencyContacts(emergencyContacts.map(contact =>
          contact.id === editingContact.id ? { ...newContact, id: editingContact.id } : contact
        ));
        setEditingContact(null);
      } else {
        setEmergencyContacts([...emergencyContacts, { ...newContact, id: Date.now() }]);
      }
      setNewContact({ title: '', name: '', phone: '', role: 'primary' });
      setShowEditContactForm(false);
    }
  };

  const editContact = (contact) => {
    setEditingContact(contact);
    setNewContact({
      title: contact.title,
      name: contact.name,
      phone: contact.phone,
      role: contact.role
    });
    setShowEditContactForm(true);
  };

  const removeContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };

  const addCommPlan = () => {
    if (newCommPlan.priority && newCommPlan.method) {
      if (editingCommPlan) {
        setCommunicationPlan(communicationPlan.map(plan =>
          plan.id === editingCommPlan.id ? { ...newCommPlan, id: editingCommPlan.id } : plan
        ));
        setEditingCommPlan(null);
      } else {
        setCommunicationPlan([...communicationPlan, { ...newCommPlan, id: Date.now() }]);
      }
      setNewCommPlan({ priority: '', method: '', description: '' });
      setShowEditCommPlanForm(false);
    }
  };

  const editCommPlan = (plan) => {
    setEditingCommPlan(plan);
    setNewCommPlan({
      priority: plan.priority,
      method: plan.method,
      description: plan.description
    });
    setShowEditCommPlanForm(true);
  };

  const removeCommPlan = (id) => {
    setCommunicationPlan(communicationPlan.filter(plan => plan.id !== id));
  };

  const cancelContactForm = () => {
    setShowEditContactForm(false);
    setEditingContact(null);
    setNewContact({ title: '', name: '', phone: '', role: 'primary' });
  };

  const cancelCommPlanForm = () => {
    setShowEditCommPlanForm(false);
    setEditingCommPlan(null);
    setNewCommPlan({ priority: '', method: '', description: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 11: Contingency Planning</h1>
          <p className="text-gray-600 mt-1">
            Identify potential risks and prepare backup plans for your reunion.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiShield} className="text-2xl text-teal-600" />
          <span className="text-sm text-gray-500">Progress: 60%</span>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-blue-600">{risks.length}</div>
          <div className="text-sm text-gray-600">Total Risks</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {risks.filter(r => r.impact === 'High').length}
          </div>
          <div className="text-sm text-gray-600">High Impact</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {risks.filter(r => r.status === 'prepared').length}
          </div>
          <div className="text-sm text-gray-600">Prepared</div>
        </Card>
        <Card padding="normal" className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {risks.filter(r => r.status === 'identified').length}
          </div>
          <div className="text-sm text-gray-600">Need Planning</div>
        </Card>
      </div>

      {/* Add Risk Form */}
      {showAddRiskForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add Risk Scenario</h2>
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => setShowAddRiskForm(false)}
              >
                Cancel
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Risk Scenario"
                value={newRisk.scenario}
                onChange={(e) => setNewRisk({ ...newRisk, scenario: e.target.value })}
                placeholder="Describe the potential risk"
                required
              />
              <Input
                label="Assigned Owner"
                value={newRisk.owner}
                onChange={(e) => setNewRisk({ ...newRisk, owner: e.target.value })}
                placeholder="Who will handle this risk?"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Impact Level</label>
                <select
                  value={newRisk.impact}
                  onChange={(e) => setNewRisk({ ...newRisk, impact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Probability</label>
                <select
                  value={newRisk.probability}
                  onChange={(e) => setNewRisk({ ...newRisk, probability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contingency Plan</label>
              <textarea
                value={newRisk.plan}
                onChange={(e) => setNewRisk({ ...newRisk, plan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="3"
                placeholder="Describe the backup plan or mitigation strategy"
                required
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddRiskForm(false)}>
                Cancel
              </Button>
              <Button onClick={addRisk} className="flex items-center space-x-2">
                <SafeIcon icon={FiPlus} />
                <span>Add Risk</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Risk Matrix */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Assessment Matrix</h2>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-4 gap-2 min-w-full">
            {/* Header */}
            <div className="p-3 bg-gray-100 font-medium text-center">Impact / Probability</div>
            <div className="p-3 bg-gray-100 font-medium text-center">Low</div>
            <div className="p-3 bg-gray-100 font-medium text-center">Medium</div>
            <div className="p-3 bg-gray-100 font-medium text-center">High</div>
            
            {/* High Impact */}
            <div className="p-3 bg-red-100 font-medium text-center">High</div>
            <div className="p-3 bg-yellow-100 text-center min-h-16 flex items-center justify-center">
              {risks.filter(r => r.impact === 'High' && r.probability === 'Low').length}
            </div>
            <div className="p-3 bg-orange-100 text-center min-h-16 flex items-center justify-center">
              {risks.filter(r => r.impact === 'High' && r.probability === 'Medium').length}
            </div>
            <div className="p-3 bg-red-100 text-center min-h-16 flex items-center justify-center">
              {risks.filter(r => r.impact === 'High' && r.probability === 'High').length}
            </div>
            
            {/* Medium Impact */}
            <div className="p-3 bg-yellow-100 font-medium text-center">Medium</div>
            <div className="p-3 bg-green-100 text-center min-h-16 flex items-center justify-center">
              {risks.filter(r => r.impact === 'Medium' && r.probability === 'Low').length}
            </div>
            <div className="p-3 bg-yellow-100 text-center min-h-16 flex items-center justify-center">
              {risks.filter(r => r.impact === 'Medium' && r.probability === 'Medium').length}
            </div>
            <div className="p-3 bg-orange-100 text-center min-h-16 flex items-center justify-center">
              {risks.filter(r => r.impact === 'Medium' && r.probability === 'High').length}
            </div>
            
            {/* Low Impact */}
            <div className="p-3 bg-green-100 font-medium text-center">Low</div>
            <div className="p-3 bg-green-100 text-center min-h-16 flex items-center justify-center">
              {risks.filter(r => r.impact === 'Low' && r.probability === 'Low').length}
            </div>
            <div className="p-3 bg-green-100 text-center min-h-16 flex items-center justify-center">
              {risks.filter(r => r.impact === 'Low' && r.probability === 'Medium').length}
            </div>
            <div className="p-3 bg-yellow-100 text-center min-h-16 flex items-center justify-center">
              {risks.filter(r => r.impact === 'Low' && r.probability === 'High').length}
            </div>
          </div>
        </div>
      </Card>

      {/* Risk List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Risk Register</h2>
          <Button 
            onClick={() => setShowAddRiskForm(true)}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Risk</span>
          </Button>
        </div>
        <div className="space-y-4">
          {risks.map(risk => (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{risk.scenario}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[risk.status]}`}>
                      {risk.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Impact:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColors[risk.impact]}`}>
                        {risk.impact}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Probability:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColors[risk.probability]}`}>
                        {risk.probability}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Owner:</span> {risk.owner}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Plan:</span> {risk.plan}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="flex space-x-1">
                    <Button
                      variant={risk.status === 'identified' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => updateRiskStatus(risk.id, 'identified')}
                    >
                      Identified
                    </Button>
                    <Button
                      variant={risk.status === 'planned' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => updateRiskStatus(risk.id, 'planned')}
                    >
                      Planned
                    </Button>
                    <Button
                      variant={risk.status === 'prepared' ? 'success' : 'outline'}
                      size="small"
                      onClick={() => updateRiskStatus(risk.id, 'prepared')}
                    >
                      Prepared
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Emergency Communications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emergency Contacts */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <SafeIcon icon={FiPhone} className="text-red-600" />
              <span>Emergency Contacts</span>
            </h2>
            <Button 
              onClick={() => setShowEditContactForm(true)}
              className="flex items-center space-x-2"
              size="small"
            >
              <SafeIcon icon={FiPlus} />
              <span>Add Contact</span>
            </Button>
          </div>
          
          {/* Add/Edit Contact Form */}
          {showEditContactForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <h3 className="font-medium text-gray-900 mb-4">
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title/Role"
                  value={newContact.title}
                  onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                  placeholder="e.g., Lead Planner"
                  required
                />
                <Input
                  label="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Contact person name"
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="555-0123"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Type</label>
                  <select
                    value={newContact.role}
                    onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="primary">Primary Contact</option>
                    <option value="secondary">Secondary Contact</option>
                    <option value="vendor">Vendor/Service</option>
                    <option value="emergency">Emergency Service</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <Button variant="outline" size="small" onClick={cancelContactForm}>
                  Cancel
                </Button>
                <Button size="small" onClick={addContact} className="flex items-center space-x-2">
                  <SafeIcon icon={FiSave} />
                  <span>{editingContact ? 'Update' : 'Add'} Contact</span>
                </Button>
              </div>
            </motion.div>
          )}

          <div className="space-y-3">
            {emergencyContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{contact.title}:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[contact.role]}`}>
                      {contact.role}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {contact.name} - {contact.phone}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => editContact(contact)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiEdit} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => removeContact(contact.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <SafeIcon icon={FiX} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Communication Plan */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <SafeIcon icon={FiMessageSquare} className="text-blue-600" />
              <span>Communication Plan</span>
            </h2>
            <Button 
              onClick={() => setShowEditCommPlanForm(true)}
              className="flex items-center space-x-2"
              size="small"
            >
              <SafeIcon icon={FiPlus} />
              <span>Add Method</span>
            </Button>
          </div>

          {/* Add/Edit Communication Plan Form */}
          {showEditCommPlanForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <h3 className="font-medium text-gray-900 mb-4">
                {editingCommPlan ? 'Edit Communication Method' : 'Add Communication Method'}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                    <select
                      value={newCommPlan.priority}
                      onChange={(e) => setNewCommPlan({ ...newCommPlan, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select priority</option>
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Public">Public</option>
                    </select>
                  </div>
                  <Input
                    label="Communication Method"
                    value={newCommPlan.method}
                    onChange={(e) => setNewCommPlan({ ...newCommPlan, method: e.target.value })}
                    placeholder="e.g., Text message group"
                    required
                  />
                </div>
                <Input
                  label="Description"
                  value={newCommPlan.description}
                  onChange={(e) => setNewCommPlan({ ...newCommPlan, description: e.target.value })}
                  placeholder="Describe when and how this method is used"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <Button variant="outline" size="small" onClick={cancelCommPlanForm}>
                  Cancel
                </Button>
                <Button size="small" onClick={addCommPlan} className="flex items-center space-x-2">
                  <SafeIcon icon={FiSave} />
                  <span>{editingCommPlan ? 'Update' : 'Add'} Method</span>
                </Button>
              </div>
            </motion.div>
          )}

          <div className="space-y-3">
            {communicationPlan.map(plan => (
              <div key={plan.id} className="p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[plan.priority]}`}>
                        {plan.priority}
                      </span>
                      <span className="font-medium text-gray-900">{plan.method}</span>
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => editCommPlan(plan)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <SafeIcon icon={FiEdit} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => removeCommPlan(plan.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <SafeIcon icon={FiX} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContingencyChapter;