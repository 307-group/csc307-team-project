describe('to do screen path', () => {
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

    cy.intercept('GET', `${API}/labels`, {
      statusCode: 200,
      body: { labels_list: [] },
    });

    cy.intercept('GET', `${API}/todos`, {
      statusCode: 200,
      body: {
        todos_list: [
          {
            _id: 'todo1',
            title: 'study Cypress',
            description: 'gurt yo',
            completed: false,
          },
        ],
      },
    });
  });

  it('shows todos, creates a task, and marks a task done', () => {
    cy.intercept('POST', `${API}/todos`, {
      statusCode: 201,
      body: {
        _id: 'todo2',
        title: 'finish test',
        description: 'This was created by Cypress.',
        completed: false,
      },
    }).as('createTodo');

    cy.intercept('PATCH', `${API}/todos/todo1`, {
      statusCode: 200,
      body: {
        _id: 'todo1',
        title: 'study Cypress',
        description: 'gurt yo',
        completed: true,
      },
    }).as('toggleTodo');

    cy.visit('http://localhost:5173/todos', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('token', 'fake-token');
        win.localStorage.setItem('user', JSON.stringify(fakeUser));
      },
    });

    cy.contains('To-Do').should('be.visible');
    cy.contains('study Cypress').should('be.visible');

    cy.contains('New Task').click();

    cy.get('input[placeholder="What needs to get done?"]').type('finish test');
    cy.get('textarea[placeholder="Any extra details..."]').type(
      'created by cypress.'
    );

    cy.contains('Create Task').click();

    cy.wait('@createTodo');

    cy.contains('finish test').should('be.visible');

    cy.get('button[title="Mark as done"]').first().click();

    cy.wait('@toggleTodo');

    cy.contains('Done').should('be.visible');
  });
});
