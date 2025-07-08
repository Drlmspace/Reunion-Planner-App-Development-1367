import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useReunion } from '../../contexts/ReunionContext';
import Button from '../UI/Button';
import Input from '../UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { motion } from 'framer-motion';

const { FiUser, FiLogOut, FiSettings, FiEdit3, FiSave, FiX, FiShield } = FiIcons;

const Header = () => {
  const { user, signOut } = useAuth();
  const { currentReunion, updateReunion } = useReunion();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editTitle, setEditTitle] = useState(currentReunion?.title || '');
  const [editDate, setEditDate] = useState(currentReunion?.planned_date || '');

  const handleSaveTitle = async () => {
    if (editTitle.trim() && currentReunion) {
      await updateReunion(currentReunion.id, { title: editTitle });
      setIsEditingTitle(false);
    }
  };

  const handleSaveDate = async () => {
    if (editDate && currentReunion) {
      await updateReunion(currentReunion.id, { planned_date: editDate });
      setIsEditingDate(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(currentReunion?.title || '');
    setEditDate(currentReunion?.planned_date || '');
    setIsEditingTitle(false);
    setIsEditingDate(false);
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.user_metadata?.role === 'admin';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditingTitle ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3"
              >
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-xl font-bold"
                  placeholder="Enter reunion title"
                />
                <Button variant="ghost" size="small" onClick={handleSaveTitle}>
                  <SafeIcon icon={FiSave} className="text-green-600" />
                </Button>
                <Button variant="ghost" size="small" onClick={handleCancelEdit}>
                  <SafeIcon icon={FiX} className="text-red-600" />
                </Button>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentReunion ? currentReunion.title : 'Select a Reunion'}
                </h1>
                {currentReunion && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setIsEditingTitle(true)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiEdit3} />
                  </Button>
                )}
              </div>
            )}

            {currentReunion && (
              <div className="mt-1">
                {isEditingDate ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-sm text-gray-600">• {currentReunion.type}</span>
                    <Button variant="ghost" size="small" onClick={handleSaveDate}>
                      <SafeIcon icon={FiSave} className="text-green-600" />
                    </Button>
                    <Button variant="ghost" size="small" onClick={handleCancelEdit}>
                      <SafeIcon icon={FiX} className="text-red-600" />
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600">
                      {currentReunion.type} •{' '}
                      {currentReunion.planned_date
                        ? new Date(currentReunion.planned_date).toLocaleDateString()
                        : 'Date TBD'}
                    </p>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => setIsEditingDate(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <SafeIcon icon={FiEdit3} />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon
                  icon={isAdmin ? FiShield : FiUser}
                  className={`text-lg ${isAdmin ? 'text-blue-600' : ''}`}
                />
                <span>
                  {isAdmin ? 'Administrator' : user?.email}
                  {isAdmin && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="small"
              onClick={signOut}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiLogOut} className="text-lg" />
              <span>Sign Out</span>
            </Button>

            <Link to="/settings">
              <Button
                variant="ghost"
                size="small"
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiSettings} className="text-lg" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;