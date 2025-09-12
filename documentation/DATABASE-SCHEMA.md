# Database Schema for Kurdistan/Iraq Events

## Introduction

This document provides the relational database schema for the application. It is designed to be normalized and scalable. The recommended database engine is **PostgreSQL** due to its robustness and support for JSON data types.

---

### Table: `users`

Stores information for all users, regardless of role.

| Column                | Type                     | Constraints                        | Notes                                                              |
| --------------------- | ------------------------ | ---------------------------------- | ------------------------------------------------------------------ |
| `id`                  | `UUID`                   | `PRIMARY KEY`                      | A unique identifier for the user.                                  |
| `name`                | `VARCHAR(255)`           | `NOT NULL`                         | User's full name.                                                  |
| `email`               | `VARCHAR(255)`           | `UNIQUE`, `NOT NULL`               | User's email, used for login.                                      |
| `password_hash`       | `VARCHAR(255)`           | `NOT NULL`                         | Hashed password (e.g., using bcrypt).                              |
| `profile_picture_url` | `VARCHAR(255)`           |                                    | URL to the user's profile picture.                                 |
| `language`            | `VARCHAR(2)`             | `NOT NULL`, `DEFAULT 'en'`         | User's preferred language ('en', 'ar', 'ku').                      |
| `role`                | `VARCHAR(10)`            | `NOT NULL`, `DEFAULT 'attendee'`   | User's role ('attendee', 'host', 'admin').                         |
| `created_at`          | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`        | Timestamp of account creation.                                     |
| `updated_at`          | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`        | Timestamp of the last profile update.                              |

---

### Table: `host_profiles`

Stores additional information for users with the 'host' role. This keeps host-specific data separate from the core user table.

| Column              | Type           | Constraints                               | Notes                                                |
| ------------------- | -------------- | ----------------------------------------- | ---------------------------------------------------- |
| `user_id`           | `UUID`         | `PRIMARY KEY`, `FOREIGN KEY (users.id)`   | Links to the `users` table. One-to-one relationship. |
| `business_name`     | `VARCHAR(255)` | `NOT NULL`                                | The name of the host's business or organization.     |
| `phone`             | `VARCHAR(50)`  | `NOT NULL`                                | Contact phone number.                                |
| `website`           | `VARCHAR(255)` |                                           | Optional business website URL.                       |
| `business_address`  | `TEXT`         | `NOT NULL`                                | Official business address.                           |
| `organizer_type`    | `VARCHAR(255)` | `NOT NULL`                                | Type of organizer (e.g., Venue, Instructor).         |
| `verification_status` | `VARCHAR(20)`| `NOT NULL`, `DEFAULT 'unsubmitted'` | 'unsubmitted', 'pending', 'approved', 'rejected'.    |
| `updated_at`        | `TIMESTAMP`    | `NOT NULL`, `DEFAULT NOW()`               |                                                      |

---

### Table: `events`

Stores all event information.

