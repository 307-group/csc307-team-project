describe('account screen path', () => {
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
      body: { notes_list: [] },
    });

    cy.intercept('GET', `${API}/todos`, {
      statusCode: 200,
      body: { todos_list: [] },
    });

    cy.intercept('GET', `${API}/labels`, {
      statusCode: 200,
      body: { labels_list: [] },
    });
  });

  it('lets a user sign in, view account details, and sign out', () => {
    cy.intercept('POST', `${API}/login`, {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: fakeUser,
      },
    }).as('login');

    cy.visit('http://localhost:5173/account');

    cy.contains('Welcome back').should('be.visible');

    cy.get('input[placeholder="Email address"]').type('chat@gmail.com');
    cy.get('input[placeholder="Password"]').type('chatchat');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');

    cy.url().should('eq', 'http://localhost:5173/');
    cy.contains("Here's a quick look at what's going on.").should('be.visible');

    cy.visit('http://localhost:5173/account');

    cy.contains('Account Details').should('be.visible');
    cy.contains('chat').should('be.visible');
    cy.contains('chat@gmail.com').should('be.visible');

    cy.contains('Sign out').click();

    cy.contains('Welcome back').should('be.visible');
  });
});