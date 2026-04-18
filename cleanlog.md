# Clean log

## Why

I want a house cleaning application. I want to track all the tests my cleaner needs to do, as well as my cleaner needs to know what tasks to perform.

## What

There are two types of users, cleaners and owners.  Cleaners perform the cleaning tasks, while owners want the add asks as well as monitor progress.  Cleaners and owners can register and sign up using simple web form based login and registration.

## Constraints

### Must
- Use a monolithic architecture
- Use hexagonal architecture
- Use Go as a backend
- Use a single page application
- Use plain JavaScript (ES modules, no bundler)
- Use reusable web components
- Use new modern CSS only
- Use semantic HTML
- Use A11y patterns
- Use docker containers
- Use UUIDs for any entity IDs
- Use Test Driven Development for FE and BE components
- Use simple events for intercomponent communication, both FE and BE
- Use SQLite with hexagonal abstraction layer (repository pattern) for database access
- Implement JWT authentication with HttpOnly cookies
- Use custom fetch wrapper for API calls (minimize dependencies)
- Use golang-migrate for database migrations
- Use OpenAPI/Swagger for API documentation

### Must not
- Use React
- Use a log of dependancies, write as much library code yourself

### Out of scope
- Password reset
- Email verification
- OAuth / social login

## Current state
- Go module initialized with hexagonal architecture
- Hello world REST API endpoint at /health
- SPA with vanilla JS web components (header, footer)
- Dockerfiles for backend and frontend
- docker-compose.yml for local development
- K8S manifests: deployment, service, configmap, ingress
- GitHub Actions CI workflow
- Go unit tests for hello world endpoint
- Domain entities: User, Task, Schedule (with UUIDs)
- Repository interfaces (ports) and SQLite implementations
- Use cases: RegisterUser, Login, CreateTask
- Unit tests for use cases (7 tests passing)
- Mock repositories for isolated testing
- Auth HTTP handlers (register, login)
- Auth middleware for protected routes
- Frontend login-form and registration-form web components
- Integration tests for auth handlers (4 tests passing)
- SQLite database schema with migrations-ready structure
- EventBus service for intercomponent communication
- Custom fetch wrapper (apiClient) for API calls
- Hash-based router with navigation
- Main app container with routing links
- Frontend unit tests for eventBus (5 tests) and apiClient (4 tests) - 9 tests passing
- E2E tests for routing navigation
- Use case: GetOwnerTasks
- Owner task creation form web component (task-form)
- Owner dashboard web component (dashboard) with stats
- Backend API endpoints for owner task CRUD
- 4 unit tests for CreateTask use case


## Tasks


### T1: Bootstrap the application

- [ ] Set up Go module with hexagonal directory structure
- [ ] Create hello world REST API endpoint (Go)
- [ ] Create hello world SPA with vanilla JS web components (frontend)
- [ ] Write Dockerfile for Go backend
- [ ] Write Dockerfile for serving frontend (Nginx or static serving)
- [ ] Create docker-compose.yml for local development
- [ ] Add K8S manifests: deployment.yaml, service.yaml, configmap.yaml, ingress.yaml
- [ ] Add GitHub Actions CI workflow (build, test, deploy)
- [ ] Update cleanlog.md to reflect current state

**Test Deliverables for T1:**
- Backend: Go unit tests for hello world endpoint
- Frontend: Puppeteer E2E test verifying hello world page loads
- CI: Workflow tests passing on PR

### T2: Create models & database abstraction

- [ ] Define domain entities: Cleaner, Owner, Task, Schedule (UUIDs)
- [ ] Create repository ports (interfaces) in `internal/application/ports/output/`
- [ ] Implement SQLite repositories in `internal/infrastructure/persistence/sqlite/`
- [ ] Create use cases for user registration/login and task management
- [ ] Write backend unit tests for each use case and repository

**Test Deliverables for T2:**
- Backend: Unit tests for entity validation, repository CRUD operations, use case logic
- Backend: Test SQLite implementations against repository interfaces
- Backend: Mock implementations to test use cases in isolation

### T3: Authentication & user management

