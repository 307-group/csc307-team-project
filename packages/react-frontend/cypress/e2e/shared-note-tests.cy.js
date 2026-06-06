describe('shared notes screen path', () => {
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

  it('opens a shared note and saves a synced copy', () => {
    cy.intercept('GET', `${API}/notes/shared/share123`, {
      statusCode: 200,
      body: {
        _id: 'shared-note-1',
        title: 'shared note',
        body: 'this is a shared note.',
        shareId: 'share123',
      },
    }).as('getSharedNote');

    cy.intercept('POST', `${API}/notes/shared/share123/save-copy`, {
      statusCode: 201,
      body: {
        _id: 'copied-note-1',
        title: 'shared note',
        body: 'this is a shared note.',
        syncedFromShareId: 'share123',
        updatedAt: new Date().toISOString(),
      },
    }).as('saveCopy');

    cy.visit('http://localhost:5173/notes/shared/share123', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('token', 'fake-token');
        win.localStorage.setItem('user', JSON.stringify(fakeUser));
      },
    });

    cy.wait('@getSharedNote');

    cy.contains('Shared Note').should('be.visible');
    cy.contains('shared note').should('be.visible');

    cy.get('textarea').clear().type('Updated shared note text.');

    cy.contains('Save synced copy').click();

    cy.wait('@saveCopy');

    cy.contains('Exit').click();

    cy.url().should('include', '/notes');
  });
});
