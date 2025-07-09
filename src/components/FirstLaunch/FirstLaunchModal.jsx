import React, {useState} from 'react';
import {motion} from 'framer-motion';
import Button from '../UI/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {FiShield, FiSmartphone, FiExternalLink, FiX, FiMonitor} = FiIcons;

const FirstLaunchModal = ({onAccept, onDecline}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    // Save acceptance to localStorage
    localStorage.setItem('termsAccepted', 'true');
    localStorage.setItem('termsAcceptedDate', new Date().toISOString());
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    setIsVisible(false);
    onDecline();
  };

  const openPrivacyPolicy = () => {
    window.open('https://app.getterms.io/policy/sBtei/app-privacy', '_blank', 'noopener,noreferrer');
  };

  const openTermsOfService = () => {
    window.open('https://app.getterms.io/view/sBtei/terms-of-service/en-us', '_blank', 'noopener,noreferrer');
  };

  const openAcceptableUsePolicy = () => {
    window.open('https://app.getterms.io/policy/sBtei/acceptable-use', '_blank', 'noopener,noreferrer');
  };

  // Add a reset function for testing
  const resetTermsForTesting = () => {
    localStorage.removeItem('termsAccepted');
    localStorage.removeItem('termsAcceptedDate');
    window.location.reload();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{opacity: 0, scale: 0.9, y: 20}}
        animate={{opacity: 1, scale: 1, y: 0}}
        transition={{duration: 0.3}}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full inline-flex mb-4">
              <SafeIcon icon={FiShield} className="text-3xl text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to The Reunion Curator - Important Use Information
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Before you begin, please review our data practices
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <div className="text-center text-gray-700 dark:text-gray-300 mb-6">
            <p className="font-medium mb-4">Before you begin, please note:</p>
          </div>

          {/* Desktop recommended notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full flex-shrink-0">
                <SafeIcon icon={FiMonitor} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💻 Best Experienced on Desktop
                </h3>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <p>• This application is designed for optimal use on desktop devices</p>
                  <p>• While mobile compatible, desktop provides the best experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Local Data Storage Section */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full flex-shrink-0">
                <SafeIcon icon={FiSmartphone} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  📱 Local Data Storage
                </h3>
                <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <p>• All information you share will be saved locally on this device only</p>
                  <p>• Your data is not sent to external servers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account & Advertising Section */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full flex-shrink-0">
                <SafeIcon icon={FiShield} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  🔐 Account & Advertising
                </h3>
                <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <p>• Your login credentials and password will be stored and may be used for advertising purposes by the app owner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Text */}
          <div className="text-center text-gray-700 dark:text-gray-300">
            <p className="text-sm">
              By continuing, you agree to our{' '}
              <button
                onClick={openPrivacyPolicy}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium"
              >
                Privacy Policy
              </button>
              ,{' '}
              <button
                onClick={openTermsOfService}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium"
              >
                Terms of Service
              </button>
              , and{' '}
              <button
                onClick={openAcceptableUsePolicy}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium"
              >
                Acceptable Use Policy
              </button>
              .
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Primary Action */}
          <Button
            onClick={handleAccept}
            fullWidth
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          >
            I Agree & Continue
          </Button>

          {/* Policy Links */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={openPrivacyPolicy}
              className="flex items-center justify-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <span>View Privacy Policy</span>
              <SafeIcon icon={FiExternalLink} className="text-xs" />
            </button>
            <button
              onClick={openTermsOfService}
              className="flex items-center justify-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <span>View Terms of Service</span>
              <SafeIcon icon={FiExternalLink} className="text-xs" />
            </button>
            <button
              onClick={openAcceptableUsePolicy}
              className="flex items-center justify-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <span>View Acceptable Use Policy</span>
              <SafeIcon icon={FiExternalLink} className="text-xs" />
            </button>
          </div>

          {/* Secondary Action */}
          <Button
            onClick={handleDecline}
            variant="outline"
            fullWidth
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>

          {/* Testing Helper - Remove in production */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={resetTermsForTesting}
              className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              Reset Terms (for testing)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FirstLaunchModal;