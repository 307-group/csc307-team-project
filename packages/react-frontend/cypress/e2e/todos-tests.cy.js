describe('To-Do page', () => {
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

    cy.intercept('GET', 'http://localhost:8000/labels', {
      statusCode: 200,
      body: { labels_list: [] },
    });

    cy.intercept('GET', 'http://localhost:8000/todos', {
      statusCode: 200,
      body: {
        todos_list: [
          {
            _id: 'todo1',
            title: 'Study Cypress',
            description: 'Write frontend tests',
            completed: false,
          },
          {
            _id: 'todo2',
            title: 'Finished Task',
            description: 'Already done',
            completed: true,
          },
        ],
      },
    }).as('getTodos');

    cy.visit('http://localhost:5173/todos', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
        win.localStorage.setItem('user', JSON.stringify(fakeUser));
      },
    });
  });

  it('loads the todo page', () => {
    cy.contains('To-Do').should('be.visible');
    cy.contains('Study Cypress').should('be.visible');
    cy.contains('Write frontend tests').should('be.visible');
  });

  it('opens the new task modal', () => {
    cy.contains('New Task').click();

    cy.contains('Title').should('be.visible');
    cy.get('input[placeholder="What needs to get done?"]').should('be.visible');
    cy.contains('Create Task').should('be.disabled');
  });

  it('creates a new task', () => {
    cy.intercept('POST', 'http://localhost:8000/todos', {
      statusCode: 201,
      body: {
        _id: 'todo3',
        title: 'New Cypress Task',
        description: 'Made during a test',
        completed: false,
      },
    }).as('createTodo');

    cy.contains('New Task').click();

    cy.get('input[placeholder="What needs to get done?"]').type(
      'New Cypress Task'
    );
    cy.get('textarea[placeholder="Any extra details..."]').type(
      'Made during a test'
    );

    cy.contains('Create Task').click();

    cy.wait('@createTodo');

    cy.contains('New Cypress Task').should('be.visible');
  });

  it('shows completed tasks in the Done section', () => {
    cy.contains('Done · 1').should('be.visible');
    cy.contains('Finished Task').should('be.visible');
  });

  it('toggles a task', () => {
    cy.intercept('PATCH', 'http://localhost:8000/todos/todo1', {
      statusCode: 200,
      body: {
        _id: 'todo1',
        title: 'Study Cypress',
        description: 'Write frontend tests',
        completed: true,
      },
    }).as('toggleTodo');

    cy.contains('Study Cypress')
      .parents('.group')
      .find('button')
      .first()
      .click();

    cy.wait('@toggleTodo');
  });

  it('deletes a task', () => {
    cy.intercept('DELETE', 'http://localhost:8000/todos/todo1', {
      statusCode: 200,
      body: {},
    }).as('deleteTodo');

    cy.contains('Study Cypress')
      .parents('.group')
      .find('button[title="Delete task"]')
      .click({ force: true });

    cy.wait('@deleteTodo');

    cy.contains('Study Cypress').should('not.exist');
  });
});
