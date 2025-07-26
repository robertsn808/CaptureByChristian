module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm start',
      startServerReadyPattern: 'Server running on',
      startServerReadyTimeout: 30000,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        
        // Performance budgets
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'first-meaningful-paint': ['warn', { maxNumericValue: 2000 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        
        // Resource budgets
        'total-byte-weight': ['warn', { maxNumericValue: 1000000 }], // 1MB
        'unused-javascript': ['warn', { maxNumericValue: 100000 }], // 100KB
        'unused-css-rules': ['warn', { maxNumericValue: 50000 }], // 50KB
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};