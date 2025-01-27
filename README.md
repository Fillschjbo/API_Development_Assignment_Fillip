# API_Development_Assignment_Fillip
Users can keep track of fragrances in their own collection and view friends and other users collections


# Fragrance Management API

This API is designed for managing users and their associated fragrances. It provides endpoints for user authentication, CRUD operations on users and fragrances, and token-based access control.

## Prerequisites

Before running the application, ensure you have:

- Node.js installed
- MySQL database configured

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating a `.env` file:
   ```plaintext
   PORT=3000
   SECRET=<your_jwt_secret>
   DB_HOST=<your_database_host>
   DB_USER=<your_database_user>
   DB_NAME=<your_database_name>
   DB_PASSWORD=<your_database_password>
   DB_PORT=<your_database_port>
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will start on the specified port (default: 3000).

## Endpoints

### Authentication Middleware

- `authenticateToken`: Ensures the presence and validity of the JWT token in the `Authorization` header.

### User Endpoints

#### Create a User
- **POST** `/user`
- **Request Body:**
  ```json
  {
      "username": "string",
      "email": "string",
      "password": "string"
  }
  ```
- **Response:** Returns the created user data.

#### Fetch Users
- **GET** `/user`
- **Query Parameters:**
  - `sort` (optional, default: `id`): Column to sort by.
  - `sortOrder` (optional, default: `ASC`): Sort order (ASC or DESC).
- **Response:** List of users.

### Authentication Endpoints

#### User Login
- **POST** `/login`
- **Request Body:**
  ```json
  {
      "username": "string",
      "password": "string"
  }
  ```
- **Response:** JWT token and user details.

### Fragrance Endpoints

#### Fetch All Fragrances
- **GET** `/fragrances`
- **Query Parameters:**
  - `sort` (optional, default: `id`): Column to sort by.
  - `sortOrder` (optional, default: `DESC`): Sort order (ASC or DESC).
- **Response:** List of fragrances.

#### Fetch Fragrances by Username
- **GET** `/fragrances/:username`
- **Query Parameters:**
  - `sort` (optional, default: `id`): Column to sort by.
  - `sortOrder` (optional, default: `DESC`): Sort order (ASC or DESC).
- **Response:** List of fragrances belonging to the user.

#### Create a Fragrance
- **POST** `/fragrances`
- **Request Headers:**
  ```plaintext
  Authorization: Bearer <token>
  ```
- **Request Body:**
  ```json
  {
      "brand": "string",
      "name": "string",
      "scent_profile": "string",
      "img_url": "string",
  }
  ```
- **Response:** Created fragrance data.

#### Delete a Fragrance
- **DELETE** `/fragrances/:id`
- **Request Headers:**
  ```plaintext
  Authorization: Bearer <token>
  ```
- **Response:** Confirmation of deletion or error message.

## Error Handling

- **401 Unauthorized:** Missing or invalid token.
- **403 Forbidden:** Invalid token or unauthorized action.
- **404 Not Found:** Resource not found.
- **500 Internal Server Error:** Server-side error.


