import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiExternalLink, FiShield, FiFileText, FiCheck } = FiIcons;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const policyLinks = [
    {
      title: 'Terms of Service',
      url: 'https://app.getterms.io/view/sBtei/terms-of-service/en-us',
      icon: FiFileText
    },
    {
      title: 'Privacy Policy',
      url: 'https://app.getterms.io/policy/sBtei/app-privacy',
      icon: FiShield
    },
    {
      title: 'Acceptable Use Policy',
      url: 'https://app.getterms.io/policy/sBtei/acceptable-use',
      icon: FiCheck
    }
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} Reunion Planner. All rights reserved.
          </div>

          {/* Policy Links */}
          <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6">
            {policyLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                <SafeIcon icon={link.icon} className="text-xs" />
                <span>{link.title}</span>
                <SafeIcon icon={FiExternalLink} className="text-xs opacity-60" />
              </a>
            ))}
          </div>
        </div>

        {/* Additional Footer Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400 space-y-2 md:space-y-0">
            <p>
              Reunion Planner helps you organize memorable family and class reunions with ease.
            </p>
            <p className="flex items-center space-x-1">
              <span>Made with</span>
              <span className="text-red-500">♥</span>
              <span>for bringing people together</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;