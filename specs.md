# Yearbook Single Page Web App – Specification

## 1. Overview

A lightweight, fast-loading, single-page (multi-section) web experience for a digital "yearbook" showcase. It must use only platform-native technologies: vanilla HTML, CSS, and a minimal amount of progressive-enhancement JavaScript. No build step, no framework, no bundler. All assets should be directly consumable by modern browsers.

## 2. Primary Goals

- Instant load perception (First Contentful Paint < ~1s on mid‑range mobile over 4G where feasible).
- Fully responsive: one codebase that adapts smoothly from 320px wide phones to large desktop screens.
- Accessible by default (WCAG 2.1 AA + considerate of cognitive load).
- Supports user color preferences: light, dark, and high contrast modes using CSS `prefers-color-scheme` & `prefers-contrast` queries and a manual override control.
- Zero JavaScript required for core content consumption; enhancements layer on top.
- Printable-friendly layout (print stylesheet optional but desirable).

## 3. Non-Goals

- No client-side routing framework or virtual DOM.
- No heavy JS state management or custom component system.
- No server-side dynamic rendering; assume static hosting.
- No build pipeline (avoid Node-based tooling unless later required for optimization tasks).

## 4. Audience & Use Cases

- Visitors browsing class/year highlights, photos, quotes, and accomplishments.
- Users on low bandwidth or older devices.
- Users with assistive technologies (screen readers, high contrast needs, keyboard-only navigation).
- Users who may prefer reduced motion.

## 6. Technology Stack Choices

- HTML5 semantic markup.
- CSS (organized modularly via layered approach: Base, Theme, Components, Utilities). No preprocessor required; consider using modern CSS features (custom properties, container queries if widely supported at build time).
- Vanilla JavaScript (ES modules) only where necessary: theme toggler, lightbox enhancement, optional intersection observers for lazy effects.
- Media: Optimized images (responsive `srcset`, `sizes`, modern formats like AVIF / WebP with fallback).

## 8. Accessibility Requirements

- Landmarks: `<header>`, `<main>`, `<nav>`, `<section>`, `<footer>` used properly.
- Meaningful heading hierarchy (single `<h1>`, descending levels logically).
- Color contrast: meet WCAG AA (4.5:1 for normal text, 3:1 for large text). High contrast mode boosts contrast further.
- Focus states: visible, non-reliant on color alone.
- Keyboard navigation: all interactive elements reachable in a logical tab order; no keyboard traps.
- Reduced motion: respect `prefers-reduced-motion`; disable non-essential animations.
- Alt text for images; decorative images use empty `alt=""`.
- Use `aria-live` only if dynamic announcements are truly needed (minimize ARIA; prefer semantic HTML).
- Lightbox (if implemented) must trap focus while open and restore focus on close.

## 9. Theming (Light / Dark / High Contrast)

Strategy:

- Define base design tokens as CSS custom properties under `:root` (neutral baseline).
- Override within `@media (prefers-color-scheme: dark)` for dark mode.
- Provide a high contrast set toggled via a `.contrast-high` class or `@media (prefers-contrast: more)`.
- Provide a user-accessible toggle (cycle: System Default → Light → Dark → High Contrast). Persist choice via `localStorage` (fallback to system if not set).
- Avoid hardcoded colors in components; always reference custom properties.

Example variables (conceptual snippet):

```
:root {
  --color-bg: #ffffff;
  --color-fg: #1b1b1b;
  --color-accent: #005fcc;
  --color-border: #d0d7de;
  --shadow-sm: 0 1px 2px rgba(0,0,0,.08);
}
@media (prefers-color-scheme: dark) {
  :root { --color-bg: #0f1115; --color-fg: #f5f7fa; --color-border: #2e3440; --color-accent: #4ea3ff; }
}
.contrast-high { --color-accent: #ffde00; --color-border: currentColor; }
```

## 10. Responsiveness

- Mobile-first CSS (start at narrow widths, progressively enhance layouts with min-width queries).
- Layout uses modern CSS flexbox and grid. Avoid fixed pixel widths; rely on relative units (`rem`, `%`, `ch`, `min()`, `clamp()`).
- Images: responsive sets (`<img srcset>`). Avoid layout shift by including explicit width/height or aspect-ratio.
- Use container queries (if available) for component-level adaptation; otherwise rely on key breakpoints (~480px, 768px, 1024px, 1280px).

