# Yearbook Page - Cody Sorgenfrey

A lightweight, accessible, and responsive digital yearbook page built with vanilla HTML, CSS, and minimal JavaScript following modern web standards.

## ✨ Features

- **Fast Loading**: No build tools, frameworks, or heavy dependencies
- **Fully Responsive**: Adapts seamlessly from 320px mobile to large desktop screens
- **Accessible by Default**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Theme Support**: Light, dark, and high-contrast modes with system preference detection
- **Progressive Enhancement**: Works without JavaScript, enhanced with JS
- **Print Friendly**: Optimized print styles included

## 🚀 Quick Start

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No build step or server required!

## 📁 Project Structure

```
yearbook-page/
├── index.html              # Main HTML file
├── css/
│   ├── base.css           # Reset, normalize, element defaults
│   ├── theme.css          # Custom properties, color schemes
│   ├── components.css     # Layout and component styles
│   └── utilities.css      # Helper classes
├── js/
│   ├── theme-toggle.js    # Theme switching functionality
│   └── smooth-scroll.js   # Enhanced scrolling and animations
├── images/
│   ├── profile-cody.jpg   # Profile photo (SVG placeholder)
│   ├── project-*.jpg      # Project images (SVG placeholders)
└── README.md
```

## 🎨 Theming

The page supports four theme modes:

1. **System** (default): Follows user's OS preference
2. **Light**: Bright theme with warm colors
3. **Dark**: Dark theme optimized for low light
4. **High Contrast**: Maximum contrast for accessibility

Themes are automatically saved to localStorage and persist between visits.

## ♿ Accessibility Features

- Semantic HTML5 structure with proper landmarks
- Skip to main content link
- Keyboard navigation for all interactive elements
- High contrast theme option
- Respects `prefers-reduced-motion` for animations
- Screen reader announcements for theme changes
- Proper focus management and visible focus indicators
- Alt text for all images

## 📱 Responsive Breakpoints

- **320px+**: Mobile-first base styles
- **480px+**: Small tablet adjustments
- **768px+**: Tablet layout improvements
- **1024px+**: Desktop two-column layout
- **1280px+**: Large desktop optimizations

## 🔧 Customization

### Colors

Update CSS custom properties in `css/theme.css`:

```css
:root {
  --color-bg-primary: #e9e6e1;
  --color-text-primary: #282828;
  --color-accent: #2169eb;
  /* ... more variables */
}
```

### Images

Replace placeholder images in the `images/` directory with:

- `profile-cody.jpg` (400x528px recommended)
- Project images (567x319px recommended)

### Content

Update text content directly in `index.html`.

## 🌐 Browser Support

- ✅ Chrome/Chromium (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## �️ Database Integration

This yearbook page features a live signatures section powered by Supabase:

### Features

- **Real-time Signatures**: Visitors can sign the yearbook with their name and message
- **Persistent Storage**: All signatures are stored in a Supabase database
- **Duplicate Prevention**: Uses name+message hashing to prevent duplicate submissions
- **Input Validation**: Character limits and required field validation
- **Responsive Form**: Accessible form with real-time character counting

### Database Schema

The `signatures` table includes:

- `uuid`: Primary key (auto-generated)
- `display_name`: Signer's name (max 50 chars)
- `message`: Signature message (max 280 chars)
- `created_at`: Timestamp (auto-generated)
- `name_message_hash`: SHA-256 hash for duplicate prevention

### Setup

The Supabase integration is already configured with:

- **URL**: `https://nsekyszlngwopwraffow.supabase.co`
- **Client**: Loaded via CDN from jsDelivr
- **Authentication**: Uses anonymous access with public API key

No additional setup required - signatures work out of the box!

## �📞 Contact

- **Name**: Cody Sorgenfrey
- **Role**: Professor | Edge / Design system
- **Quote**: "Code is like humor. When you have to explain it, it's bad."

---

Built with ❤️ using vanilla web technologies and Supabase
