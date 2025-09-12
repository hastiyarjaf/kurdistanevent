# Project Roadmap: From Prototype to Production

## Introduction

This document outlines the strategic roadmap to transition the "Kurdistan/Iraq Events" application from its current state (a production-ready frontend with a mock API) to a fully-deployed, secure, and scalable production application.

This frontend has been built to security best practices, specifically by **avoiding the use of `localStorage` for session tokens**. It is ready to integrate with a secure backend that uses `HttpOnly` cookies for session management.

Follow these phases in order to launch successfully.

---

## Phase 1: Backend Development (Critical Path)

This is the most critical phase. The current mock API (`src/services/api.ts`) must be replaced by a real, secure, server-side application.

**Objective:** Build a backend server that fulfills the API contract specified in `API-SPECIFICATION.md` and uses the database structure defined in `DATABASE-SCHEMA.md`.

### Your Actionable Steps:

1.  **Hire a Backend Developer or Choose a BaaS (Backend-as-a-Service):**
    *   **Option A (Recommended):** Hire a backend developer (e.g., Node.js, Python, Go). Provide them with the `API-SPECIFICATION.md` and `DATABASE-SCHEMA.md` documents. These are their blueprints.
    *   **Option B:** Use a BaaS like Firebase or Supabase. This can be faster but may be less flexible. You will need to map the provided API/DB specifications to the services offered by the platform.

2.  **Implement the Secure Authentication Flow:**
    The backend developer **must** implement the authentication flow specified in the **Appendix** of this document. This involves using JWTs (JSON Web Tokens) and storing them in secure, `HttpOnly` cookies. This is non-negotiable for security.

3.  **Implement the API Endpoints:**
    The developer will create every endpoint listed in `API-SPECIFICATION.md`, connecting them to the database.

4.  **Connect the Frontend:**
    Once the backend is live, update the frontend's API service file (`src/services/api.ts`) to point to your new backend API URL. All function calls should work as expected with minimal changes.

---

## Phase 2: Third-Party Service Configuration

**Objective:** Correctly configure and secure all external services the app relies on.

### Your Actionable Steps:

1.  **Google Maps API Key:**
    *   Follow the detailed guide in `GOOGLE-MAPS-SETUP.md`.
    *   This involves creating a Google Cloud project, enabling the correct APIs, enabling billing, and restricting your API key to prevent unauthorized use.

2.  **Image Storage (for Event Photos):**
    *   The backend will need a solution for storing user-uploaded images.
    *   **Recommendation:** Use a cloud storage service like **Amazon S3**, **Google Cloud Storage**, or **Cloudinary**. The backend developer will integrate this service.

---

## Phase 3: Deployment

**Objective:** Deploy the frontend and backend applications to live, public URLs.

### Your Actionable Steps:

1.  **Deploy the Frontend:**
    *   Choose a frontend hosting provider. **Vercel** and **Netlify** are highly recommended for their ease of use with React applications.
    *   Follow the `DEPLOYMENT-GUIDE.md` for instructions.
    *   You will need to configure your environment variables (e.g., `VITE_GOOGLE_MAPS_API_KEY` and the `VITE_API_BASE_URL` for your new backend) in the hosting provider's dashboard.

2.  **Deploy the Backend:**
    *   Your backend developer will handle this. Common choices include Heroku, AWS Elastic Beanstalk, or DigitalOcean.

---

## Phase 4: App Store Submission (Optional)

**Objective:** Make the application installable from the Apple App Store and Google Play Store.

### Your Actionable Steps:

1.  **Ensure PWA readiness:** The app is already configured as a PWA with its `manifest.json`.
2.  **Use a PWA-to-Store Service:**
    *   **Recommendation:** Use a service like **PWABuilder** (a free tool from Microsoft). It can analyze your deployed PWA's URL and package it for submission to the Google Play Store and, with more steps, the Apple App Store.
3.  **Follow the Checklist:**
    *   Use the `APP-STORE-CHECKLIST.md` to prepare your store listings, including screenshots, descriptions, and privacy policy links.

---

## Appendix: Secure Authentication Flow (Technical Specification)

This is the required flow for the backend developer to implement.

**Core Principle:** The frontend **never** sees or stores the final authentication token. The session is managed entirely by the browser and the backend via a secure cookie.

### Login Sequence Diagram:

```
Frontend           Backend
   |                  |
   |---(1) Login Req--->| (Email, Password)
   |                  |
   |                  |---(2) Validate Credentials
   |                  |---(3) Generate JWT
   |                  |---(4) Set HttpOnly Cookie
   |                  |
   |<--(5) Send Response--| (User Data, NO TOKEN)
   |                  |
```

### Pseudocode for Backend (`/api/auth/login`):

```
function login(request, response):
  // 1. Extract email and password from request body
  email = request.body.email
  password = request.body.password

  // 2. Find user in database by email
  user = database.findUserByEmail(email)
  if not user:
    return response.status(401).send("Invalid credentials")

  // 3. Verify password (using bcrypt.compare)
  isMatch = bcrypt.compare(password, user.passwordHash)
  if not isMatch:
    return response.status(401).send("Invalid credentials")

  // 4. Create a JWT (JSON Web Token)
  payload = { userId: user.id, role: user.role }
  token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

  // 5. Set the token in a secure, HttpOnly cookie
  response.cookie('session_token', token, {
    httpOnly: true, // IMPORTANT: Prevents JavaScript access
    secure: true,   // IMPORTANT: Only send over HTTPS
    sameSite: 'strict', // Mitigates CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  // 6. Send user data back to the frontend (without password hash or token)
  response.status(200).json({ user: user.publicProfile })
```

This ensures the session is secure, and the frontend code you have is perfectly designed to work with this architecture.
