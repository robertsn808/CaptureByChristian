module.exports = [
  {
    "path": "dist/assets/index-*.js",
    "limit": "250 KB",
    "gzip": true
  },
  {
    "path": "dist/assets/vendor-*.js", 
    "limit": "150 KB",
    "gzip": true
  },
  {
    "path": "dist/assets/ui-*.js",
    "limit": "100 KB", 
    "gzip": true
  },
  {
    "path": "dist/assets/*.css",
    "limit": "50 KB",
    "gzip": true
  }
];