## 11. Performance & Loading Strategy

- Keep initial HTML under ~50KB uncompressed if possible.
- Defer non-critical JavaScript with `type="module"` and/or `defer`.
- Inline critical CSS (~<10KB) for above-the-fold; remaining CSS loaded with standard `<link>` (no blocking JS in head).
- Use `loading="lazy"` on below-the-fold images.
- Consider `fetchpriority="high"` for hero image if impactful.
- Optimize images (pre-generate multiple sizes; no client-side resizing).
- Avoid large blocking web fonts; use system font stack or a single optional variable font with `font-display: swap`.

## 12. Progressive Enhancement

Baseline (no JS):

- Navigation via anchor links.
- Gallery shows static grid of images (click opens raw image / detail page fallback).
  Enhanced (with JS):
- Lightbox modal overlay (+ focus management).
- Smooth scroll for in-page navigation (CSS `scroll-behavior` where supported; JS fallback optional).
- Theme toggle persistence.
- Intersection-based fade-in or lazy hydration (respect reduced motion).

## 13. JavaScript Guidelines

- Keep total JS < ~15KB gzipped initial load (target <10KB if feasible).
- ES modules only; no transpilation (write code compatible with evergreen browsers: last 2 versions, excluding very old Edge/IE).
- Avoid global namespace pollution: wrap enhancement scripts in modules.
- No polyfills unless critical and widely missing; prefer graceful degradation.
- Avoid re-implementing accessible widgets unless trivial; use native `<details>`, `<dialog>` (with fallback) where appropriate.

## 14. CSS Strategy

- Layer order: 1) Base (normalize / element defaults) 2) Tokens / Theme 3) Layout 4) Components 5) Utilities / Overrides.
- Use custom properties for: colors, spacing scale, typography scale, elevation (shadows), transitions, radii.
- Prefer logical properties (`margin-inline`, `padding-block`) for future RTL support.
- Keep selector specificity low; avoid `!important` (except for helper utilities like `.visually-hidden`).

## 15. Image & Media Handling

- Provide descriptive filenames and alt text.
- Use modern formats (AVIF/WebP) with fallback `<picture>`.
- Pre-calc aspect ratios to prevent CLS.
- Consider a blurred placeholder technique (small inline base64) only if it doesn’t add complexity.

## 17. Browser Support (Progressive)

- Core experience: Latest stable Chrome, Firefox, Safari, Edge, and Chromium-based mobile browsers.
- Graceful degradation on slightly older versions (no layout collapse, readable content).
- No explicit support for IE11.

## 18. Security & Privacy

- All external links use `rel="noopener noreferrer"` when opening in new tab.
- No third-party tracking scripts by default.
- Avoid inline event handlers; use unobtrusive JS.
- Sanitize any future user-generated content before insertion (not in scope now if static).

## 19. Data & Content Management

- Static content authored directly in `index.html` initially.
- If future updates required, consider moving structured data (profiles, timeline) into a JSON file consumed progressively (only after MVP is stable).

## 20. High Contrast Mode Details

- Increase border widths where necessary (1px → 2px if subtle).
- Remove subtle shadows; rely on solid outlines.
- Ensure focus indicators are 2:1 contrast against adjacent colors.

## 21. Reduced Motion Considerations

- Disable parallax / large transitions when `prefers-reduced-motion: reduce`.
- Replace animations with instant state changes or subtle opacity changes under 150ms.

## 24. Acceptance Criteria (MVP)

- Loads and renders meaningful content with JS disabled.
- Theme toggle works and persists; system preference respected when no override stored.
- All interactive elements accessible via keyboard and have visible focus rings.
- Images are responsive and do not cause layout shift.
- Page passes automated Lighthouse accessibility audit ≥ 95.
- High contrast mode provides ≥ 7:1 contrast for primary text/content.

## 25. Definition of Done

- Spec sections above implemented or explicitly deferred.
- Manual accessibility + responsiveness checklist completed with no critical issues.
- Repository includes `index.html`, CSS folder with baseline theme layers, and JS theme toggle (if implemented at this milestone).
- No console errors in supported browsers.