| Column             | Type                       | Constraints                               | Notes                                                            |
| ------------------ | -------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `id`               | `UUID`                     | `PRIMARY KEY`                             | A unique identifier for the event.                               |
| `title`            | `JSONB`                    | `NOT NULL`                                | `{"en": "Title", "ar": "...", "ku": "..."}`                      |
| `description`      | `JSONB`                    | `NOT NULL`                                | `{"en": "Desc", "ar": "...", "ku": "..."}`                       |
| `date`             | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`                                | The date and time of the event.                                  |
| `location_address` | `TEXT`                     | `NOT NULL`                                | The human-readable address of the event.                         |
| `location_lat`     | `DECIMAL(9,6)`             | `NOT NULL`                                | Latitude coordinate.                                             |
| `location_lng`     | `DECIMAL(9,6)`             | `NOT NULL`                                | Longitude coordinate.                                            |
| `image_url`        | `VARCHAR(255)`             | `NOT NULL`                                | URL of the event image (stored in cloud storage).                |
| `is_promoted`      | `BOOLEAN`                  | `NOT NULL`, `DEFAULT false`               | Flag for sponsored/promoted events.                              |
| `creator_id`       | `UUID`                     | `NOT NULL`, `FOREIGN KEY (users.id)`      | The ID of the user who created the event.                        |
| `category_id`      | `UUID`                     | `NOT NULL`, `FOREIGN KEY (categories.id)` | The ID of the event's category.                                  |
| `city_id`          | `UUID`                     | `NOT NULL`, `FOREIGN KEY (cities.id)`     | The ID of the event's city.                                      |
| `created_at`       | `TIMESTAMP`                | `NOT NULL`, `DEFAULT NOW()`               |                                                                  |
| `updated_at`       | `TIMESTAMP`                | `NOT NULL`, `DEFAULT NOW()`               |                                                                  |

---

### Table: `event_attendees`

A join table to manage the many-to-many relationship between users and events.

| Column    | Type   | Constraints                                          | Notes                                   |
| --------- | ------ | ---------------------------------------------------- | --------------------------------------- |
| `event_id`| `UUID` | `PRIMARY KEY`, `FOREIGN KEY (events.id)`             | Part of the composite primary key.      |
| `user_id` | `UUID` | `PRIMARY KEY`, `FOREIGN KEY (users.id)`              | Part of the composite primary key.      |
| `joined_at`|`TIMESTAMP` | `NOT NULL`, `DEFAULT NOW()`                      | When the user marked their attendance.  |

---

### Table: `categories`

Stores event categories.

| Column          | Type           | Constraints   | Notes                               |
| --------------- | -------------- | ------------- | ----------------------------------- |
| `id`            | `UUID`         | `PRIMARY KEY` | Unique ID for the category.         |
| `translation_key` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Key for frontend translations.      |
| `icon`          | `VARCHAR(255)` | `NOT NULL`    | Name of the Lucide icon.            |
| `sponsor_id`    | `UUID`         | `FOREIGN KEY (sponsors.id)` | Optional sponsor for the category.  |

---

### Table: `cities`

Stores cities where events can take place.

| Column | Type    | Constraints   | Notes                                   |
| ------ | ------- | ------------- | --------------------------------------- |
| `id`   | `UUID`  | `PRIMARY KEY` | Unique ID for the city.                 |
| `name` | `JSONB` | `NOT NULL`    | `{"en": "Erbil", "ar": "...", "ku": "..."}` |

---

### Table: `sponsors`

Stores sponsor information.

| Column    | Type           | Constraints   | Notes                 |
| --------- | -------------- | ------------- | --------------------- |
| `id`      | `UUID`         | `PRIMARY KEY` | Unique ID for the sponsor. |
| `name`    | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Sponsor's name.       |
| `logo_url`| `VARCHAR(255)` | `NOT NULL`    | URL to the sponsor's logo. |

---

### Table: `banners`

Stores promotional banner ads.

| Column         | Type           | Constraints                      | Notes                                          |
| -------------- | -------------- | -------------------------------- | ---------------------------------------------- |
| `id`           | `UUID`         | `PRIMARY KEY`                    | Unique ID for the banner.                      |
| `sponsor_id`   | `UUID`         | `NOT NULL`, `FOREIGN KEY (sponsors.id)` | The sponsor of the banner.                |
| `image_url`    | `VARCHAR(255)` | `NOT NULL`                       | URL of the banner image.                       |
| `link_url`     | `VARCHAR(255)` | `NOT NULL`                       | The URL the banner links to.                   |
| `target_city_id` | `UUID`       | `FOREIGN KEY (cities.id)`        | The city to target. `NULL` for all cities.     |
| `placement`    | `VARCHAR(50)`  | `NOT NULL`                       | e.g., 'home_top', 'details_bottom'.            |

---

### Table: `messages`

Stores direct messages between users.

| Column      | Type                       | Constraints                               | Notes                                 |
| ----------- | -------------------------- | ----------------------------------------- | ------------------------------------- |
| `id`        | `UUID`                     | `PRIMARY KEY`                             | Unique ID for the message.            |
| `sender_id` | `UUID`                     | `NOT NULL`, `FOREIGN KEY (users.id)`      | The user who sent the message.        |
| `receiver_id`| `UUID`                    | `NOT NULL`, `FOREIGN KEY (users.id)`      | The user who received the message.    |
| `text`      | `TEXT`                     | `NOT NULL`                                | The content of the message.           |
| `is_read`   | `BOOLEAN`                  | `NOT NULL`, `DEFAULT false`               | Read status of the message.           |
| `timestamp` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT NOW()`               | When the message was sent.            |
