# Kurdistan/Iraq Events - Frontend Application

This repository contains the complete frontend code for the "Kurdistan/Iraq Events" application, a platform for discovering and creating local events.

## About The Project

This is a production-ready React frontend built with TypeScript, Tailwind CSS, and React Router. It's designed to be a fast, responsive, and user-friendly Progressive Web App (PWA).

### Features Implemented:
-   **Role-Based Authentication:** Separate flows for Attendees and Hosts.
-   **Event Discovery:** Filterable list of events by city and category.
-   **Social Features:** Users can mark their attendance and see who else is going.
-   **Event Creation:** A multi-step flow for hosts to create new events, including an approval process.
-   **Direct Messaging:** Real-time chat between users, and between users and admins.
-   **PWA Ready:** The application is installable on mobile and desktop devices.
-   **Multi-Language Support:** English, Arabic, and Kurdish translations.
-   **Secure Frontend:** Adheres to security best practices by avoiding `localStorage` for session tokens.

---

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    This project uses dependencies managed via an `importmap` in `index.html`. No `npm install` is required for the provided libraries. For local development with other packages, you would use:
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google Maps API key.
    ```
    VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
    ```
    *Refer to `/documentation/GOOGLE-MAPS-SETUP.md` for instructions on getting a key.*

4.  **Run the development server:**
    Use a local server to run the `index.html` file. A common choice is `vite`.
    ```sh
    npm install -g vite
    vite
    ```
    The application will be available at `http://localhost:5173`.

---

## CRITICAL: Mock API & Next Steps

This frontend is currently powered by a **mock API** located in `src/services/api.ts`. This mock service uses the browser's `localStorage` to simulate a database.

**This is NOT secure and is for demonstration purposes ONLY.**

To move this application to production, you **MUST** build a secure backend server. All necessary specifications and guides are provided in the `/documentation` folder.

-   **/documentation/PROJECT-ROADMAP.md**: Your high-level guide for launching the application.
-   **/documentation/API-SPECIFICATION.md**: The complete API contract for your backend developer.
-   **/documentation/DATABASE-SCHEMA.md**: The database structure to be implemented on the server.

Please review these documents carefully to proceed.
