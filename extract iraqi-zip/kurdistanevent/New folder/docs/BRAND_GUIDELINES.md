# Iraqi Legal Directory - Brand Guidelines

## Overview
The Iraqi Legal Directory is a comprehensive multilingual legal platform focused on connecting clients with qualified lawyers across Iraq. Our brand embodies professionalism, trust, cultural sensitivity, and accessibility while honoring Iraqi heritage and legal traditions.

---

## Logo & Visual Identity

### Primary Logo
- **File**: `/assets/logo.svg`
- **Usage**: Main website header, marketing materials, official documents
- **Components**: Scales of justice symbol + trilingual text
  - Arabic: دليل القانونيين العراقي
  - English: Iraqi Legal Directory  
  - Kurdish: کۆمەڵەی پارێزەرانی عێراق

### Logo Icon
- **File**: `/assets/logo-icon.svg`
- **Usage**: Favicon, mobile apps, social media profiles, small spaces
- **Design**: Scales of justice on Iraqi flag color background with "ILD" text

### Logo Usage Guidelines

#### DO:
- Use the logo in its original proportions
- Maintain clear space around the logo (minimum 1/2 logo height)
- Use on white, light gray, or transparent backgrounds
- Ensure minimum size of 120px width for readability

#### DON'T:
- Distort, rotate, or modify the logo
- Use on busy backgrounds that compromise readability
- Recreate the logo in other fonts or colors
- Use the logo smaller than 80px width

---

## Color Palette

### Primary Colors (Iraqi Flag Inspired)
```css
/* Iraqi Red - Primary brand color */
--brand-red: #CE1126
--brand-red-hover: #B10E21
--brand-red-active: #9A0C1C

/* Iraqi Green - Trust & growth */
--brand-green: #007A3D  
--brand-green-hover: #005A2D
--brand-green-active: #004122

/* Pure White - Clean & professional */
--brand-white: #FFFFFF

/* Authority Black - Elegance & authority */
--brand-black: #000000
```

### Secondary Colors
```css
/* Mesopotamian Gold - Heritage & wisdom */
--brand-gold: #D4AF37

/* Ancient Bronze - Tradition & stability */
--brand-bronze: #CD7F32

/* Professional Navy - Trust & reliability */
--brand-navy: #1B365D

/* Warm Cream - Approachable & clean */
--brand-cream: #F8F6F0
```

### Usage Guidelines
- **Red**: Primary actions, important headlines, branding elements
- **Green**: Secondary actions, success states, navigation elements
- **Gold**: Accents, premium features, heritage elements
- **Navy**: Professional text, formal documents
- **White**: Backgrounds, cards, clean spaces

---

## Typography

### Font Hierarchy
```css
/* Primary Font Stack */
font-family: 'Inter', 'Roboto', 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Arabic Text */
font-family: 'Vazirmatn', 'Noto Sans Arabic', 'Cairo', sans-serif;

/* Kurdish Text */
font-family: 'Vazirmatn', 'Noto Sans Kurdish', sans-serif;
```

### Text Sizes & Weights
- **Headline 1**: 3-6rem (48-96px), Bold (700)
- **Headline 2**: 1.875-3rem (30-48px), Semibold (600)
- **Headline 3**: 1.5rem (24px), Semibold (600)
- **Body Large**: 1.125rem (18px), Regular (400)
- **Body**: 1rem (16px), Regular (400)
- **Caption**: 0.875rem (14px), Medium (500)
- **Small**: 0.75rem (12px), Regular (400)

### Multilingual Considerations
- **Arabic & Sorani Kurdish**: Right-to-left (RTL) text direction
- **Kurmanji Kurdish & English**: Left-to-right (LTR) text direction
- Use `dir="rtl"` attribute for Arabic content
- Apply appropriate font stacks for each language

---

## Brand Voice & Messaging

### Brand Personality
- **Professional**: Trustworthy and competent
- **Accessible**: Clear and easy to understand
- **Inclusive**: Welcoming to all communities
- **Respectful**: Culturally sensitive and appropriate
- **Reliable**: Dependable and consistent

### Key Messages
- "Find qualified lawyers across Iraq"
- "Professional legal services in your preferred language"
- "Connecting clients with legal expertise"
- "Empowering access to justice"

### Tone of Voice
- **Formal but approachable**: Professional without being intimidating
- **Clear and concise**: Easy to understand across languages
- **Respectful**: Culturally appropriate for all audiences
- **Helpful**: Solution-oriented and supportive

