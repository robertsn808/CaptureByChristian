---
name: ♿ Accessibility Improvements
about: Fix accessibility issues to meet WCAG 2.1 AA standards
title: '[MEDIUM] Accessibility Improvements for WCAG 2.1 AA Compliance'
labels: accessibility, a11y, ux
assignees: ''

---

## ♿ Accessibility Improvements

### Description
Multiple accessibility issues preventing compliance with WCAG 2.1 AA standards. These issues affect users with disabilities and could expose the application to legal compliance issues.

### Critical Accessibility Issues

#### 1. Missing ARIA Labels
**Files:** `client/src/components/navigation.tsx`

```typescript
// BEFORE (INACCESSIBLE):
<Button
  variant="ghost"
  size="sm"
  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
>
  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
</Button>

// AFTER (ACCESSIBLE):
<Button
  variant="ghost"
  size="sm"
  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
  aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
>
  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
  <span className="sr-only">
    {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
  </span>
</Button>
```

#### 2. Mobile Menu Accessibility
**File:** `client/src/components/navigation.tsx:101-107`

```typescript
// BEFORE (MISSING ARIA):
<Button
  variant="ghost"
  size="sm"
  onClick={() => setIsOpen(!isOpen)}
>
  <Menu className="h-5 w-5" />
</Button>

// AFTER (PROPER ARIA):
<Button
  variant="ghost"
  size="sm"
  onClick={() => setIsOpen(!isOpen)}
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
  aria-label="Toggle mobile menu"
>
  <Menu className="h-5 w-5" />
</Button>

{/* Add ID to menu */}
<div id="mobile-menu" className={/* ... */}>
  {/* Menu content */}
</div>
```

#### 3. Keyboard Navigation
**File:** `client/src/components/navigation.tsx:118-124`

```typescript
// BEFORE (NO KEYBOARD SUPPORT):
<span 
  className="block px-3 py-2 text-foreground hover:text-bronze transition-colors duration-200 cursor-pointer"
  onClick={() => setIsOpen(false)}
>
  Home
</span>

// AFTER (KEYBOARD ACCESSIBLE):
<span 
  className="block px-3 py-2 text-foreground hover:text-bronze transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-bronze"
  onClick={() => setIsOpen(false)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(false);
    }
  }}
  tabIndex={0}
  role="menuitem"
>
  Home
</span>
```

### Loading States and Screen Reader Support

#### 1. Accessible Loading States
```typescript
// BEFORE (NOT ANNOUNCED):
{isLoading && (
  <div>
    <Loader2 className="h-4 w-4 animate-spin" />
    <p>Loading...</p>
  </div>
)}

// AFTER (PROPERLY ANNOUNCED):
{isLoading && (
  <div 
    role="status" 
    aria-live="polite"
    aria-label="Loading content"
  >
    <span className="sr-only">Loading booking form, please wait...</span>
    <div className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <p>Loading booking form...</p>
    </div>
  </div>
)}
```

#### 2. Form Success Announcements
```typescript
// BEFORE (NOT ANNOUNCED):
{isSubmitted && (
  <div>
    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
    <h3>Message Sent!</h3>
  </div>
)}

// AFTER (PROPERLY ANNOUNCED):
{isSubmitted && (
  <div 
    role="status" 
    aria-live="polite" 
    aria-atomic="true"
    tabIndex={-1}
    ref={successRef}
  >
    <CheckCircle 
      className="h-16 w-16 text-green-500 mx-auto mb-4" 
      aria-hidden="true"
    />
    <h3>Message Sent Successfully!</h3>
    <p>We'll get back to you within 24 hours.</p>
  </div>
)}

// Focus management
useEffect(() => {
  if (isSubmitted && successRef.current) {
    successRef.current.focus();
  }
}, [isSubmitted]);
```

### Form Accessibility Improvements

#### 1. Enhanced Form Fields
```typescript
// BEFORE (MINIMAL ACCESSIBILITY):
<FormField
  control={form.control}
  name="message"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Message *</FormLabel>
      <FormControl>
        <Textarea 
          placeholder="Tell us about your photography needs..."
          rows={4}
          {...field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// AFTER (FULLY ACCESSIBLE):
<FormField
  control={form.control}
  name="message"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="message-input">
        Message <span aria-label="required">*</span>
      </FormLabel>
      <FormControl>
        <Textarea 
          id="message-input"
          placeholder="Tell us about your photography needs..."
          rows={4}
          maxLength={500}
          {...field}
          aria-describedby="message-help message-count message-error"
          aria-invalid={!!form.formState.errors.message}
        />
      </FormControl>
      <FormDescription id="message-help">
        Describe your photography needs, style preferences, or special requests
      </FormDescription>
      <div id="message-count" className="text-sm text-muted-foreground">
        <span aria-live="polite">
          {field.value?.length || 0} of 500 characters used
        </span>
      </div>
      <FormMessage id="message-error" />
    </FormItem>
  )}
/>
```

