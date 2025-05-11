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


3. Fallback: Can also be started without docker using "npm start"

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



<!-- DESIGN DECISION -->
The application employs a robust security-focused design, utilizing UUID primary keys instead of sequential IDs to prevent enumeration attacks and enhance data privacy. Passport.js with JWT strategy provides flexible authentication, allowing stateless, scalable auth management through token-based sessions that work seamlessly across different clients. The system implements role-based access control (RBAC) with distinct user and admin roles, providing strong data isolation where regular users can only access their own tasks while admins have broader system visibility.The architecture follows clean separation of concerns with dedicated modules for authentication, users, and tasks, each containing focused controllers and services.

<!-- AREAS OF IMPROVMENT -->
Not adding new features here but mentioning those that are generally covered in task description but not specified specifically.
1. Currently Admin role is set as Database Level, while it can be setup over endpoint,
2. Add ability for admins to manage users, update roles etc.
