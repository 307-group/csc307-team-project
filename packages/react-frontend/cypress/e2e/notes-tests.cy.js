describe('Notes page', () => {
  const fakeUser = {
    _id: 'user1',
    name: 'Chat User',
    email: 'chat@gmail.com',
    createdAt: Date.now(),
  };

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8000/todos', {
      statusCode: 200,
      body: { todos_list: [] },
    });

    cy.intercept('GET', 'http://localhost:8000/labels', {
      statusCode: 200,
      body: { labels_list: [] },
    });

    cy.intercept('GET', 'http://localhost:8000/notes', {
      statusCode: 200,
      body: {
        notes_list: [
          {
            _id: 'note1',
            title: 'My First Note',
            body: 'This is the body of the note.',
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    }).as('getNotes');

    cy.visit('http://localhost:5173/notes', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
        win.localStorage.setItem('user', JSON.stringify(fakeUser));
      },
    });
  });

  it('loads the notes page', () => {
    cy.contains('Notes').should('be.visible');
    cy.contains('My First Note').should('be.visible');
  });

  it('opens a note when clicked', () => {
    cy.contains('My First Note').click();

    cy.contains('This is the body of the note.').should('be.visible');
  });

  it('opens the new note form', () => {
    cy.contains('New').click();

    cy.get('input[placeholder="Note title..."]').should('be.visible');
    cy.get('textarea[placeholder="Start typing your note..."]').should(
      'be.visible'
    );
  });

  it('creates a new note', () => {
    cy.intercept('POST', 'http://localhost:8000/notes', {
      statusCode: 201,
      body: {
        _id: 'note2',
        title: 'New Test Note',
        body: 'This note was made by Cypress.',
        updatedAt: new Date().toISOString(),
      },
    }).as('createNote');

    cy.contains('New').click();

    cy.get('input[placeholder="Note title..."]').type('New Test Note');
    cy.get('textarea[placeholder="Start typing your note..."]').type(
      'This note was made by Cypress.'
    );

    cy.contains('Save Note').click();

    cy.wait('@createNote');

    cy.contains('New Test Note').should('be.visible');
  });

  it('edits a note', () => {
    cy.intercept('PUT', 'http://localhost:8000/notes/note1', {
      statusCode: 200,
      body: {
        _id: 'note1',
        title: 'Updated Note',
        body: 'Updated body text.',
        updatedAt: new Date().toISOString(),
      },
    }).as('updateNote');

    cy.contains('My First Note').click();
    cy.contains('Edit').click();

    cy.get('input').first().clear().type('Updated Note');
    cy.get('textarea').clear().type('Updated body text.');

    cy.contains('Save').click();

    cy.wait('@updateNote');

    cy.contains('Updated Note').should('be.visible');
  });

  it('deletes a note', () => {
    cy.intercept('DELETE', 'http://localhost:8000/notes/note1', {
      statusCode: 200,
      body: {},
    }).as('deleteNote');

    cy.contains('My First Note').click();

    cy.get('button').last().click();

    cy.wait('@deleteNote');

    cy.contains('My First Note').should('not.exist');
  });
});