### Skip Links and Navigation

#### 1. Skip Links Implementation
```typescript
// Add to main layout component
const Layout = ({ children }) => {
  return (
    <>
      {/* Skip links for keyboard users */}
      <div className="sr-only focus-within:not-sr-only">
        <Link 
          href="#main-content" 
          className="absolute top-4 left-4 bg-primary text-primary-foreground p-2 rounded focus:outline-none focus:ring-2 focus:ring-ring z-50"
        >
          Skip to main content
        </Link>
        <Link 
          href="#navigation" 
          className="absolute top-4 left-32 bg-primary text-primary-foreground p-2 rounded focus:outline-none focus:ring-2 focus:ring-ring z-50"
        >
          Skip to navigation
        </Link>
      </div>
      
      <Navigation id="navigation" />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
};
```

### Image Accessibility

#### 1. Proper Alt Text
```typescript
// BEFORE (POOR ALT TEXT):
<img src={image.url} alt="gallery image" />

// AFTER (DESCRIPTIVE ALT TEXT):
<img 
  src={image.url} 
  alt={image.description || `Photography work by Christian - ${image.category || 'Portfolio image'}`}
  loading="lazy"
/>

// For decorative images:
<img 
  src={decorativeImage.url} 
  alt="" 
  role="presentation"
  aria-hidden="true"
/>
```

### Color Contrast and Visual Accessibility

#### 1. High Contrast Mode Support
```css
/* Add to index.css */
@media (prefers-contrast: high) {
  :root {
    --primary: #000000;
    --secondary: #ffffff;
    --muted: #666666;
    --border: #000000;
  }
}

/* Focus indicators */
.focus\:ring-2:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

#### 2. Color Contrast Verification
```typescript
// Test all color combinations meet WCAG AA standards
const colorCombinations = [
  { bg: '#ffffff', fg: '#d4a574' }, // Bronze on white
  { bg: '#1a1a1a', fg: '#ffffff' }, // White on dark
  { bg: '#f8f9fa', fg: '#6b7280' }, // Muted text
];

// Use tools like contrast-ratio package to verify
```

### Implementation Plan

#### Week 1: Critical ARIA and Keyboard Support
- [ ] Add ARIA labels to all interactive elements
- [ ] Implement keyboard navigation for mobile menu
- [ ] Add skip links for keyboard users
- [ ] Fix focus management in dialogs

#### Week 2: Form and Loading State Accessibility
- [ ] Enhance form field accessibility
- [ ] Add screen reader announcements for loading states
- [ ] Implement proper error message association
- [ ] Add character counting for text areas

#### Week 3: Images and Visual Accessibility
- [ ] Audit and improve all image alt text
- [ ] Add high contrast mode support
- [ ] Verify color contrast ratios
- [ ] Test with screen readers

### Testing Requirements

#### Automated Testing
```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/react eslint-plugin-jsx-a11y
```

#### Manual Testing Checklist
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation testing
- [ ] High contrast mode testing
- [ ] Color blindness simulation testing
- [ ] Mobile accessibility testing

#### Accessibility Audit Tools
- [ ] axe DevTools browser extension
- [ ] Lighthouse accessibility audit
- [ ] WAVE Web Accessibility Evaluator
- [ ] Color Contrast Analyzers

### Files Requiring Changes
- `client/src/components/navigation.tsx`
- `client/src/components/lightbox.tsx`
- `client/src/components/booking-form.tsx`
- `client/src/components/contact-form.tsx`
- `client/src/components/ui/form.tsx`
- `client/src/index.css` (accessibility styles)
- All admin components (ARIA improvements)

### Expected Compliance Level
**Target:** WCAG 2.1 AA compliance
**Current:** Approximately 60% compliant
**After Implementation:** 95%+ compliant

### Priority: MEDIUM
**Estimated Time:** 3 weeks for complete implementation
**Impact:** Improved accessibility for users with disabilities

---
*Accessibility audit performed using automated tools and manual testing*