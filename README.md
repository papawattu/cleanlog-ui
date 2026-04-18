# Cleanlog

A house cleaning management application for tracking cleaning tasks between owners and cleaners.

## Architecture

- **Monolithic** with **hexagonal architecture** (ports and adapters)
- **Backend**: Go with SQLite
- **Frontend**: Plain JavaScript (ES modules), web components, modern CSS
- **Auth**: JWT tokens in HttpOnly cookies
- **Database**: SQLite with golang-migrate

## User Roles

- **Owner**: Creates tasks, monitors progress
- **Cleaner**: Views assigned tasks, updates status

## Task Types

General cleaning, Bathroom, Kitchen, Floor care, Window cleaning

## Quick Start

### Prerequisites

- Go 1.25+
- Docker (optional)

### Run Locally

```bash
# Build
go build -o cleanlog-server ./cmd/server

# Run
./cleanlog-server
```

The server starts on port 8080.

### Run with Docker

```bash
docker compose -f deployment/docker/docker-compose.yml up --build
```

### Run Tests

```bash
go test -v -race ./...
```

## API Endpoints

### Public

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check / welcome |
| GET | `/health` | Health check |
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive JWT token |

### Authenticated (JWT required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tasks` | Create a task |
| GET | `/tasks` | List tasks |
| POST | `/tasks/complete/:id` | Mark task as completed |
| POST | `/tasks/status/:id` | Update task status |
| POST | `/tasks/delete/:id` | Delete a task |
| POST | `/schedules` | Create a schedule |
| GET | `/schedules` | List schedules |
| POST | `/schedules/:id` | Update a schedule |
| POST | `/schedules/delete/:id` | Delete a schedule |

All authenticated endpoints require a `Authorization: Bearer <token>` header.

## Project Structure

```
cmd/server/          # Application entry point
internal/
  application/
    ports/
      input/         # Application use case input ports
      output/        # Repository output ports
  domain/
    entities/        # Domain models and business logic
  usecase/           # Use case implementations
  infrastructure/
    auth/            # JWT authentication
    persistence/
      sqlite/        # SQLite repository implementations
web/                 # Frontend (plain JS, web components)
api/                 # Static welcome page
deployment/
  docker/            # Docker & Docker Compose
  k8s/               # Kubernetes manifests
migrations/          # Database migration files
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Server port |
| `DB_PATH` | `cleanlog.db` | SQLite database path |
| `JWT_SECRET` | (generated) | JWT signing secret |
| `ENVIRONMENT` | `local` | Environment (local, staging, production) |

## Database Migrations

Migrations are embedded in the binary and run automatically on startup.

Migration files live in `migrations/`. To add a new migration:

```bash
migrate create -ext sql -dir migrations -seq <description>
```

## Testing

```bash
# All tests
go test -v -race ./...

# Specific package
go test -v ./internal/usecase
```

## License

All rights reserved.
