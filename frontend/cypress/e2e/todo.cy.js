/// <reference types="cypress" />

// Helper: login with given credentials
function login(email, password) {
  cy.visit('/login');
  cy.get('input[type=email]').type(email);
  cy.get('input[type=password]').type(password);
  cy.get('button[type=submit]').click();
}

describe('Todo App E2E', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.clearLocalStorage();
  });

  it('Login with valid credentials', () => {
    login('test@example.com', 'password');
    cy.url().should('include', '/todos');
    cy.contains('My Todos');
  });

  it('Login with invalid credentials (empty fields)', () => {
    cy.visit('/login');
    cy.get('button[type=submit]').click();
    cy.contains('Login failed');
  });

  it('Add a todo', () => {
    login('test@example.com', 'password');
    cy.get('input[placeholder="Add a task"]').type('New Todo');
    cy.get('button[type=submit]').contains('Add').click();
    cy.contains('New Todo');
  });

  it('Edit an existing todo', () => {
    login('test@example.com', 'password');
    cy.get('input[placeholder="Add a task"]').type('Edit Me');
    cy.get('button[type=submit]').contains('Add').click();
    cy.contains('Edit Me').parent().find('button').contains('Edit').click();
    cy.get('input').eq(1).clear().type('Edited Todo');
    cy.contains('Save').click();
    cy.contains('Edited Todo');
  });

  it('Delete a todo', () => {
    login('test@example.com', 'password');
    cy.get('input[placeholder="Add a task"]').type('Delete Me');
    cy.get('button[type=submit]').contains('Add').click();
    cy.contains('Delete Me').parent().find('button').contains('Delete').click();
    cy.contains('Delete Me').should('not.exist');
  });

  it('Check todos are displayed correctly', () => {
    login('test@example.com', 'password');
    cy.get('input[placeholder="Add a task"]').type('Task 1');
    cy.get('button[type=submit]').contains('Add').click();
    cy.get('input[placeholder="Add a task"]').type('Task 2');
    cy.get('button[type=submit]').contains('Add').click();
    cy.contains('Task 1');
    cy.contains('Task 2');
  });
}); 