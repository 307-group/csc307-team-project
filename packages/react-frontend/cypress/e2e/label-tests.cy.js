describe('Labels on Notes page', () => {
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

    cy.intercept('GET', 'http://localhost:8000/notes', {
      statusCode: 200,
      body: {
        notes_list: [
          {
            _id: 'note1',
            title: 'School Note',
            body: 'Study for test.',
            labelId: 'label1',
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    });

    cy.intercept('GET', 'http://localhost:8000/labels', {
      statusCode: 200,
      body: {
        labels_list: [
          {
            _id: 'label1',
            name: 'School',
            color: '#3b82f6',
          },
        ],
      },
    });

    cy.visit('http://localhost:5173/notes', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
        win.localStorage.setItem('user', JSON.stringify(fakeUser));
      },
    });
  });

  it('shows labels on the notes page', () => {
    cy.contains('Labels').should('be.visible');
    cy.contains('School').should('be.visible');
  });

  it('expands a label and shows its note', () => {
    cy.contains('School').click();

    cy.contains('School Note').should('be.visible');
  });

  it('creates a new label', () => {
    cy.intercept('POST', 'http://localhost:8000/labels', {
      statusCode: 201,
      body: {
        _id: 'label2',
        name: 'Work',
        color: '#3b82f6',
      },
    }).as('createLabel');

    cy.get('button[title="Create new label"]').click();

    cy.get('input[placeholder="Label name..."]').type('Work');
    cy.contains('Create label').click();

    cy.wait('@createLabel');

    cy.contains('Work').should('be.visible');
  });

  it('cancels new label creation', () => {
    cy.get('button[title="Create new label"]').click();

    cy.get('input[placeholder="Label name..."]').type('Canceled Label');
    cy.contains('button', 'Cancel').click();

    cy.get('input[placeholder="Label name..."]').should('not.exist');
    cy.contains('Canceled Label').should('not.exist');
  });

  it('opens a new note form for a label', () => {
    cy.contains('School').click();

    cy.get('button[title="New note in this label"]').click({ force: true });

    cy.url().should('include', 'labelId=label1');
    cy.get('input[placeholder="Note title..."]').should('be.visible');
    cy.get('textarea[placeholder="Start typing your note..."]').should(
      'be.visible'
    );
  });

  it('deletes a label', () => {
    cy.intercept('DELETE', 'http://localhost:8000/labels/label1', {
      statusCode: 200,
      body: {},
    }).as('deleteLabel');

    cy.get('button[title="Delete label"]').click({ force: true });

    cy.contains('Delete label')
      .parents('[class*="fixed"]')
      .within(() => {
        cy.contains('button', 'Delete').click();
      });

    cy.wait('@deleteLabel');

    cy.contains('School').should('not.exist');
  });
});
