// Utility functions for handling redirect URLs after login

const REDIRECT_STORAGE_KEY = 'login_redirect';

/**
 * Store the current URL for redirect after login
 * @param url - The URL to store (should include pathname and search params)
 */
export const storeRedirectUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(REDIRECT_STORAGE_KEY, url);
  }
};

/**
 * Get and clear the stored redirect URL
 * @param defaultUrl - Default URL to return if no redirect URL is stored
 * @returns The stored redirect URL or the default URL
 */
export const getAndClearRedirectUrl = (defaultUrl: string = '/'): string => {
  if (typeof window === 'undefined') {
    return defaultUrl;
  }

  const storedUrl = sessionStorage.getItem(REDIRECT_STORAGE_KEY);
  
  if (storedUrl) {
    // Clear the stored URL since we're using it
    sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    
    // Normalize the URL to match route definitions
    let normalizedUrl = storedUrl;
    
    // Add trailing slash for known routes that expect it
    if (normalizedUrl === '/employees') {
      normalizedUrl = '/employees/';
    } else if (normalizedUrl === '/projects') {
      normalizedUrl = '/projects/';
    } else if (normalizedUrl === '/shared') {
      normalizedUrl = '/shared/';
    }

    return normalizedUrl;
  }
  
  return defaultUrl;
};

/**
 * Check if there's a stored redirect URL
 * @returns True if there's a stored redirect URL
 */
export const hasStoredRedirectUrl = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return !!sessionStorage.getItem(REDIRECT_STORAGE_KEY);
};

/**
 * Clear any stored redirect URL
 */
export const clearStoredRedirectUrl = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
  }
};
