export default {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  appServerKey: process.env.APP_SERVER_KEY || 'BHE4U3UhQSchTJT2zpHSrBumCCQcNQbvoRlp5OZkA1Xl9_nP1tYbKEpcWC3MCs7MJvR6jJLyBIGO4CF1agN9n4k',
  checkStatusInterval: parseInt(process.env.CHECK_STATUS_INTERVAL || 1000),
  env: process.env.NODE_ENV || 'development',
};
