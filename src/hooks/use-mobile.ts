export const config = {
  apiUrl: window.__ENV__?.VITE_EMS_API_URL ?? import.meta.env.VITE_EMS_API_URL,
  basePath: window.__ENV__?.VITE_BASE_PATH ?? import.meta.env.VITE_BASE_PATH,
  nodeEnv: window.__ENV__?.NODE_ENV ?? import.meta.env.MODE,
};

if (!config.apiUrl) {
  console.warn("VITE_EMS_API_URL is not defined in the environment variables.");
} else {
  console.log("VITE_EMS_API_URL is defined in the environment variables.");
}

// Export API_URL for backward compatibility
export const API_URL = config.apiUrl;
