const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@Pages': path.resolve(__dirname, 'src/Pages'),
      '@MSMComponents': path.resolve(__dirname, 'src/MSMComponents'),
      '@ShadcnComponents': path.resolve(__dirname, 'src/ShadcnComponents'),
      '@Forms': path.resolve(__dirname, 'src/MSMComponents/Forms'),
      '@lib': path.resolve(__dirname, 'src/lib'),
    },
  },
};
