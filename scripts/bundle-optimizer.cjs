#!/usr/bin/env node

/**
 * Bundle Size Optimization Script
 * 
 * This script analyzes and optimizes the build output:
 * 1. Analyzes bundle composition
 * 2. Identifies optimization opportunities
 * 3. Suggests code splitting improvements
 * 4. Reports on bundle size changes
 */

const { readFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

function getFileSize(filepath) {
  try {
    const stats = statSync(filepath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundleSize() {
  const distDir = 'dist/assets';
  console.log('📊 Bundle Size Analysis\n');
  
  try {
    const files = readdirSync(distDir);
    const bundleInfo = {
      js: [],
      css: [],
      total: 0
    };
    
    files.forEach(file => {
      const filepath = join(distDir, file);
      const size = getFileSize(filepath);
      bundleInfo.total += size;
      
      if (file.endsWith('.js')) {
        bundleInfo.js.push({ name: file, size });
      } else if (file.endsWith('.css')) {
        bundleInfo.css.push({ name: file, size });
      }
    });
    
    console.log('JavaScript Files:');
    bundleInfo.js
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        console.log(`  ${file.name}: ${formatBytes(file.size)}`);
      });
    
    console.log('\nCSS Files:');
    bundleInfo.css
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        console.log(`  ${file.name}: ${formatBytes(file.size)}`);
      });
    
    console.log(`\nTotal Bundle Size: ${formatBytes(bundleInfo.total)}`);
    
    // Size recommendations
    const mainJsSize = bundleInfo.js.reduce((sum, file) => sum + file.size, 0);
    const mainCssSize = bundleInfo.css.reduce((sum, file) => sum + file.size, 0);
    
    console.log('\n🎯 Optimization Recommendations:');
    
    if (mainJsSize > 500 * 1024) { // 500KB
      console.log('⚠️  JavaScript bundle is large (>500KB). Consider:');
      console.log('   - Code splitting with dynamic imports');
      console.log('   - Tree shaking unused exports');
      console.log('   - Lazy loading admin components');
    }
    
    if (mainCssSize > 100 * 1024) { // 100KB
      console.log('⚠️  CSS bundle is large (>100KB). Consider:');
      console.log('   - Purging unused Tailwind classes');
      console.log('   - Splitting CSS by route');
    }
    
    if (bundleInfo.total > 1024 * 1024) { // 1MB
      console.log('⚠️  Total bundle size exceeds 1MB. Consider implementing:');
      console.log('   - Progressive loading strategies');
      console.log('   - Service worker for caching');
      console.log('   - Image optimization and lazy loading');
    } else {
      console.log('✅ Bundle size is within acceptable limits');
    }
    
  } catch (error) {
    console.log('❌ Error: dist/assets directory not found. Run npm run build first.');
  }
}

function checkDependencies() {
  console.log('\n📦 Dependency Analysis\n');
  
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const deps = Object.keys(packageJson.dependencies || {});
    
    // Heavy dependencies to watch
    const heavyDeps = [
      'moment', 'lodash', 'axios', 'material-ui',
      '@emotion/react', '@emotion/styled'
    ];
    
    const foundHeavy = deps.filter(dep => heavyDeps.includes(dep));
    
    if (foundHeavy.length > 0) {
      console.log('⚠️  Heavy dependencies detected:');
      foundHeavy.forEach(dep => {
        console.log(`   - ${dep} (consider lighter alternatives)`);
      });
    }
    
    // Suggested optimizations
    console.log('\n💡 Dependency Optimization Suggestions:');
    
    if (deps.includes('date-fns')) {
      console.log('✅ Using date-fns (lightweight date library)');
    }
    
    if (deps.includes('recharts')) {
      console.log('💡 Consider lazy loading chart components');
    }
    
    if (deps.some(dep => dep.includes('@radix-ui'))) {
      console.log('✅ Using Radix UI (tree-shakeable components)');
    }
    
  } catch (error) {
    console.log('❌ Error reading package.json');
  }
}

function main() {
  console.log('🚀 Bundle Optimization Analysis\n');
  analyzeBundleSize();
  checkDependencies();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Review bundle analyzer output (npm run build:analyze)');
  console.log('2. Implement suggested optimizations');
  console.log('3. Set up continuous bundle monitoring');
  console.log('4. Consider implementing service worker for caching');
}

if (require.main === module) {
  main();
}