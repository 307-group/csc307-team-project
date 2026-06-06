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
            body: '# Markdown Heading\n\n- List item\n\nInline `code`',
            updatedAt: new Date().toISOString(),
          },
          {
            _id: 'note2',
            title: '',
            body: '',
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

    cy.contains('Markdown Heading').should('be.visible');
  });

  it('renders markdown in note body', () => {
    cy.contains('My First Note').click();

    cy.get('h1').contains('Markdown Heading').should('be.visible');
    cy.get('ul').contains('List item').should('be.visible');
    cy.get('code').contains('code').should('be.visible');
  });

  it('shows fallback title and empty content for untitled notes', () => {
    cy.contains('Untitled Note').click();

    cy.contains('No content').should('be.visible');
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

  it('shows unsaved modal when navigating away from a draft note', () => {
    cy.contains('New').click();

    cy.get('input[placeholder="Note title..."]').type('Draft Note');

    cy.get('a[title="To-Do"]').click();

    cy.contains('Unsaved changes').should('be.visible');
    cy.url().should('include', '/notes');
  });

  it('keeps draft when unsaved modal is cancelled', () => {
    cy.contains('New').click();

    cy.get('input[placeholder="Note title..."]').type('Draft Note');

    cy.get('a[title="To-Do"]').click();

    cy.contains('Unsaved changes')
      .parents('[class*="fixed"]')
      .within(() => {
        cy.contains('button', 'Cancel').click();
      });

    cy.url().should('include', '/notes');
    cy.get('input[placeholder="Note title..."]').should(
      'have.value',
      'Draft Note'
    );
  });

  it('discards draft and navigates when discard is clicked', () => {
    cy.contains('New').click();

    cy.get('input[placeholder="Note title..."]').type('Draft Note');

    cy.get('a[title="To-Do"]').click();

    cy.contains('Unsaved changes')
      .parents('[class*="fixed"]')
      .within(() => {
        cy.contains('button', 'Discard').click();
      });

    cy.url().should('include', '/todos');
  });

  it('shows unsaved modal when switching notes with unsaved edits', () => {
    cy.contains('New').click();

    cy.get('input[placeholder="Note title..."]').type('Draft Note');

    cy.contains('My First Note').click();

    cy.contains('Unsaved changes').should('be.visible');
    cy.url().should('include', '/notes');
  });

  it('shows unsaved modal when clicking New with unsaved edits', () => {
    cy.contains('New').click();

    cy.get('input[placeholder="Note title..."]').type('Draft Note');

    cy.contains('New').click();

    cy.contains('Unsaved changes').should('be.visible');
    cy.url().should('include', '/notes');
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

  it('downloads a note PDF', () => {
    cy.intercept('GET', 'http://localhost:8000/notes/note1/pdf', {
      statusCode: 200,
      headers: {
        'content-type': 'application/pdf',
      },
      body: 'PDF content',
    }).as('downloadPdf');

    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').returns('blob:note-pdf');
      cy.stub(win.URL, 'revokeObjectURL').as('revokeObjectURL');
    });

    cy.contains('My First Note').click();
    cy.contains('Download PDF').click();

    cy.wait('@downloadPdf');
    cy.get('@revokeObjectURL').should('have.been.calledWith', 'blob:note-pdf');
  });

  it('shows an alert when PDF download fails', () => {
    cy.intercept('GET', 'http://localhost:8000/notes/note1/pdf', {
      statusCode: 500,
      body: 'Could not generate PDF.',
    }).as('downloadPdf');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.contains('My First Note').click();
    cy.contains('Download PDF').click();

    cy.wait('@downloadPdf');
    cy.get('@alert').should('have.been.calledWith', 'Could not download PDF.');
  });

  it('creates and copies a share link', () => {
    cy.intercept('POST', 'http://localhost:8000/notes/note1/share', {
      statusCode: 200,
      body: {
        shareUrl: '/notes/shared/share1',
        note: {
          _id: 'note1',
          title: 'My First Note',
          body: '# Markdown Heading\n\n- List item\n\nInline `code`',
          shareId: 'share1',
          updatedAt: new Date().toISOString(),
        },
      },
    }).as('createShareLink');

    cy.window().then((win) => {
      const writeText = cy.stub().resolves();

      Object.defineProperty(win.navigator, 'clipboard', {
        configurable: true,
        value: { writeText },
      });

      cy.stub(win, 'alert').as('alert');
      cy.wrap(writeText).as('writeText');
    });

    cy.contains('My First Note').click();
    cy.contains('Share').click();

    cy.wait('@createShareLink');
    cy.get('@writeText').should(
      'have.been.calledWith',
      'http://localhost:5173/notes/shared/share1'
    );
    cy.get('@alert').should('have.been.called');
  });

  it('deletes a note', () => {
    cy.intercept('DELETE', 'http://localhost:8000/notes/note1', {
      statusCode: 200,
      body: {},
    }).as('deleteNote');

    cy.contains('My First Note').click();

    cy.contains('button', 'Delete').click();

    cy.contains('Delete note')
      .parents('[class*="fixed"]')
      .within(() => {
        cy.contains('button', 'Delete').click();
      });

    cy.wait('@deleteNote');

    cy.contains('My First Note').should('not.exist');
  });
});
