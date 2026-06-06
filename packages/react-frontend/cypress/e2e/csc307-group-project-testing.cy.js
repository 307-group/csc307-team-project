//homepage testing
describe('home screen path', () => {
  const API = 'http://localhost:8000';

  const fakeUser = {
    _id: 'user1',
    name: 'chat',
    email: 'chat@gmail.com',
    createdAt: Date.now(),
  };

  beforeEach(() => {
    cy.intercept('GET', `${API}/notes`, {
      statusCode: 200,
      body: {
        notes_list: [
          {
            _id: 'note1',
            title: 'Cypress Note',
            body: 'This note appears on the home page.',
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    }).as('getNotes');

    cy.intercept('GET', `${API}/todos`, {
      statusCode: 200,
      body: {
        todos_list: [
          {
            _id: 'todo1',
            title: 'Cypress Task',
            description: 'This task appears on the home page.',
            completed: false,
          },
        ],
      },
    }).as('getTodos');

    cy.intercept('GET', `${API}/labels`, {
      statusCode: 200,
      body: { labels_list: [] },
    }).as('getLabels');
  });

  it('shows the home page with notes and tasks', () => {
    cy.visit('http://localhost:5173/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('token', 'fake-token');
        win.localStorage.setItem('user', JSON.stringify(fakeUser));
      },
    });

    cy.wait('@getNotes');
    cy.wait('@getTodos');
    cy.wait('@getLabels');

    cy.contains("Here's a quick look at what's going on.").should('be.visible');

    cy.contains('To-Do').should('be.visible');
    cy.contains('Cypress Task').should('be.visible');

    cy.contains('Recent Notes').should('be.visible');
    cy.contains('Cypress Note').should('be.visible');

    cy.contains('Cypress Task').click();
    cy.url().should('include', '/todos');

    cy.visit('http://localhost:5173/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
        win.localStorage.setItem('user', JSON.stringify(fakeUser));
      },
    });

    cy.contains('Cypress Note').click();
    cy.url().should('include', '/notes?id=note1');
  });
});