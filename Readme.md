# Node CRUD API
[Assignment](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)  
[Score](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/score.md)

[A Modern Node.js + TypeScript Setup for 2025](https://dev.to/woovi/a-modern-nodejs-typescript-setup-for-2025-nlk)


# CRUD API

A simple Node.js + TypeScript REST API for managing users, built for educational purposes as part of the Rolling Scopes NodeJS 2025Q2 course.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
  - [Cluster/Load Balancer Mode](#clustermulti-process-mode)
- [API Usage](#api-usage)
  - [User Endpoints](#user-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- RESTful CRUD operations for users (in-memory database)
- Written in TypeScript
- Supports single-process and multi-process (cluster) modes
- Includes a comprehensive test suite
- Modern Node.js (ES2022+) and ESM support

---

## Requirements

- **Node.js** v22.14.0 or higher
- **npm** (comes with Node.js)

---

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/JesperHogstedDk/crud-api.git
   cd crud-api
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

---

## Running the Application

### Development Mode

Runs the server with TypeScript source and auto-reload (if supported):

```sh
npm run start:dev
```

- The server will start on [http://localhost:3000](http://localhost:3000)
- Requests are logged to the console.

### Production Mode

Builds the TypeScript source and runs the compiled JavaScript:

```sh
npm run start:prod
```

- The server will start on [http://localhost:3000](http://localhost:3000)

### Cluster/Multi-Process Mode

Starts a load balancer and multiple worker processes for better CPU utilization:

```sh
npm run start:multi
```

- The load balancer listens on [http://localhost:3000](http://localhost:3000)
- Requests are distributed to worker processes.

---

## API Usage

### User Endpoints

All endpoints are prefixed with `/api/users`.

#### Get all users

```http
GET /api/users
```

- **Response:** `200 OK`  
  Returns an array of users.

#### Get user by ID

```http
GET /api/users/{userId}
```

- **Response:** `200 OK` with user object, or `404 Not Found` if not found.

#### Create a new user

```http
POST /api/users
Content-Type: application/json

{
  "username": "Alice",
  "age": 25,
  "hobbies": ["Reading", "Gaming"]
}
```

- **Response:** `201 Created` with created user object.

#### Update a user

```http
PUT /api/users/{userId}
Content-Type: application/json

{
  "username": "Alice Updated",
  "age": 26,
  "hobbies": ["Chess"]
}
```

- **Response:** `200 OK` with updated user, or `404 Not Found`.

#### Delete a user

```http
DELETE /api/users/{userId}
```

- **Response:** `204 No Content` if deleted, or `404 Not Found`.

---

## Testing

The project uses [node:test](https://nodejs.org/api/test.html) and [supertest](https://github.com/ladjs/supertest) for testing.

### Run all tests

```sh
npm run test:all
```

### Run individual test suites

- **Database tests:**  
  `npm run test:db`

- **API tests:**  
  `npm run test:api`

- **Server error handling tests:**  
  `npm run test:index`

---

## Project Structure

```
.
├── src/
│   ├── db/
│   │   └── database.ts
│   ├── routes/
│   │   └── users.ts
│   ├── cluster.ts
│   └── index.ts
├── tests/
│   ├── database.test.ts
│   ├── userApi.test.ts
│   └── index.test.ts
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── Readme.md
```

---

## Troubleshooting

- **Port in use:**  
  If you get an error about port 3000 being in use, stop any other processes using that port or change the port by setting the `PORT` environment variable.

- **Tests hang and do not exit:**  
  Ensure all servers are properly closed after tests. This is already handled in the test files with `test.after(() => { server.close(); })`.

- **Dynamic imports fail:**  
  Make sure you are running Node.js v22.14.0+ and using the correct `NODE_ENV` for your mode.

---

## License

ISC

---

**Author:** JesperHogstedDk  
[GitHub Repository](https://github.com/JesperHogstedDk/crud-api)