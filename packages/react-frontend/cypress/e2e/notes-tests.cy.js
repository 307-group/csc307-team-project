describe('notes screen path', () => {
  const API = 'http://localhost:8000';

  const fakeUser = {
    _id: 'user1',
    name: 'chat',
    email: 'chat@gmail.com',
    createdAt: Date.now(),
  };

  beforeEach(() => {
    cy.intercept('GET', `${API}/todos`, {
      statusCode: 200,
      body: { todos_list: [] },
    });

    cy.intercept('GET', `${API}/labels`, {
      statusCode: 200,
      body: {
        labels_list: [
          {
            _id: 'label1',
            name: 'computer science',
            color: '#3b82f6',
          },
        ],
      },
    });

    cy.intercept('GET', `${API}/notes`, {
      statusCode: 200,
      body: {
        notes_list: [
          {
            _id: 'note1',
            title: 'gurt Note',
            body: 'this is the note body.',
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    });
  });

  it('views, edits, and creates notes and labels', () => {
    cy.intercept('PUT', `${API}/notes/note1`, {
      statusCode: 200,
      body: {
        _id: 'note1',
        title: 'Updated Note',
        body: 'This note was updated.',
        updatedAt: new Date().toISOString(),
      },
    }).as('updateNote');

    cy.intercept('POST', `${API}/notes`, {
      statusCode: 201,
      body: {
        _id: 'note2',
        title: 'New Cypress Note',
        body: 'This note was created during the test.',
        updatedAt: new Date().toISOString(),
      },
    }).as('createNote');

    cy.intercept('POST', `${API}/labels`, {
      statusCode: 201,
      body: {
        _id: 'label2',
        name: 'Cypress Label',
        color: '#3b82f6',
      },
    }).as('createLabel');

    cy.visit('http://localhost:5173/notes', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('token', 'fake-token');
        win.localStorage.setItem('user', JSON.stringify(fakeUser));
      },
    });

    cy.contains('Notes').should('be.visible');
    cy.contains('gurt Note').click();

    cy.contains('this is the note body.').should('be.visible');

    cy.contains('Edit').click();

    cy.get('input').first().clear().type('Updated Note');
    cy.get('textarea').clear().type('This note was updated.');

    cy.contains('Save').click();

    cy.wait('@updateNote');

    cy.contains('Updated Note').should('be.visible');

    cy.contains('New').click();

    cy.get('input[placeholder="Note title..."]').type('New Cypress Note');
    cy.get('textarea[placeholder="Start typing your note..."]').type(
      'This note was created during the test.'
    );

    cy.contains('Save Note').click();

    cy.wait('@createNote');

    cy.contains('New Cypress Note').should('be.visible');

    cy.get('button[title="Create new label"]').click();

    cy.get('input[placeholder="Label name..."]').type('Cypress Label');
    cy.contains('Create label').click();

    cy.wait('@createLabel');

    cy.contains('Cypress Label').should('be.visible');
  });
});