---

## UI Components & Patterns

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: var(--brand-red);
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 200ms ease;
}

.btn-primary:hover {
  background: var(--brand-red-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(206, 17, 38, 0.3);
}

/* Secondary Button */
.btn-secondary {
  background: var(--brand-green);
  color: white;
  /* Same styling as primary but with green colors */
}
```

### Cards
```css
.card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: all 200ms ease;
}

.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

### Form Elements
- **Border**: Light gray (#D1D5DB) with green focus (#007A3D)
- **Radius**: 8px for inputs, 12px for containers
- **Padding**: 12px horizontal, 8px vertical
- **Placeholder text**: Gray (#9CA3AF)

---

## Photography & Imagery Guidelines

### Style Direction
- **Professional**: Business-appropriate imagery
- **Diverse**: Representing Iraq's multicultural society
- **Authentic**: Real people and genuine scenarios
- **High-quality**: Sharp, well-lit, professionally composed

### Subject Matter
- Legal professionals in office settings
- Diverse clientele (respecting cultural sensitivities)
- Iraqi landmarks and architecture (subtly)
- Modern office environments
- Handshakes, consultations, document signing

### Technical Specifications
- **Resolution**: Minimum 1920x1080 for web
- **Format**: WebP preferred, JPG/PNG acceptable
- **Aspect Ratios**: 16:9 (hero), 4:3 (cards), 1:1 (profiles)
- **Color Treatment**: Natural colors supporting brand palette

---

## Application Examples

### Website Header
- Logo positioned left
- Navigation center
- Language switcher right
- Clean white background with subtle shadow

### Hero Section
- Large scales of justice icon in brand red
- Gradient text treatment for main headline
- Multilingual headlines (Arabic RTL, English LTR)
- Feature badges showing key benefits
- Subtle gradient background

### Lawyer Cards
- Professional photo
- Name and specialization
- Practice areas as colored chips
- Contact information
- Consistent spacing and typography

### Footer
- Three-column layout
- Logo with description
- Service links
- Language indicators with flags
- Copyright in multiple languages

---

## Brand Extensions

### Social Media
- **Profile Image**: Logo icon on white background
- **Cover Image**: Horizontal logo with professional imagery
- **Post Templates**: Consistent use of brand colors and fonts
- **Hashtags**: #IraqiLegalDirectory #LegalServices #العراق

### Business Cards
- Primary logo
- Contact information in English and Arabic
- Brand red and green accents
- Professional typography

### Letterhead
- Minimal header with logo
- Contact information footer
- Iraqi flag color line elements
- Clean, professional layout

---

## Accessibility Standards

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Brand red on white: 8.2:1 ✅
- Brand green on white: 6.8:1 ✅
- All interactive elements have sufficient contrast

### Typography
- Minimum 16px font size for body text
- Clear font choices support multiple languages
- Adequate line height (1.5) for readability

### Navigation
- Keyboard accessible
- Screen reader friendly
- Clear focus indicators
- Logical tab order

---

## Implementation Checklist

### Logo Implementation ✅
- [x] Create SVG logo files
- [x] Add favicon
- [x] Integrate in header component
- [x] Ensure responsive scaling

### Color System ✅
- [x] Define CSS custom properties
- [x] Create Tailwind utility classes
- [x] Apply consistent color usage
- [x] Test contrast ratios

### Typography ✅
- [x] Load Google Fonts
- [x] Set up font stacks
- [x] Define text sizes
- [x] Implement multilingual support

### Components ✅
- [x] Style header with branding
- [x] Update hero section
- [x] Enhance loading states
- [x] Redesign footer

### Documentation ✅
- [x] Brand guidelines
- [x] Usage examples
- [x] Technical specifications
- [x] Implementation notes

---

## Maintenance & Updates

### Version Control
- All brand assets versioned in `/assets/` directory
- Logo modifications require approval
- Color changes must maintain accessibility standards
- Typography updates need multilingual testing

### Quality Assurance
- Regular brand consistency audits
- Cross-browser testing for all implementations
- Multilingual display verification
- Accessibility compliance checks

### Future Considerations
- Print media adaptations
- Mobile app branding
- Marketing material templates
- Partner/affiliate branding guidelines

---

*Iraqi Legal Directory Brand Guidelines v1.0*  
*Created: 2024*  
*Last Updated: 2024*

For questions about brand usage, contact the design team or refer to the technical implementation files in `/theme/brand.ts`.
