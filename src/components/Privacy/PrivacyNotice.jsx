import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {format} from 'date-fns';
import Button from '../UI/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {FiShield, FiAlertCircle, FiMail, FiInfo} = FiIcons;

const PrivacyNotice = ({onAccept, onDecline}) => {
  const [isVisible, setIsVisible] = useState(true);
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  const appName = 'The Reunion Curator';

  const handleAccept = () => {
    localStorage.setItem('privacyNoticeAccepted', 'true');
    localStorage.setItem('privacyNoticeDate', currentDate);
    setIsVisible(false);
    if (onAccept) onAccept();
  };

  const handleDecline = () => {
    setIsVisible(false);
    if (onDecline) onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-primary-600 dark:bg-primary-700 text-white p-6 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiShield} className="text-3xl" />
            <h2 className="text-2xl font-bold">
              Welcome to {appName} - Important Privacy Information
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Before you begin using this app, please review how we handle your information:
          </p>

          <div className="space-y-6">
            {/* Local Storage Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Local Storage Only</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-700 dark:text-blue-200">
                    <li>All information you share in this app will be saved locally on this device only</li>
                    <li>Your data remains private and is not sent to external servers</li>
                    <li>Clearing app data will remove all stored information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Account Information</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-yellow-700 dark:text-yellow-200">
                    <li>Your login credentials and password will be saved and may be used for advertising purposes</li>
                    <li>We may contact you with promotional offers and updates</li>
                    <li>This information is retained by the app owner</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Data Usage Section */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Additional Data Usage</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-green-700 dark:text-green-200">
                    <li>App usage patterns may be analyzed to improve user experience</li>
                    <li>Anonymous analytics may be collected for service enhancement</li>
                    <li>Session information is temporarily stored for app functionality</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Section */}
          <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              By continuing, you acknowledge and agree to:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Local storage of your information on this device</li>
              <li>Retention of your login credentials for advertising purposes</li>
              <li>Our data practices as outlined above</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
            <Button
              variant="outline"
              fullWidth
              onClick={handleDecline}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleAccept}
              className="bg-primary-600 hover:bg-primary-700"
            >
              I Agree & Continue
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiInfo} />
                <a
                  href="https://app.getterms.io/policy/sBtei/app-privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Privacy Policy
                </a>
                <span>for full details</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Last updated: {currentDate}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <SafeIcon icon={FiMail} />
              <span>Contact for privacy questions: </span>
              <a
                href="mailto:privacy@reunioncurator.app"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                privacy@reunioncurator.app
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyNotice;