// Validate required environment variables
const requiredEnvVars = {
  VITE_SERVER_ENDPOINT: import.meta.env.VITE_SERVER_ENDPOINT,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error("Missing required environment variables:", missingVars);
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

export const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;
export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
