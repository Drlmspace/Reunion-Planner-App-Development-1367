import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiBookOpen, FiStar, FiTrendingUp, FiHeart, FiUsers, FiTarget, FiEdit3, FiSave, FiX, FiPlus, FiTrash2 } = FiIcons;

const DebriefChapter = () => {
  const [activeTab, setActiveTab] = useState('feedback');

  // Editable performance metrics
  const [metrics, setMetrics] = useState({
    attendance: { planned: 100, actual: 87, percentage: 87 },
    budget: { planned: 5000, actual: 4750, percentage: 95 },
    satisfaction: { average: 4.6, responses: 42 },
    timeline: { onTime: 85, percentage: 85 }
  });

  const [editingMetrics, setEditingMetrics] = useState(false);
  const [tempMetrics, setTempMetrics] = useState({ ...metrics });

  // Editable feedback/testimonials
  const [feedback, setFeedback] = useState([
    { id: 1, name: 'John Smith', rating: 5, comment: 'Amazing event! Great organization and wonderful memories.', category: 'Overall' },
    { id: 2, name: 'Sarah Johnson', rating: 4, comment: 'Food was excellent, would love more time for mingling.', category: 'Food' },
    { id: 3, name: 'Mike Davis', rating: 5, comment: 'Perfect venue choice and great activities for all ages.', category: 'Venue' }
  ]);

  const [showAddFeedbackForm, setShowAddFeedbackForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ name: '', rating: 5, comment: '', category: 'Overall' });

  // Editable Legacy Documentation
  const [legacyDocs, setLegacyDocs] = useState({
    eventArchive: [
      '📸 Photo collection (250+ photos)',
      '🎥 Video highlights (45 minutes)',
      '📋 Complete planning documents',
      '📊 Final budget and vendor list'
    ],
    nextSteps: [
      '🔄 Share photos with attendees',
      '📧 Send thank you messages',
      '📅 Schedule next reunion date',
      '📝 Create planning template for future'
    ]
  });

  const [editingLegacy, setEditingLegacy] = useState(false);
  const [tempLegacyDocs, setTempLegacyDocs] = useState({ ...legacyDocs });
  const [newArchiveItem, setNewArchiveItem] = useState('');
  const [newNextStepItem, setNewNextStepItem] = useState('');

  const [reflections, setReflections] = useState({
    successes: '',
    challenges: '',
    improvements: '',
    highlights: '',
    futureEvents: ''
  });

  const avgRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;

  const feedbackCategories = ['Overall', 'Food', 'Venue', 'Entertainment', 'Organization', 'Activities'];

  // Metrics editing functions
  const saveMetrics = () => {
    setMetrics(tempMetrics);
    setEditingMetrics(false);
  };

  const cancelMetricsEdit = () => {
    setTempMetrics({ ...metrics });
    setEditingMetrics(false);
  };

  // Feedback management functions
  const addFeedback = () => {
    if (newFeedback.name && newFeedback.comment) {
      setFeedback([...feedback, { ...newFeedback, id: Date.now() }]);
      setNewFeedback({ name: '', rating: 5, comment: '', category: 'Overall' });
      setShowAddFeedbackForm(false);
    }
  };

  const removeFeedback = (id) => {
    setFeedback(feedback.filter(f => f.id !== id));
  };

  // Legacy documentation functions
  const addArchiveItem = () => {
    if (newArchiveItem.trim()) {
      setTempLegacyDocs({
        ...tempLegacyDocs,
        eventArchive: [...tempLegacyDocs.eventArchive, newArchiveItem.trim()]
      });
      setNewArchiveItem('');
    }
  };

  const removeArchiveItem = (index) => {
    setTempLegacyDocs({
      ...tempLegacyDocs,
      eventArchive: tempLegacyDocs.eventArchive.filter((_, i) => i !== index)
    });
  };

  const addNextStepItem = () => {
    if (newNextStepItem.trim()) {
      setTempLegacyDocs({
        ...tempLegacyDocs,
        nextSteps: [...tempLegacyDocs.nextSteps, newNextStepItem.trim()]
      });
      setNewNextStepItem('');
    }
  };

  const removeNextStepItem = (index) => {
    setTempLegacyDocs({
      ...tempLegacyDocs,
      nextSteps: tempLegacyDocs.nextSteps.filter((_, i) => i !== index)
    });
  };

  const saveLegacyDocs = () => {
    setLegacyDocs(tempLegacyDocs);
    setEditingLegacy(false);
  };

  const cancelLegacyEdit = () => {
    setTempLegacyDocs({ ...legacyDocs });
    setEditingLegacy(false);
    setNewArchiveItem('');
    setNewNextStepItem('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 12: Debrief & Reflection</h1>
          <p className="text-gray-600 mt-1">
            Evaluate the event success and capture lessons learned for future reunions.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiBookOpen} className="text-2xl text-emerald-600" />
          <span className="text-sm text-gray-500">Progress: 90%</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'feedback', label: 'Feedback', icon: FiStar },
          { id: 'metrics', label: 'Performance', icon: FiTrendingUp },
          { id: 'reflections', label: 'Reflections', icon: FiHeart }
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

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-blue-600">{feedback.length}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{avgRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {feedback.filter(f => f.rating >= 4).length}
              </div>
              <div className="text-sm text-gray-600">Positive Reviews</div>
            </Card>
            <Card padding="normal" className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((feedback.length / 87) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </Card>
          </div>

          {/* Add Feedback Form */}
          {showAddFeedbackForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Add Attendee Feedback</h2>
                  <Button variant="ghost" size="small" onClick={() => setShowAddFeedbackForm(false)}>
                    <SafeIcon icon={FiX} />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Attendee Name"
                    value={newFeedback.name}
                    onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newFeedback.category}
                      onChange={(e) => setNewFeedback({ ...newFeedback, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {feedbackCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setNewFeedback({ ...newFeedback, rating })}
                          className="focus:outline-none"
                        >
                          <SafeIcon
                            icon={FiStar}
                            className={`text-2xl ${rating <= newFeedback.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows="3"
                    placeholder="Enter feedback comment..."
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowAddFeedbackForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addFeedback} className="flex items-center space-x-2">
                    <SafeIcon icon={FiPlus} />
                    <span>Add Feedback</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Attendee Feedback</h2>
              <Button onClick={() => setShowAddFeedbackForm(true)} className="flex items-center space-x-2">
                <SafeIcon icon={FiPlus} />
                <span>Add Feedback</span>
              </Button>
            </div>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>How to collect feedback:</strong> You can gather testimonials through post-event surveys, 
                direct interviews, social media comments, or feedback forms. Add them manually here to track 
                overall satisfaction and identify areas for improvement.
              </p>
            </div>
            <div className="space-y-4">
              {feedback.map(review => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{review.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <SafeIcon
                              key={i}
                              icon={FiStar}
                              className={`text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({review.rating}/5)</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {review.category}
                      </span>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => removeFeedback(review.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rating Distribution</h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = feedback.filter(f => f.rating === rating).length;
                const percentage = (count / feedback.length) * 100;
                return (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 w-20">
                      <span className="text-sm font-medium">{rating}</span>
                      <SafeIcon icon={FiStar} className="text-sm text-yellow-500" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Performance Metrics Tab */}
      {activeTab === 'metrics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Event Performance Dashboard</h2>
              {!editingMetrics ? (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setEditingMetrics(true)}
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={FiEdit3} />
                  <span>Edit Metrics</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={cancelMetricsEdit}
                    className="flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiX} />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    size="small"
                    onClick={saveMetrics}
                    className="flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} />
                    <span>Save</span>
                  </Button>
                </div>
              )}
            </div>

            {editingMetrics && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Data Collection Tips:</strong> Track attendance through registration/check-in lists. 
                  Measure satisfaction via post-event surveys. Monitor timeline by noting actual vs planned start times for events.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Attendance</h3>
                    <SafeIcon icon={FiUsers} className="text-blue-600" />
                  </div>
                  {editingMetrics ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm">Planned:</label>
                        <input
                          type="number"
                          value={tempMetrics.attendance.planned}
                          onChange={(e) => setTempMetrics({
                            ...tempMetrics,
                            attendance: {
                              ...tempMetrics.attendance,
                              planned: parseInt(e.target.value) || 0,
                              percentage: Math.round((tempMetrics.attendance.actual / (parseInt(e.target.value) || 1)) * 100)
                            }
                          })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm">Actual:</label>
                        <input
                          type="number"
                          value={tempMetrics.attendance.actual}
                          onChange={(e) => setTempMetrics({
                            ...tempMetrics,
                            attendance: {
                              ...tempMetrics.attendance,
                              actual: parseInt(e.target.value) || 0,
                              percentage: Math.round(((parseInt(e.target.value) || 0) / tempMetrics.attendance.planned) * 100)
                            }
                          })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {metrics.attendance.actual} / {metrics.attendance.planned}
                      </div>
                      <div className="text-sm text-gray-600">
                        {metrics.attendance.percentage}% attendance rate
                      </div>
                    </>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${editingMetrics ? tempMetrics.attendance.percentage : metrics.attendance.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Budget</h3>
                    <SafeIcon icon={FiTarget} className="text-green-600" />
                  </div>
                  {editingMetrics ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm">Planned:</label>
                        <input
                          type="number"
                          value={tempMetrics.budget.planned}
                          onChange={(e) => setTempMetrics({
                            ...tempMetrics,
                            budget: {
                              ...tempMetrics.budget,
                              planned: parseInt(e.target.value) || 0,
                              percentage: Math.round((tempMetrics.budget.actual / (parseInt(e.target.value) || 1)) * 100)
                            }
                          })}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm">Actual:</label>
                        <input
                          type="number"
                          value={tempMetrics.budget.actual}
                          onChange={(e) => setTempMetrics({
                            ...tempMetrics,
                            budget: {
                              ...tempMetrics.budget,
                              actual: parseInt(e.target.value) || 0,
                              percentage: Math.round(((parseInt(e.target.value) || 0) / tempMetrics.budget.planned) * 100)
                            }
                          })}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        ${metrics.budget.actual} / ${metrics.budget.planned}
                      </div>
                      <div className="text-sm text-gray-600">
                        {metrics.budget.percentage}% of budget used
                      </div>
                    </>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${editingMetrics ? tempMetrics.budget.percentage : metrics.budget.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Satisfaction</h3>
                    <SafeIcon icon={FiStar} className="text-yellow-600" />
                  </div>
                  {editingMetrics ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm">Average:</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={tempMetrics.satisfaction.average}
                          onChange={(e) => setTempMetrics({
                            ...tempMetrics,
                            satisfaction: {
                              ...tempMetrics.satisfaction,
                              average: parseFloat(e.target.value) || 0
                            }
                          })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm">Responses:</label>
                        <input
                          type="number"
                          value={tempMetrics.satisfaction.responses}
                          onChange={(e) => setTempMetrics({
                            ...tempMetrics,
                            satisfaction: {
                              ...tempMetrics.satisfaction,
                              responses: parseInt(e.target.value) || 0
                            }
                          })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {metrics.satisfaction.average}/5.0
                      </div>
                      <div className="text-sm text-gray-600">
                        {metrics.satisfaction.responses} responses
                      </div>
                    </>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${((editingMetrics ? tempMetrics.satisfaction.average : metrics.satisfaction.average) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Timeline</h3>
                    <SafeIcon icon={FiTrendingUp} className="text-purple-600" />
                  </div>
                  {editingMetrics ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm">On Time %:</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={tempMetrics.timeline.onTime}
                          onChange={(e) => setTempMetrics({
                            ...tempMetrics,
                            timeline: {
                              onTime: parseInt(e.target.value) || 0,
                              percentage: parseInt(e.target.value) || 0
                            }
                          })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {metrics.timeline.onTime}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Events started on time
                      </div>
                    </>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${editingMetrics ? tempMetrics.timeline.percentage : metrics.timeline.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Chapter Completion Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Vision & Intention', completion: 100 },
                { name: 'Planning Committee', completion: 95 },
                { name: 'Date & Budget', completion: 100 },
                { name: 'Venue Planning', completion: 100 },
                { name: 'Program Builder', completion: 90 },
                { name: 'Communication', completion: 85 },
                { name: 'RSVP Management', completion: 100 },
                { name: 'Travel & Lodging', completion: 80 },
                { name: 'Food & Beverage', completion: 95 },
                { name: 'Vendor Management', completion: 100 },
                { name: 'Contingency Planning', completion: 75 },
                { name: 'Debrief & Reflection', completion: 90 }
              ].map((chapter, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{chapter.name}</h3>
                    <span className="text-xs text-gray-500">{chapter.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        chapter.completion === 100 ? 'bg-green-500' : 
                        chapter.completion >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${chapter.completion}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Reflections Tab */}
      {activeTab === 'reflections' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Reflection</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What were the biggest successes?
                </label>
                <textarea
                  value={reflections.successes}
                  onChange={(e) => setReflections({ ...reflections, successes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows="3"
                  placeholder="Describe what went exceptionally well..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What challenges did you face?
                </label>
                <textarea
                  value={reflections.challenges}
                  onChange={(e) => setReflections({ ...reflections, challenges: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows="3"
                  placeholder="What obstacles or difficulties arose?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you improve for next time?
                </label>
                <textarea
                  value={reflections.improvements}
                  onChange={(e) => setReflections({ ...reflections, improvements: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows="3"
                  placeholder="Areas for improvement and lessons learned..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What were the most memorable moments?
                </label>
                <textarea
                  value={reflections.highlights}
                  onChange={(e) => setReflections({ ...reflections, highlights: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows="3"
                  placeholder="Special moments and highlights to remember..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plans for future reunions?
                </label>
                <textarea
                  value={reflections.futureEvents}
                  onChange={(e) => setReflections({ ...reflections, futureEvents: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows="3"
                  placeholder="Ideas and commitments for future events..."
                />
              </div>
              <Button className="flex items-center space-x-2">
                <SafeIcon icon={FiBookOpen} />
                <span>Save Reflections</span>
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Legacy Documentation</h2>
              {!editingLegacy ? (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setEditingLegacy(true)}
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={FiEdit3} />
                  <span>Edit Documentation</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={cancelLegacyEdit}
                    className="flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiX} />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    size="small"
                    onClick={saveLegacyDocs}
                    className="flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} />
                    <span>Save Changes</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Event Archive</h3>
                {editingLegacy ? (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newArchiveItem}
                        onChange={(e) => setNewArchiveItem(e.target.value)}
                        placeholder="Add archive item..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <Button size="small" onClick={addArchiveItem}>Add</Button>
                    </div>
                    <div className="space-y-2">
                      {tempLegacyDocs.eventArchive.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                          <span className="flex-1">{item}</span>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => removeArchiveItem(index)}
                            className="text-red-500"
                          >
                            <SafeIcon icon={FiTrash2} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-gray-600">
                    {legacyDocs.eventArchive.map((item, index) => (
                      <div key={index}>{item}</div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Next Steps</h3>
                {editingLegacy ? (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newNextStepItem}
                        onChange={(e) => setNewNextStepItem(e.target.value)}
                        placeholder="Add next step..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <Button size="small" onClick={addNextStepItem}>Add</Button>
                    </div>
                    <div className="space-y-2">
                      {tempLegacyDocs.nextSteps.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                          <span className="flex-1">{item}</span>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => removeNextStepItem(index)}
                            className="text-red-500"
                          >
                            <SafeIcon icon={FiTrash2} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-gray-600">
                    {legacyDocs.nextSteps.map((item, index) => (
                      <div key={index}>{item}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DebriefChapter;