# Task Management API

A RESTful API for task management with user authentication, built using NestJS, TypeORM, and PostgreSQL.

## Features

- **User Authentication**

  - JWT-based authentication tokens


- **Task Management**
  - Create, read, update, and delete tasks
  - Filter tasks by status and search terms
  - Task lists for organization
  - Drag-and-drop reordering

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- Docker & Docker Compose (optional)

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd task-management-api
```

### Install dependencies

```bash
yarn install
```

### Configure environment variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=task_management

# JWT
JWT_ACCESS_TOKEN_SECRET=access_token_secret_key
JWT_ACCESS_TOKEN_EXPIRES_IN=900

# Application
PORT=3000
NODE_ENV=development
APP_NAME="Task Management App"
APP_URL=http://localhost:3000
```

## Running the Application

### Development mode

```bash
yarn run start:dev
```

### Production mode

```bash
yarn run build
yarn run start:prod
```

### Using Docker

```bash
docker-compose up -d
```

The API will be available at: http://localhost:3000/api

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api/docs
```

## Main Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with username/email and password
- `POST /api/auth/refresh-token` - Get a new access token ( future )
- `POST /api/auth/logout` - Logout and invalidate refresh token ( future )
- `POST /api/auth/verify-email` - Verify email address ( future )
- `POST /api/auth/google` - Login with Google ( future )

### Tasks

- `GET /api/tasks` - Get all tasks (with filtering)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Task Lists

- `GET /api/task-lists` - Get all task lists
- `POST /api/task-lists` - Create a new task list
- `PATCH /api/task-lists/:id` - Update a task list
- `DELETE /api/task-lists/:id` - Delete a task list
- `POST /api/task-lists/reorder` - Reorder task lists
- `PATCH /api/task-lists/tasks/:taskId/move` - Move task to a different list

## License

[MIT](LICENSE)