- [ ] Implement registration endpoint (Cleaner/Owner)
- [ ] Implement login endpoint with session management
- [ ] Add auth middleware for protected routes
- [ ] Create frontend login-form and registration-form web components
- [ ] Write E2E tests for authentication flows

**Test Deliverables for T3:**
- Backend: Unit tests for auth use cases (invalid input, duplicate users, correct auth)
- Backend: Integration tests for endpoints with SQLite
- Frontend: E2E tests for registration and login workflows
- A11y: Manual testing checklist for keyboard navigation in auth forms

### T4: Frontend shell & routing

- [ ] Create app-header and app-footer web components
- [ ] Implement event-based routing (CustomEvents)
- [ ] Build main app container (app.js)
- [ ] Add modern CSS layout (flexbox/grid, CSS variables)
- [ ] Ensure A11y compliance (ARIA labels, keyboard navigation)
- [ ] Create EventBus service for intercomponent communication
- [ ] Implement custom fetch wrapper for API calls

**Test Deliverables for T4:**
- Frontend: Unit tests for eventBus service
- Frontend: E2E tests for routing navigation
- A11y: Manual testing checklist or axe-core automated tests
- Frontend: Component isolation tests (custom element lifecycle)

### T5: Cleaner-facing features

- [ ] Task list view (assigned tasks, status)
- [ ] Task completion functionality
- [ ] Schedule view for assigned work
- [ ] Backend API endpoints for task retrieval
- [ ] Task list web component

**Test Deliverables for T5:**
- Backend: Unit tests for task assignment and completion use cases
- Backend: Integration tests for task API endpoints
- Frontend: E2E tests for task list display and completion
- Frontend: Task list component tests (rendering, event handling)

### T6: Owner-facing features

- [ ] Task creation form with scheduling
- [ ] Owner dashboard showing task status
- [ ] Backend API endpoints for task CRUD
- [ ] Task form web component

**Test Deliverables for T6:**
- Backend: Unit tests for task creation and validation
- Backend: Integration tests for task CRUD endpoints
- Frontend: E2E tests for task creation and dashboard view
- Frontend: Form component tests (validation, submission)

### T7: Scheduling & task assignment

- [ ] Assign tasks to cleaners
- [ ] Schedule calendar view
- [ ] Task status tracking (pending, in-progress, completed)
- [ ] Schedule-view web component
- [ ] Integration tests for full workflows

**Test Deliverables for T7:**
- Backend: Unit tests for scheduling logic
- Backend: Integration tests for task assignment flows
- Frontend: E2E tests for full scheduling workflow
- Frontend: Schedule-view component tests (rendering, interactions)

### T8: Polish & documentation

- [ ] Add comprehensive README with setup instructions
- [ ] Add API documentation (OpenAPI/Swagger)
- [ ] Deploy to K8S infrastructure
- [ ] Final security review (input validation, session security)
- [ ] Run full test suite (unit, integration, E2E)

**Test Deliverables for T8:**
- E2E: Full acceptance test suite passing
- Security: Manual penetration test checklist
- CI: All tests passing on every push
- Performance: Basic load test for critical paths

### T9: Environment Configuration

- [ ] Create environment-specific configs (local, staging, production)
- [ ] Implement rate limiting for production
- [ ] Configure logging levels per environment
- [ ] Set up CSRF protection for forms
- [ ] Implement bcrypt password hashing

### Task Types Supported

- General cleaning
- Bathroom cleaning
- Kitchen cleaning
- Floor care
- Window cleaning

### Schedule Complexity

- Simple schedule: task assigned to a date with optional time slot
- Single cleaner assignment per task
- Task status: pending, in-progress, completed

### Authentication Model

- JWT tokens stored in HttpOnly cookies (secure against XSS)
- No password reset, email verification, or OAuth (out of scope)

### Database

- SQLite as default with hexagonal repository abstraction layer
- Easy to swap in PostgreSQL, MySQL, or other SQL databases
- golang-migrate for database migrations
- Custom repository implementations for each entity type

### Deployment Environments

- Local: SQLite, debug mode, full logging
- Staging: SQLite, limited logging
- Production: SQLite, full logging, rate limiting

