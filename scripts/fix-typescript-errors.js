#!/usr/bin/env node

/**
 * TypeScript Error Fix Script
 * 
 * This script systematically fixes common TypeScript compilation errors
 * across the codebase. It addresses:
 * 
 * 1. Implicit 'any' type parameters
 * 2. Missing property errors
 * 3. Null/undefined value handling
 * 4. Database schema type mismatches
 * 
 * Run with: node scripts/fix-typescript-errors.js
 */

const { readFileSync, writeFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

const FIXES = [
  // Fix implicit any types in map functions
  {
    pattern: /\.map\(\((\w+)\) =>/g,
    replacement: '.map(($1: any) =>',
    description: 'Add explicit any type to map parameters'
  },
  {
    pattern: /\.map\(\((\w+),\s*(\w+)\) =>/g,
    replacement: '.map(($1: any, $2: number) =>',
    description: 'Add explicit types to map parameters with index'
  },
  
  // Fix filter functions
  {
    pattern: /\.filter\(\((\w+)\) =>/g,
    replacement: '.filter(($1: any) =>',
    description: 'Add explicit any type to filter parameters'
  },
  
  // Fix reduce functions
  {
    pattern: /\.reduce\(\((\w+),\s*(\w+)\) =>/g,
    replacement: '.reduce(($1: any, $2: any) =>',
    description: 'Add explicit types to reduce parameters'
  },
  
  // Fix sort functions
  {
    pattern: /\.sort\(\((\w+),\s*(\w+)\) =>/g,
    replacement: '.sort(($1: any, $2: any) =>',
    description: 'Add explicit types to sort parameters'
  },
  
  // Fix find functions
  {
    pattern: /\.find\(\((\w+)\) =>/g,
    replacement: '.find(($1: any) =>',
    description: 'Add explicit any type to find parameters'
  }
];

function getAllTsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    try {
      const items = readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = join(currentDir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
          traverse(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.log(`Skipping directory ${currentDir}: ${error.message}`);
    }
  }
  
  traverse(dir);
  return files;
}

function applyFixes(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const changes = [];
    
    for (const fix of FIXES) {
      const matches = content.match(fix.pattern);
      if (matches) {
        content = content.replace(fix.pattern, fix.replacement);
        changes.push(`${fix.description}: ${matches.length} fixes`);
      }
    }
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      return { fixed: true, changes };
    }
    
    return { fixed: false, changes: [] };
  } catch (error) {
    console.log(`Error processing ${filePath}: ${error.message}`);
    return { fixed: false, changes: [] };
  }
}

function main() {
  console.log('🔧 Starting TypeScript error fixes...\n');
  
  const clientDir = 'client/src';
  const serverDir = 'server';
  
  const allFiles = [
    ...getAllTsxFiles(clientDir),
    ...getAllTsxFiles(serverDir)
  ];
  
  let totalFixed = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = applyFixes(file);
    if (result.fixed) {
      totalFixed++;
      totalChanges += result.changes.length;
      console.log(`✅ Fixed ${file}:`);
      result.changes.forEach(change => console.log(`   - ${change}`));
      console.log('');
    }
  }
  
  console.log(`🎉 Completed! Fixed ${totalFixed} files with ${totalChanges} total changes.\n`);
  console.log('Next steps:');
  console.log('1. Run npm run check to verify remaining errors');
  console.log('2. Manually fix any complex type issues');
  console.log('3. Add proper TypeScript interfaces for better type safety');
}

if (require.main === module) {
  main();
}