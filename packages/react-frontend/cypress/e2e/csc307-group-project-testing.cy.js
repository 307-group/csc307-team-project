describe('the home page', () => {
  it('successfully loads', () => {
    cy.visit('http://localhost:5173/')
  })
})

describe('the home page buttons', () => {
  it('do not click when logged out', () => {
    cy.visit('http://localhost:5173/')
  })
})


describe('user data', () => {
  it('successfully loads', () => {
    const testdata = {
      username: 'chat@gmail.com',
      password: 'chatchat'
    };

    cy.visit('http://localhost:5173/account');
    cy.get('input[placeholder="Email address"]').type(testdata.username);
    cy.get('input[placeholder="Password"]').type(testdata.password);
    cy.get('button[type="submit"]').click();

    cy.get('p').contains("Here's a quick look at what's going on");
  })
})

describe('the home page buttons when logged in', () => {
  it('clicks through to notes', () => {

    cy.visit('http://localhost:5173/notes');
    cy.visit('http://localhost:5173/todos');
  })
})

