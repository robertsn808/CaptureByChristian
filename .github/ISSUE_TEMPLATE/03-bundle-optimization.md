---
name: 📦 Bundle Size Optimization
about: Reduce JavaScript bundle from 1.3MB to optimal size
title: '[HIGH] Bundle Size Optimization - Reduce from 1.3MB to <500KB'
labels: performance, frontend, optimization
assignees: ''

---

## 📦 Bundle Size Optimization

### Current State
- **JavaScript Bundle:** 1.3MB (⚠️ Too Large)
- **CSS Bundle:** 109KB (Acceptable)
- **Target:** <500KB for optimal performance

### Bundle Analysis Results

#### Major Contributors to Bundle Size:
```
@radix-ui/* components (40+ packages): ~400KB
@tanstack/react-query: ~100KB
framer-motion: ~120KB
recharts: ~150KB
react-beautiful-dnd: ~80KB
date-fns: ~50KB
Multiple utility libraries: ~200KB
```

### Critical Issues

#### 1. No Code Splitting
**Problem:** All components loaded in single bundle
**Impact:** Slow initial page load (3-5 seconds)

#### 2. Heavy UI Dependencies
**Problem:** Bulk import of Radix UI components
**Current:** 40+ individual @radix-ui packages
**Impact:** Unnecessary code for public pages

#### 3. Missing Tree Shaking
**Problem:** Unused code included in bundle
**Impact:** Inflated bundle size

### Implementation Plan

#### Phase 1: Code Splitting (Week 1)
```typescript
// 1. Lazy load admin components
const AdminDashboard = React.lazy(() => import('./admin/dashboard'));
const AdminCalendar = React.lazy(() => import('./admin/calendar'));
const AdminAnalytics = React.lazy(() => import('./admin/advanced-analytics'));

// 2. Route-based splitting
const AdminRoutes = React.lazy(() => import('./admin'));
const ClientPortal = React.lazy(() => import('./client-portal'));
```

#### Phase 2: Dependency Optimization (Week 2)
```typescript
// 1. Replace heavy dependencies
// BEFORE: import { motion } from "framer-motion"; (~120KB)
// AFTER: CSS animations or lighter alternative

// 2. Optimize Radix imports
// BEFORE: import * from "@radix-ui/react-dialog";
// AFTER: import { Dialog } from "@radix-ui/react-dialog";

// 3. Chart library alternatives
// BEFORE: recharts (~150KB)
// AFTER: Chart.js with tree-shaking (~50KB)
```

#### Phase 3: Build Optimization (Week 3)
```typescript
// vite.config.ts optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts'],
          admin: ['./src/components/admin']
        }
      }
    },
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query']
  }
});
```

### Bundle Analysis Setup

#### 1. Add Bundle Analyzer
```bash
npm install --save-dev rollup-plugin-visualizer
```

#### 2. Add Analysis Script
```json
{
  "scripts": {
    "analyze": "vite build && npx vite-bundle-analyzer dist"
  }
}
```

### Expected Results

#### After Phase 1 (Code Splitting):
- **Initial Bundle:** 400KB (-70%)
- **Admin Chunk:** 600KB (loaded on demand)
- **Public Pages:** 200KB (fast loading)

#### After Phase 2 (Dependency Optimization):
- **Initial Bundle:** 250KB (-80%)
- **Admin Chunk:** 400KB (-60%)
- **Public Pages:** 150KB (-85%)

#### After Phase 3 (Build Optimization):
- **Initial Bundle:** 200KB (-85%)
- **Optimized Chunks:** Better caching
- **Load Time:** <1 second

### Performance Improvements

#### Loading Performance:
```
BEFORE:
- Initial Load: 3-5 seconds
- Admin Dashboard: 2-3 seconds
- Time to Interactive: 4-6 seconds

AFTER:
- Initial Load: <1 second
- Admin Dashboard: <1 second (with caching)
- Time to Interactive: <2 seconds
```

### Implementation Tasks

#### Week 1: Code Splitting
- [ ] Implement React.lazy for admin components
- [ ] Add route-based code splitting
- [ ] Implement Suspense boundaries with loading states
- [ ] Test lazy loading functionality

#### Week 2: Dependency Optimization
- [ ] Audit and replace heavy dependencies
- [ ] Optimize Radix UI imports
- [ ] Replace framer-motion with CSS animations
- [ ] Evaluate chart library alternatives

#### Week 3: Build Configuration
- [ ] Configure manual chunks in Vite
- [ ] Optimize vendor chunk splitting
- [ ] Add bundle size monitoring
- [ ] Performance testing and verification

### Monitoring and Validation

#### Performance Metrics to Track:
```typescript
// Add to performance monitoring
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'navigation') {
      console.log('Page Load Time:', entry.loadEventEnd - entry.fetchStart);
    }
  });
});
observer.observe({ entryTypes: ['navigation'] });
```

#### Bundle Size Alerts:
```json
{
  "scripts": {
    "build": "vite build && node scripts/check-bundle-size.js"
  }
}
```

### Files Requiring Changes
- `vite.config.ts` - Build configuration
- `client/src/pages/admin.tsx` - Code splitting implementation
- `client/src/main.tsx` - Lazy loading setup
- `package.json` - Scripts and dependencies
- New: `scripts/check-bundle-size.js` - Size monitoring

### Testing Requirements
- [ ] Bundle size verification
- [ ] Loading performance testing
- [ ] Code splitting functionality testing
- [ ] Cache invalidation testing
- [ ] Mobile performance testing

### Priority: HIGH
**Estimated Time:** 3 weeks for complete implementation
**Impact:** 80%+ reduction in initial load time

---
*Bundle analysis performed on build output*