import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useReunion } from '../../contexts/ReunionContext';
import Button from '../UI/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUser, FiSettings, FiStar } = FiIcons;

const Header = () => {
  const { user, signOut } = useAuth();
  const { currentReunion } = useReunion();

  return (
    <header className="glass-card m-4 mb-0">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full gradient-bg-3 flex items-center justify-center float">
              <SafeIcon icon={FiStar} className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white-glass">
                {currentReunion ? currentReunion.title : 'Select a Reunion'}
              </h1>
              {currentReunion && (
                <p className="text-white/70 mt-1">
                  {currentReunion.type} • {currentReunion.planned_date ? new Date(currentReunion.planned_date).toLocaleDateString() : 'Date TBD'}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-white/80">
              <div className="w-8 h-8 rounded-full gradient-bg-2 flex items-center justify-center">
                <SafeIcon icon={FiUser} className="text-sm text-white" />
              </div>
              <span className="text-sm font-medium">{user?.email}</span>
              <span className="px-3 py-1 gradient-bg-5 text-white text-xs rounded-full font-medium">
                DEV MODE
              </span>
            </div>
            
            <Button 
              variant="glass" 
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