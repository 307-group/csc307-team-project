describe('Home page', () => {
  const fakeUser = {
    _id: 'user1',
    name: 'Chat User',
    email: 'chat@gmail.com',
    createdAt: Date.now(),
  };

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8000/notes', {
      statusCode: 200,
      body: {
        notes_list: [
          {
            _id: 'note1',
            title: 'Test Note',
            body: 'This is a test note body.',
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    }).as('getNotes');

    cy.intercept('GET', 'http://localhost:8000/todos', {
      statusCode: 200,
      body: {
        todos_list: [
          {
            _id: 'todo1',
            title: 'Test Task',
            description: 'This is a test task.',
            completed: false,
          },
        ],
      },
    }).as('getTodos');

    cy.intercept('GET', 'http://localhost:8000/labels', {
      statusCode: 200,
      body: {
        labels_list: [],
      },
    }).as('getLabels');

    cy.visit('http://localhost:5173/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
        win.localStorage.setItem('user', JSON.stringify(fakeUser));
      },
    });
  });

  it('loads the home page when logged in', () => {
    cy.contains("Here's a quick look at what's going on.").should('be.visible');
    cy.contains('To-Do').should('be.visible');
    cy.contains('Recent Notes').should('be.visible');
  });

  it('shows todo data on the home page', () => {
    cy.wait('@getTodos');

    cy.contains('Test Task').should('be.visible');
    cy.contains('This is a test task.').should('be.visible');
  });

  it('shows recent notes on the home page', () => {
    cy.wait('@getNotes');

    cy.contains('Test Note').should('be.visible');
    cy.contains('This is a test note body.').should('be.visible');
  });

  it('goes to todos when clicking View all in the To-Do section', () => {
    cy.contains('h2', 'To-Do').parents('section').contains('View all').click();

    cy.url().should('include', '/todos');
  });

  it('goes to notes when clicking View all in the Recent Notes section', () => {
    cy.contains('h2', 'Recent Notes')
      .parents('section')
      .contains('View all')
      .click();

    cy.url().should('include', '/notes');
  });

  it('goes to todos when clicking a todo row', () => {
    cy.contains('Test Task').click();

    cy.url().should('include', '/todos');
  });

  it('goes to a note when clicking a note card', () => {
    cy.contains('Test Note').click();

    cy.url().should('include', '/notes?id=note1');
  });
});
