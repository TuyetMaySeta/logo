// urlUtils.ts
export const urlUtils = {
  getErrorFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('error');
  },

  getErrorMessage(error: string): string {
    switch (error) {
      case 'callback_failed':
        return 'Microsoft login failed during callback processing';
      case 'no_code':
        return 'No authorization code received from Microsoft';
      case 'callback_error':
        return 'An error occurred during the login process';
      default:
        return 'Authentication failed';
    }
  },

  cleanUrl(): void {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};