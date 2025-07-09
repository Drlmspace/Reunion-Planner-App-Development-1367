import React, {useState, useEffect} from 'react';
import FirstLaunchModal from './FirstLaunchModal';

const FirstLaunchHandler = ({children}) => {
  const [showFirstLaunch, setShowFirstLaunch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already accepted terms
    const termsAccepted = localStorage.getItem('termsAccepted');
    const termsAcceptedDate = localStorage.getItem('termsAcceptedDate');

    // Check if terms were accepted and if it's been more than 365 days (optional re-acceptance)
    const shouldShowFirstLaunch = !termsAccepted || (
      termsAcceptedDate && new Date() - new Date(termsAcceptedDate) > 365 * 24 * 60 * 60 * 1000
    );

    setShowFirstLaunch(shouldShowFirstLaunch);
    setIsLoading(false);
  }, []);

  const handleAccept = () => {
    setShowFirstLaunch(false);
  };

  const handleDecline = () => {
    // Close the app/redirect away if
    if (window.confirm('Are you sure you want to exit? You must agree to the terms to use this application.')) {
      // Try to close the window/tab
      window.close();

      // If window.close() doesn't work (modern browsers restrict it),
      // redirect to a blank page or show an exit message
      setTimeout(() => {
        document.body.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 20px;
        ">
          <div style="
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          ">
            <h1 style="font-size: 2rem; margin-bottom: 1rem; font-weight: 600;">
              Thank you for your interest
            </h1>
            <p style="font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9;">
              You have chosen not to accept our terms and conditions. The application has been closed.
            </p>
            <p style="font-size: 0.9rem; opacity: 0.7;">
              You can return anytime by refreshing this page and accepting our terms.
            </p>
            <button onclick="window.location.reload()" style="
              margin-top: 20px;
              padding: 12px 24px;
              background: rgba(255, 255, 255, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.3);
              border-radius: 8px;
              color: white;
              cursor: pointer;
              font-size: 1rem;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
              Return to App
            </button>
          </div>
        </div>
        `;
      }, 100);
    } else {
      // User cancelled the exit, show the modal again
      setShowFirstLaunch(true);
    }
  };

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading The Reunion Curator...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showFirstLaunch && (
        <FirstLaunchModal onAccept={handleAccept} onDecline={handleDecline} />
      )}
      {!showFirstLaunch && children}
    </>
  );
};

export default FirstLaunchHandler;