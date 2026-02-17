# Tailwind CSS v4 Migration Notes

## Changes Made

### 1. Updated `globals.css` to Tailwind v4 Syntax
- Changed from `@tailwind` directives to `@import "tailwindcss"`
- Added `@theme` block for custom color configuration
- Defined custom CSS variables for theme colors

### 2. Removed `tailwind.config.ts`
- Tailwind v4 uses CSS-first configuration
- All theme customization moved to `globals.css`

### 3. Custom Theme Colors
The following custom colors are available through CSS variables:
- Primary palette: `--color-primary-50` through `--color-primary-950` (emerald green)
- Dark theme: `--color-dark-bg`, `--color-dark-surface`, `--color-dark-border`

## Using Custom Colors in Components

Since we're using Tailwind v4, you can reference these colors in your CSS or Tailwind classes:

```tsx
// Using CSS variables directly
<div style={{ backgroundColor: 'var(--color-dark-bg)' }}>

// Using in Tailwind classes (requires additional configuration)
<div className="bg-[--color-dark-bg]">
```

## Note
The `postcss.config.mjs` uses `@tailwindcss/postcss` which is the correct plugin for Tailwind v4.
