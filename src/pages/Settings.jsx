import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useReunion } from '../contexts/ReunionContext';
import { isSupabaseAvailable } from '../lib/supabase';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiSettings, FiUser, FiBell, FiDatabase, FiEye, FiSave, FiTrash2, FiDownload, FiUpload, FiRefreshCw, FiShield, FiMoon, FiSun, FiGlobe } = FiIcons;

const Settings = () => {
  const { user } = useAuth();
  const { currentReunion, reunions, updateReunion } = useReunion();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  // Account settings state
  const [accountData, setAccountData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // App preferences state
  const [preferences, setPreferences] = useState({
    theme: localStorage.getItem('theme') || 'light',
    currency: localStorage.getItem('currency') || 'USD',
    dateFormat: localStorage.getItem('dateFormat') || 'MM/DD/YYYY',
    language: localStorage.getItem('language') || 'en',
    autoSave: localStorage.getItem('autoSave') !== 'false'
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: localStorage.getItem('emailNotifications') !== 'false',
    pushNotifications: localStorage.getItem('pushNotifications') !== 'false',
    weeklyDigest: localStorage.getItem('weeklyDigest') !== 'false',
    taskReminders: localStorage.getItem('taskReminders') !== 'false',
    budgetAlerts: localStorage.getItem('budgetAlerts') !== 'false',
    rsvpUpdates: localStorage.getItem('rsvpUpdates') !== 'false'
  });

  // Reunion settings state
  const [reunionSettings, setReunionSettings] = useState({
    title: currentReunion?.title || '',
    description: currentReunion?.description || '',
    type: currentReunion?.type || 'family',
    plannedDate: currentReunion?.planned_date || '',
    isPublic: false,
    allowGuestInvites: true,
    rsvpDeadline: '',
    maxAttendees: ''
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    shareContactInfo: true,
    allowMessages: true,
    dataRetention: '2years'
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: FiUser },
    { id: 'reunion', label: 'Reunion Settings', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'preferences', label: 'Preferences', icon: FiEye },
    { id: 'privacy', label: 'Privacy', icon: FiShield },
    { id: 'data', label: 'Data & Backup', icon: FiDatabase }
  ];

  useEffect(() => {
    if (currentReunion) {
      setReunionSettings({
        title: currentReunion.title || '',
        description: currentReunion.description || '',
        type: currentReunion.type || 'family',
        plannedDate: currentReunion.planned_date || '',
        isPublic: false,
        allowGuestInvites: true,
        rsvpDeadline: '',
        maxAttendees: ''
      });
    }
  }, [currentReunion]);

  const saveAccountSettings = async () => {
    setLoading(true);
    try {
      // In a real app, this would update the user profile via Supabase
      // For now, we'll just save to localStorage and show success
      localStorage.setItem('userProfile', JSON.stringify(accountData));
      toast.success('Account settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save account settings');
    } finally {
      setLoading(false);
    }
  };

  const saveReunionSettings = async () => {
    if (!currentReunion) {
      toast.error('No reunion selected');
      return;
    }

    setLoading(true);
    try {
      await updateReunion(currentReunion.id, {
        title: reunionSettings.title,
        description: reunionSettings.description,
        type: reunionSettings.type,
        planned_date: reunionSettings.plannedDate
      });
      toast.success('Reunion settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update reunion settings');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = () => {
    Object.entries(preferences).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });

    // Apply theme immediately
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    toast.success('Preferences saved successfully!');
  };

  const saveNotificationSettings = () => {
    Object.entries(notifications).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
    toast.success('Notification settings saved successfully!');
  };

  const savePrivacySettings = () => {
    Object.entries(privacySettings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
    toast.success('Privacy settings saved successfully!');
  };

  const exportData = () => {
    const data = {
      reunions,
      accountData,
      preferences,
      notifications,
      privacySettings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reunion-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate the data structure
        if (data.reunions && data.accountData) {
          // In a real app, you'd restore this data to the database
          localStorage.setItem('importedData', JSON.stringify(data));
          toast.success('Data imported successfully! Please refresh the page.');
        } else {
          toast.error('Invalid backup file format');
        }
      } catch (error) {
        toast.error('Failed to import data - invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Clear specific reunion planner data
      const keysToRemove = [
        'demoReunions', 'currentReunion', 'userProfile', 'theme', 'currency',
        'dateFormat', 'language', 'autoSave', 'emailNotifications', 'pushNotifications',
        'weeklyDigest', 'taskReminders', 'budgetAlerts', 'rsvpUpdates'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      toast.success('All data cleared successfully! Please refresh the page.');
      
      // Refresh after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      setPreferences({
        theme: 'light',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'en',
        autoSave: true
      });
      
      setNotifications({
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: true,
        taskReminders: true,
        budgetAlerts: true,
        rsvpUpdates: true
      });

      setPrivacySettings({
        profileVisibility: 'public',
        shareContactInfo: true,
        allowMessages: true,
        dataRetention: '2years'
      });

      toast.success('Settings reset to defaults');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account, reunion settings, and preferences.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiSettings} className="text-2xl text-blue-600" />
          {!isSupabaseAvailable && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Demo Mode
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SafeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Account Settings */}
      {activeTab === 'account' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                value={accountData.firstName}
                onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                value={accountData.lastName}
                onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={accountData.email}
                onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                disabled={isSupabaseAvailable}
                helper={isSupabaseAvailable ? "Email cannot be changed when using Supabase backend" : ""}
              />
              <Input
                label="Phone"
                type="tel"
                value={accountData.phone}
                onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                placeholder="Your phone number"
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone
                </label>
                <select
                  value={accountData.timezone}
                  onChange={(e) => setAccountData({ ...accountData, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={saveAccountSettings}
                loading={loading}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} />
                <span>Save Account Settings</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Reunion Settings */}
      {activeTab === 'reunion' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Current Reunion Settings
            </h2>
            {currentReunion ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Reunion Title"
                    value={reunionSettings.title}
                    onChange={(e) => setReunionSettings({ ...reunionSettings, title: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reunion Type
                    </label>
                    <select
                      value={reunionSettings.type}
                      onChange={(e) => setReunionSettings({ ...reunionSettings, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="family">Family Reunion</option>
                      <option value="class">Class Reunion</option>
                      <option value="military">Military Reunion</option>
                      <option value="corporate">Corporate Reunion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Planned Date"
                    type="date"
                    value={reunionSettings.plannedDate}
                    onChange={(e) => setReunionSettings({ ...reunionSettings, plannedDate: e.target.value })}
                  />
                  <Input
                    label="Max Attendees"
                    type="number"
                    value={reunionSettings.maxAttendees}
                    onChange={(e) => setReunionSettings({ ...reunionSettings, maxAttendees: e.target.value })}
                    placeholder="Leave blank for unlimited"
                  />
                </div>
                <div>
                  <Input
                    label="Description"
                    value={reunionSettings.description}
                    onChange={(e) => setReunionSettings({ ...reunionSettings, description: e.target.value })}
                    placeholder="Describe your reunion..."
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowGuestInvites"
                      checked={reunionSettings.allowGuestInvites}
                      onChange={(e) => setReunionSettings({ ...reunionSettings, allowGuestInvites: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="allowGuestInvites" className="text-sm text-gray-700">
                      Allow attendees to bring guests
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={reunionSettings.isPublic}
                      onChange={(e) => setReunionSettings({ ...reunionSettings, isPublic: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">
                      Make reunion publicly discoverable
                    </label>
                  </div>
                </div>
                <Button
                  onClick={saveReunionSettings}
                  loading={loading}
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={FiSave} />
                  <span>Save Reunion Settings</span>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No reunion selected</p>
                <p className="text-sm text-gray-400">Create or select a reunion to configure its settings</p>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser notifications for important updates' },
                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of reunion planning progress' },
                { key: 'taskReminders', label: 'Task Reminders', desc: 'Reminders for upcoming deadlines' },
                { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Notifications when budget limits are exceeded' },
                { key: 'rsvpUpdates', label: 'RSVP Updates', desc: 'Notifications when people respond to invitations' }
              ].map((setting) => (
                <div key={setting.key} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <input
                    type="checkbox"
                    id={setting.key}
                    checked={notifications[setting.key]}
                    onChange={(e) => setNotifications({ ...notifications, [setting.key]: e.target.checked })}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label htmlFor={setting.key} className="font-medium text-gray-900">
                      {setting.label}
                    </label>
                    <p className="text-sm text-gray-600">{setting.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button
                onClick={saveNotificationSettings}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} />
                <span>Save Notification Settings</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Preferences */}
      {activeTab === 'preferences' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">App Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                      preferences.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <SafeIcon icon={FiSun} />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                      preferences.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <SafeIcon icon={FiMoon} />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={preferences.autoSave}
                  onChange={(e) => setPreferences({ ...preferences, autoSave: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoSave" className="text-sm text-gray-700">
                  Enable auto-save for forms
                </label>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button
                onClick={savePreferences}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} />
                <span>Save Preferences</span>
              </Button>
              <Button
                onClick={resetToDefaults}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiRefreshCw} />
                <span>Reset to Defaults</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Privacy Settings */}
      {activeTab === 'privacy' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Visibility
                </label>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public - Anyone can see my profile</option>
                  <option value="reunion">Reunion Members - Only reunion participants</option>
                  <option value="private">Private - Only me</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Retention
                </label>
                <select
                  value={privacySettings.dataRetention}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, dataRetention: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1year">1 Year</option>
                  <option value="2years">2 Years</option>
                  <option value="5years">5 Years</option>
                  <option value="indefinite">Indefinite</option>
                </select>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'shareContactInfo', label: 'Share Contact Information', desc: 'Allow other reunion members to see your contact details' },
                  { key: 'allowMessages', label: 'Allow Messages', desc: 'Let other members send you messages through the app' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      id={setting.key}
                      checked={privacySettings[setting.key]}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, [setting.key]: e.target.checked })}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label htmlFor={setting.key} className="font-medium text-gray-900">
                        {setting.label}
                      </label>
                      <p className="text-sm text-gray-600">{setting.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={savePrivacySettings}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} />
                <span>Save Privacy Settings</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Data & Backup */}
      {activeTab === 'data' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
            
            {/* Connection Status */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Connection Status</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isSupabaseAvailable ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isSupabaseAvailable ? 'Connected to Supabase Backend' : 'Running in Demo Mode (Local Storage)'}
                </span>
              </div>
              {!isSupabaseAvailable && (
                <p className="text-xs text-gray-500 mt-1">
                  Data is stored locally in your browser. Connect Supabase for cloud storage.
                </p>
              )}
            </div>

            {/* Data Export/Import */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Backup & Restore</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Download all your reunion data as a JSON file for backup purposes.
                  </p>
                  <Button
                    onClick={exportData}
                    variant="outline"
                    className="flex items-center space-x-2 w-full"
                  >
                    <SafeIcon icon={FiDownload} />
                    <span>Export Data</span>
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Import Data</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Restore your data from a previously exported backup file.
                  </p>
                  <label className="block">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 w-full cursor-pointer"
                      as="span"
                    >
                      <SafeIcon icon={FiUpload} />
                      <span>Import Data</span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* Storage Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Storage Information</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• Total Reunions: {reunions.length}</p>
                <p>• Storage Used: ~{Math.round(JSON.stringify(reunions).length / 1024)} KB</p>
                <p>• Last Backup: {localStorage.getItem('lastBackup') || 'Never'}</p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 mb-4">
                These actions are irreversible. Please be certain before proceeding.
              </p>
              <Button
                onClick={clearAllData}
                variant="danger"
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiTrash2} />
                <span>Clear All Data</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;