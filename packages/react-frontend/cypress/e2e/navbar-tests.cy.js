describe('Navbar', () => {
  const fakeUser = {
    _id: 'user1',
    name: 'Chat User',
    email: 'chat@gmail.com',
    createdAt: Date.now(),
  };

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8000/notes', {
      statusCode: 200,
      body: { notes_list: [] },
    });

    cy.intercept('GET', 'http://localhost:8000/todos', {
      statusCode: 200,
      body: { todos_list: [] },
    });

    cy.intercept('GET', 'http://localhost:8000/labels', {
      statusCode: 200,
      body: { labels_list: [] },
    });

    cy.visit('http://localhost:5173/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
        win.localStorage.setItem('user', JSON.stringify(fakeUser));
        win.localStorage.removeItem('notes-app-dark');
      },
    });
  });

  it('expands the sidebar menu', () => {
    cy.get('button[title="Expand menu"]').click();

    cy.contains('Home').should('be.visible');
    cy.contains('Notes').should('be.visible');
    cy.contains('To-Do').should('be.visible');
  });

  it('goes to notes from the navbar', () => {
    cy.get('a[title="Notes"]').click();

    cy.url().should('include', '/notes');
  });

  it('goes to todos from the navbar', () => {
    cy.get('a[title="To-Do"]').click();

    cy.url().should('include', '/todos');
  });

  it('goes to account from the navbar', () => {
    cy.get('a[href="/account"]').click();

    cy.url().should('include', '/account');
    cy.contains('Chat User').should('be.visible');
  });

  it('toggles dark mode', () => {
    cy.get('html').then(($html) => {
      const wasDark = $html.hasClass('dark');

      cy.get('button[title^="Switch to"]').click();

      cy.get('html').should(($updatedHtml) => {
        expect($updatedHtml.hasClass('dark')).to.eq(!wasDark);
      });
    });
  });
});
