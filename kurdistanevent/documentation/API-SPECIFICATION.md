# API Specification for Kurdistan/Iraq Events

## Introduction

This document outlines the complete API required to power the "Kurdistan/Iraq Events" frontend application. A backend server must implement these endpoints to replace the current mock API.

**Base URL:** All endpoint URLs should be prefixed with a base URL, e.g., `https://api.yourdomain.com/v1`.

**Authentication:** Endpoints marked with `🔒 Auth required` must be protected. The server should validate the `session_token` JWT sent in an `HttpOnly` cookie with each request. The user's ID and role can be extracted from this token for authorization.

---

## 1. Authentication (`/auth`)

### 1.1. User Registration

*   **Endpoint:** `POST /auth/register`
*   **Description:** Creates a new user account (attendee or host).
*   **Auth:** Not required.
*   **Request Body:**
    ```json
    {
      "name": "string",
      "email": "string (email format)",
      "password": "string (min 8 chars)",
      "role": "'attendee' or 'host'"
    }
    ```
*   **Response (201 Created):**
    *   Sets a secure `HttpOnly` cookie with the session token.
    *   **Body:**
        ```json
        {
          "user": {
            "id": "string (uuid)",
            "name": "string",
            "email": "string",
            "role": "string",
            // ... other user fields from DB schema
          }
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data.
    *   `409 Conflict`: A user with this email already exists.

### 1.2. User Login

*   **Endpoint:** `POST /auth/login`
*   **Description:** Authenticates a user and starts a session.
*   **Auth:** Not required.
*   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
*   **Response (200 OK):**
    *   Sets a secure `HttpOnly` cookie with the session token.
    *   **Body:**
        ```json
        {
          "user": { /* User object */ }
        }
        ```
*   **Error Responses:**
    *   `401 Unauthorized`: Invalid credentials.

### 1.3. Get Current User

*   **Endpoint:** `GET /auth/me`
*   **Description:** Retrieves the profile of the currently authenticated user.
*   **Auth:** `🔒 Auth required`.
*   **Response (200 OK):**
    ```json
    {
      "user": { /* User object */ }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: No valid session token.

### 1.4. User Logout

*   **Endpoint:** `POST /auth/logout`
*   **Description:** Ends the user's session.
*   **Auth:** `🔒 Auth required`.
*   **Response (204 No Content):**
    *   Clears the `session_token` cookie.

---

## 2. Users (`/users`)

### 2.1. Get User by ID

*   **Endpoint:** `GET /users/:id`
*   **Description:** Retrieves the public profile of a specific user.
*   **Auth:** `🔒 Auth required`.
*   **Response (200 OK):**
    ```json
    {
      "user": { /* Public user fields only */ }
    }
    ```
*   **Error Responses:**
    *   `404 Not Found`: User does not exist.

### 2.2. Update User Language

*   **Endpoint:** `PATCH /users/me/language`
*   **Description:** Updates the language preference for the current user.
*   **Auth:** `🔒 Auth required`.
*   **Request Body:**
    ```json
    {
      "language": "'en' or 'ar' or 'ku'"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "user": { /* Updated user object */ }
    }
    ```

### 2.3. Update Host Profile

*   **Endpoint:** `PUT /users/me/host-profile`
*   **Description:** Allows a host to submit or update their business profile for verification.
*   **Auth:** `🔒 Auth required` (Role must be 'host').
*   **Request Body:**
    ```json
    {
      "businessName": "string",
      "phone": "string",
      "website": "string (optional)",
      "businessAddress": "string",
      "organizerType": "string"
    }
    ```
*   **Response (200 OK):**
    *   **Note:** The backend should set the user's `verificationStatus` to `pending`.
    ```json
    {
      "user": { /* Updated user object */ }
    }
    ```

---

## 3. Events (`/events`)

### 3.1. Get All Events

*   **Endpoint:** `GET /events`
*   **Description:** Retrieves a list of events, with filtering options.
*   **Auth:** `🔒 Auth required`.
*   **Query Parameters:**
    *   `cityId` (string, optional)
    *   `categoryId` (string, optional)
*   **Response (200 OK):**
    ```json
    {
      "events": [ /* Array of Event objects */ ]
    }
    ```

### 3.2. Create an Event

*   **Endpoint:** `POST /events`
*   **Description:** Creates a new event.
*   **Auth:** `🔒 Auth required` (User role must be 'attendee' or 'host' with 'approved' status).
*   **Request Body:**
    ```json
    {
      "title": { "en": "string", "ar": "string", "ku": "string" },
      "description": { "en": "string", "ar": "string", "ku": "string" },
      "date": "string (ISO 8601)",
      "location_address": "string",
      "location_latLng": "string (lat,lng)",
      "image": "string (Base64 data URI)", // Backend should handle upload to cloud storage
      "categoryId": "string",
      "cityId": "string"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "event": { /* Newly created Event object */ }
    }
    ```

### 3.3. Get Event by ID

*   **Endpoint:** `GET /events/:id`
*   **Description:** Retrieves details for a single event.
*   **Auth:** `🔒 Auth required`.
*   **Response (200 OK):**
    ```json
    {
      "event": { /* Full Event object with creator and attendees populated */ }
    }
    ```
*   **Error Responses:**
    *   `404 Not Found`: Event does not exist.

### 3.4. Toggle Event Attendance

*   **Endpoint:** `POST /events/:id/attendance`
*   **Description:** Allows a user to mark or unmark their attendance for an event.
*   **Auth:** `🔒 Auth required`.
*   **Response (200 OK):**
    ```json
    {
      "event": { /* Updated Event object with new attendees list */ }
    }
    ```

---

## 4. Static Data (`/data`)

### 4.1. Get Categories

*   **Endpoint:** `GET /data/categories`
*   **Description:** Retrieves the list of all event categories.
*   **Auth:** Not required.
*   **Response (200 OK):**
    ```json
    {
      "categories": [ /* Array of Category objects */ ]
    }
    ```

### 4.2. Get Cities

*   **Endpoint:** `GET /data/cities`
*   **Description:** Retrieves the list of all cities.
*   **Auth:** Not required.
*   **Response (200 OK):**
    ```json
    {
      "cities": [ /* Array of City objects */ ]
    }
    ```

### 4.3. Get Banners

*   **Endpoint:** `GET /data/banners`
*   **Description:** Retrieves promotional banners based on placement and city.
*   **Auth:** Not required.
*   **Query Parameters:**
    *   `placement`: "'home_top' or 'details_bottom'" (required)
    *   `cityId`: "string" (optional)
*   **Response (200 OK):**
    ```json
    {
      "banners": [ /* Array of Banner objects */ ]
    }
    ```

---

## 5. Messaging (`/messages`)

This functionality should ideally be implemented using **WebSockets** for a real-time experience, but a RESTful approach is documented here for simplicity.

### 5.1. Get Conversation

*   **Endpoint:** `GET /messages/:otherUserId`
*   **Description:** Retrieves the message history between the current user and another user.
*   **Auth:** `🔒 Auth required`.
*   **Response (200 OK):**
    ```json
    {
      "messages": [ /* Array of Message objects, sorted by timestamp */ ]
    }
    ```

### 5.2. Send Message

*   **Endpoint:** `POST /messages`
*   **Description:** Sends a new message to a user.
*   **Auth:** `🔒 Auth required`.
*   **Request Body:**
    ```json
    {
      "receiverId": "string",
      "text": "string"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "message": { /* The newly created Message object */ }
    }
    ```
