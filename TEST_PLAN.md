# Test Plan

## Test Objective
Ensure the Todo application (React frontend, Express backend) works as expected for authentication and CRUD operations, both at the UI and API level.

## What is Tested
- **Login**: Valid and invalid credentials
- **Todos CRUD**: Add, edit, delete, and display todos
- **UI**: User flows and interface correctness
- **API**: All backend endpoints, including error cases and authentication

## Test Coverage
- **UI (Cypress)**: End-to-end tests for login, todo creation, editing, deletion, and display
- **API (Jest + Supertest)**: All backend routes, including success and failure scenarios, with and without authentication

## Tools Used & Rationale
- **Cypress**: For reliable, modern end-to-end UI testing
- **Jest + Supertest**: For fast, expressive API and backend testing

## How to Run the Tests

### UI (Cypress)
- Open interactive mode: `cd frontend && npx cypress open`
- Run headless: `cd frontend && npx cypress run`

### API (Jest)
- Run all backend tests: `cd backend && npm test`
- Run with coverage: `cd backend && npm run test:coverage`

## Limitations
- No real database: all data is in-memory and resets on backend restart
- Authentication is simulated (no real user management)
- Tests assume backend is running locally on port 3001 