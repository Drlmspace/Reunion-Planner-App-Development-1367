import React, { useEffect, useState } from 'react';
import PrivacyNotice from './PrivacyNotice';

const PrivacyManager = ({ children }) => {
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if user has already accepted the privacy notice
    const privacyAccepted = localStorage.getItem('privacyNoticeAccepted');
    
    if (!privacyAccepted) {
      setShowPrivacyNotice(true);
    }
    
    setLoaded(true);
  }, []);

  const handleAccept = () => {
    setShowPrivacyNotice(false);
  };

  const handleDecline = () => {
    // Simply close the app or redirect to a "sorry" page
    window.location.href = 'about:blank';
    // Alternative if the above doesn't work in all browsers:
    // document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Thank You</h1><p>You must accept the privacy notice to use this application. Please close this window.</p></div>';
  };

  // Don't render anything until we've checked the privacy status
  if (!loaded) {
    return null;
  }

  return (
    <>
      {showPrivacyNotice && (
        <PrivacyNotice 
          onAccept={handleAccept} 
          onDecline={handleDecline} 
        />
      )}
      {children}
    </>
  );
};

export default PrivacyManager;