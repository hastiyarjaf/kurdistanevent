# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Kurdistan/Iraq Events** is a React TypeScript application for discovering and creating local events in Kurdistan and Iraq. It's built as a **production-ready frontend** with a **mock API** that simulates a backend database using localStorage.

**⚠️ CRITICAL**: This frontend currently uses a mock API (`services/api.ts`) for demonstration purposes only. For production deployment, a secure backend server must be implemented according to the specifications in `/documentation/`.

### Key Technologies
- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0  
- **Routing**: React Router DOM 7.8.2
- **Maps**: Google Maps API via @react-google-maps/api
- **Icons**: Lucide React
- **Styling**: Tailwind CSS (configured in styles)
- **PWA**: Configured as Progressive Web App

## Essential Development Commands

### Core Development
```bash
# Install dependencies (if needed for additional packages)
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment
```bash
# Deploy to GitHub Pages (configured)
npx gh-pages -d dist
```

## Project Architecture

### High-Level Structure

**Frontend-Only Architecture**: This is a client-side application that communicates with a mock API. The authentication system is designed to work with secure HttpOnly cookies (not localStorage) when connected to a real backend.

### Key Directories

```
├── components/          # Reusable UI components
├── context/            # React Context providers (Auth, Language, Maps)  
├── hooks/              # Custom React hooks
├── pages/              # Route-level page components
├── services/           # API layer and external service integrations
├── types/              # TypeScript type definitions
├── documentation/      # Backend specifications and deployment guides
└── dist/               # Build output (generated)
```

### Core Architecture Patterns

#### **Context-Driven State Management**
The application uses React Context for global state:

- **AuthContext**: User authentication and session management
- **LanguageContext**: Multi-language support (English, Arabic, Kurdish)  
- **MapsApiStatusContext**: Google Maps API status and error handling

#### **Secure Authentication Pattern**
**Important**: The authentication is designed for production security:
- Frontend never stores session tokens in localStorage
- Designed to work with HttpOnly cookies from a backend server
- Current mock implementation uses in-memory storage that clears on refresh

#### **Mock API Architecture**
`services/api.ts` contains a complete mock backend that simulates:
- User management and authentication
- Event CRUD operations
- Messaging system
- Multi-language content
- Data stored in localStorage (development only)

#### **Internationalization (i18n)**
Built-in support for 3 languages with complete translations:
- English (en) - Default
- Arabic (ar) - RTL support ready  
- Kurdish (ku) - Regional focus

### Critical Files to Understand

#### Configuration Files
- `vite.config.ts` - Build configuration, path aliases
- `tsconfig.json` - TypeScript configuration with modern settings
- `package.json` - Dependencies and build scripts

#### Core Application Files  
- `App.tsx` - Main application with routing and context providers
- `types.ts` - Central type definitions for the entire application
- `services/api.ts` - **Complete mock backend implementation**

#### Context Providers
- `context/AuthContext.tsx` - Authentication state management
- `context/LanguageContext.tsx` - Language switching and translations
- `context/MapsApiStatusContext.tsx` - Google Maps integration status

## Development Workflow

### Local Development Setup

1. **Environment Variables** (required):
```bash
# Create .env.local file
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GEMINI_API_KEY=your_gemini_api_key_for_ai_features
```

2. **Google Maps Setup**:  
   Follow `/documentation/GOOGLE-MAPS-SETUP.md` for proper API key configuration

3. **Start Development**:
```bash
npm run dev
```

### Understanding the Mock Data

The mock API (`services/api.ts`) includes:
- **Pre-seeded users** with different roles (attendee, host, admin)
- **Sample events** across different cities and categories
- **Complete messaging system** with admin support
- **Multi-language content** for all UI elements

**Default Login Credentials** (for testing):
- Email: `bawan@example.com` | Password: `password123` (Host)
- Email: `lana@example.com` | Password: `password123` (Attendee)

### Working with Components

#### Page Components (`pages/`)
- `WelcomePage.tsx` - Authentication (login/signup)
- `HomePage.tsx` - Event discovery and filtering
- `CreateEventPage.tsx` - Event creation with Google Maps integration
- `EventDetailsPage.tsx` - Single event view with attendance tracking
- `MessagesPage.tsx` - Direct messaging between users

#### Key UI Components (`components/`)
- `Header.tsx` - Main navigation with user menu and language switcher
- `EventCard.tsx` - Reusable event display component  
- `EventGrid.tsx` - Grid layout for events with filtering
- `InteractiveMap.tsx` - Google Maps integration for location selection
- `AuthModal.tsx` - Authentication forms with role-based signup

### API Layer Understanding

The mock API simulates a REST backend with:
- **Authentication endpoints**: login, signup, profile management
- **Event endpoints**: CRUD operations with filtering
- **Messaging endpoints**: Real-time-style messaging simulation
- **Static data**: Categories, cities, banners, sponsors

**Key Functions in `services/api.ts`**:
```typescript
// Authentication
signUp(), login(), getCurrentUser()

// Events  
getEvents(), createEvent(), toggleEventAttendance()

// Messaging
getConversation(), sendMessage(), subscribeToMessages()

// Static Data
getCategories(), getCities(), getBanners()
```

## Production Deployment Prerequisites

### **CRITICAL: Backend Implementation Required**

This frontend is production-ready but requires a secure backend. See `/documentation/`:

1. **`/documentation/PROJECT-ROADMAP.md`** - Strategic implementation plan
2. **`/documentation/API-SPECIFICATION.md`** - Complete backend API contract  
3. **`/documentation/DATABASE-SCHEMA.md`** - Database structure specification

### Environment Configuration

**Required Environment Variables**:
```bash
# Google Maps (required for location features)
VITE_GOOGLE_MAPS_API_KEY=

# Gemini AI (required for event creation AI assistance)  
GEMINI_API_KEY=

# Backend API URL (when backend is implemented)
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Security Considerations

- ✅ **No localStorage for sensitive data** - Authentication designed for HttpOnly cookies
- ✅ **Environment variables** for all API keys
- ✅ **Input validation** on all forms
- ⚠️ **Mock API in services/api.ts must be replaced** with real backend calls

## Common Development Tasks

### Adding New Features

1. **New Event Categories**: Update `categories` array in mock API
2. **New Cities**: Update `cities` array in mock API  
3. **Translation Updates**: Modify `translations` object in `services/api.ts`
4. **New Components**: Follow existing patterns in `components/` directory

### Debugging

**Google Maps Issues**: Check `MapsApiStatusContext` and `components/MapError.tsx`  
**Authentication Issues**: Check browser network tab and `AuthContext`  
**Translation Issues**: Verify language keys in mock API translations object

### Testing User Flows

Use pre-seeded mock data:
- **Host Registration**: Test event creation workflow
- **Attendee Experience**: Test event discovery and attendance  
- **Messaging**: Test user-to-user and admin communication
- **Multi-language**: Switch languages to test all content

## Integration Points

### Google Maps Integration
- Location selection for events
- Interactive maps for event display  
- Requires properly configured API key with Maps JavaScript API enabled

### AI Integration (Gemini)
- Event description generation
- Image generation for events
- Requires Gemini API key configuration

### PWA Features
- Installable on mobile and desktop
- Offline capability (limited to cached resources)
- Configured in `manifest.json`
