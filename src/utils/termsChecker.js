/**
 * Utility functions for managing terms acceptance
 */

export const checkTermsAcceptance = () => {
  const termsAccepted = localStorage.getItem('termsAccepted');
  const termsAcceptedDate = localStorage.getItem('termsAcceptedDate');
  
  if (!termsAccepted) {
    return false;
  }
  
  // Optional: Check if terms acceptance is older than 1 year
  if (termsAcceptedDate) {
    const acceptanceDate = new Date(termsAcceptedDate);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (acceptanceDate < oneYearAgo) {
      return false; // Terms acceptance expired
    }
  }
  
  return true;
};

export const acceptTerms = () => {
  localStorage.setItem('termsAccepted', 'true');
  localStorage.setItem('termsAcceptedDate', new Date().toISOString());
};

export const revokeTermsAcceptance = () => {
  localStorage.removeItem('termsAccepted');
  localStorage.removeItem('termsAcceptedDate');
};

export const getTermsAcceptanceDate = () => {
  const date = localStorage.getItem('termsAcceptedDate');
  return date ? new Date(date) : null;
};