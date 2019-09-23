module.exports = {
  timeInactive: parseInt(process.env.TIME_INACTIVE || 60 * 1000, 10),
  VAPID: {
    email: process.env.VAPID_EMAIL || 'mailto:web-push@domain.com',
    public: process.env.VAPID_PUBLIC || 'BHE4U3UhQSchTJT2zpHSrBumCCQcNQbvoRlp5OZkA1Xl9_nP1tYbKEpcWC3MCs7MJvR6jJLyBIGO4CF1agN9n4k',
    private: process.env.VAPID_PRIVATE || 'VH8v942nLaYIN4kk6IatdQ1erqw-9IK_9xOvbMcvOxA',
  }
};
