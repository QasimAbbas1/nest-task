# Task Manager API

A REST API built with NestJS to manage users and their tasks.

## Features

- User authentication with JWT
- Role-based access control (User/Admin)
- CRUD operations for tasks
- PostgreSQL database integration
- Docker containerization
- Unit tests

## API Endpoints

### Authentication

- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login and get JWT token

### Users

- **GET** `/users/profile` - Get current user profile

### Tasks

- **GET** `/tasks` - Get all tasks (users see only their own tasks, admins see all)
- **GET** `/tasks/:id` - Get a specific task by ID
- **POST** `/tasks` - Create a new task
- **PATCH** `/tasks/:id` - Update a task
- **DELETE** `/tasks/:id` - Delete a task

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Setup

1. Clone the repository
2. Copy the `.env.example` file to `.env` and update values if needed
3. Build and run the Docker containers:

```bash
docker-compose up --build
```

The API will be available at http://localhost:3000

### Running Tests

```bash
# Run unit tests
npm test
```

## Technical Details

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport.js with JWT
- **Validation**: class-validator
- **Containerization**: Docker

## Database Schema

### User Entity
- id (UUID)
- username (string, unique)
- email (string, unique)
- password (string, hashed)
- role (enum: 'user' | 'admin')
- tasks (relation to Task)

### Task Entity
- id (UUID)
- title (string)
- description (string)
- status (enum: 'OPEN' | 'IN_PROGRESS' | 'DONE')
- user (relation to User)
- userId (string)