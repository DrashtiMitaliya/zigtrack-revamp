Create a comprehensive **ui-guidelines.md** file for this project.

The goal is to ensure the entire application has a **clean, scalable, responsive, maintainable, and production-ready UI**.

## General Rules

* Build a fully responsive UI for:

  * Mobile
  * Tablet
  * Laptop
  * Desktop
  * Ultra-wide screens
* Use a **mobile-first approach**.
* Follow modern UI/UX best practices.
* Keep the design consistent across every screen.
* Avoid duplicated UI code.
* Prioritize accessibility (WCAG basics).
* Use semantic HTML whenever possible.
* Follow component-driven architecture.

---

## Component Architecture

Always create reusable common components instead of repeating code.

Examples:

* Button
* Input
* TextField
* Select
* Checkbox
* Radio
* Switch
* Badge
* Avatar
* Card
* Modal
* Dialog
* Drawer
* Sidebar
* Header
* Footer
* Navbar
* Table
* Pagination
* Search Bar
* Tabs
* Accordion
* Skeleton Loader
* Spinner
* Toast
* Empty State
* Error State
* Loading State
* Confirmation Dialog
* Breadcrumb
* Form Components
* File Upload
* Date Picker
* Time Picker

All pages should reuse these components.

---

## Responsive Breakpoints

Support at least:

* < 480px
* 480px
* 768px
* 1024px
* 1280px
* 1440px
* 1536px+
* Ultra-wide monitors

Every page should look good on all breakpoints.

---

## Layout Rules

Use consistent layouts.

Examples:

* Dashboard Layout
* Auth Layout
* Public Layout
* Admin Layout
* Settings Layout

Avoid creating new layouts unless absolutely necessary.

---

## Design System

Maintain a single design system.

Include:

* Typography scale
* Color palette
* Border radius
* Shadows
* Icon sizing
* Spacing system (4px/8px grid)
* Z-index hierarchy
* Elevation levels
* Animation duration
* Transition timing

Everything should come from shared design tokens.

---

## Spacing Rules

Use consistent spacing only.

Examples:

* 4
* 8
* 12
* 16
* 20
* 24
* 32
* 40
* 48
* 64

Do not use random spacing values.

---

## Typography

Use predefined text styles.

Examples:

* Display
* H1
* H2
* H3
* H4
* H5
* H6
* Subtitle
* Body
* Small Text
* Caption
* Label

Never hardcode font sizes repeatedly.

---

## Colors

Use theme variables.

Support:

* Light Theme
* Dark Theme

Include:

* Primary
* Secondary
* Success
* Warning
* Error
* Info
* Background
* Surface
* Border
* Text
* Disabled

Never hardcode colors inside components.

---

## Forms

Create reusable form components.

Support:

* Validation
* Error messages
* Helper text
* Disabled state
* Loading state
* Required fields
* Password visibility
* Character limits
* Success state

---

## Tables

Reusable table component with:

* Sorting
* Pagination
* Search
* Filtering
* Loading
* Empty state
* Row selection
* Responsive layout
* Sticky header
* Horizontal scrolling

---

## Navigation

Create reusable navigation.

Support:

* Desktop Sidebar
* Mobile Drawer
* Header
* Breadcrumb
* User Menu
* Notifications
* Profile Menu

---

## Loading States

Every page should have:

* Skeleton Loading
* Spinner
* Lazy Loading
* Image Placeholder
* Button Loading
* Infinite Scroll Loading (if applicable)

---

## Empty States

Every module should have reusable empty states.

Include:

* Illustration
* Title
* Description
* Primary Action
* Secondary Action

---

## Error Handling

Reusable error UI.

Support:

* 404
* 403
* 500
* Network Error
* API Error
* Retry Button
* Offline Mode

---

## Animations

Use subtle animations.

Examples:

* Fade
* Slide
* Scale
* Hover
* Ripple
* Skeleton shimmer

Avoid excessive animations.

---

## Accessibility

Support:

* Keyboard navigation
* Focus indicators
* Screen readers
* Proper labels
* ARIA attributes
* Color contrast
* Touch-friendly controls
* Accessible modals

---

## Performance

Optimize UI by:

* Lazy loading components
* Code splitting
* Memoization where needed
* Image optimization
* Icon optimization
* Virtualized lists for large datasets
* Debounced search
* Throttled scrolling

---

## File Organization

Organize UI into:

* components/
* layouts/
* pages/
* hooks/
* utils/
* services/
* constants/
* assets/
* styles/
* theme/
* types/

Group feature-specific components within their respective modules.

---

## Code Quality

* Maximum **600–700 lines per file**.
* Split large files into smaller reusable components.
* Keep components focused on a single responsibility.
* Avoid duplicated logic.
* Extract shared hooks and utilities.
* Use meaningful naming conventions.
* Remove unused code, imports, and styles.
* Prefer composition over inheritance.
* Maintain consistent formatting and linting.

---

## Responsive Checklist

Before completing any screen, verify:

* No horizontal scrolling
* Proper spacing on all devices
* Responsive typography
* Responsive images
* Responsive tables
* Responsive forms
* Responsive modals
* Responsive navigation
* Touch-friendly buttons
* Proper overflow handling
* Consistent alignment
* No layout shifts
* Cross-browser compatibility

---

## UI Consistency Rules

* Maintain consistent button sizes and styles.
* Use a unified icon library.
* Keep consistent border radii and shadows.
* Standardize form field heights.
* Align content using a grid system.
* Reuse cards, dialogs, and list patterns.
* Ensure hover, active, focus, and disabled states are consistent.
* Provide clear feedback for user actions.
* Prevent layout shifts while loading.
* Support localization with flexible layouts for varying text lengths.

---

## Final Development Rules

* Every new screen must use existing shared components whenever possible.
* Do not duplicate UI code.
* Refactor repeated patterns into reusable components.
* Follow responsive design principles throughout the project.
* Ensure every screen is production-ready before completion.
* Maintain clean, modular, scalable, and maintainable code.
* Keep each file under **600–700 lines** by extracting logic into reusable components, hooks, and utilities.
