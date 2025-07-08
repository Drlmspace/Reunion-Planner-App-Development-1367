import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useReunion } from '../../contexts/ReunionContext';
import Button from '../UI/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUser, FiLogOut, FiSettings } = FiIcons;

const Header = () => {
  const { user, signOut } = useAuth();
  const { currentReunion } = useReunion();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentReunion ? currentReunion.title : 'Select a Reunion'}
            </h1>
            {currentReunion && (
              <p className="text-sm text-gray-600 mt-1">
                {currentReunion.type} • {currentReunion.planned_date ? 
                  new Date(currentReunion.planned_date).toLocaleDateString() : 'Date TBD'}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiUser} className="text-lg" />
              <span>{user?.email}</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                DEV MODE
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="small"
              onClick={signOut}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiSettings} className="text-lg" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;