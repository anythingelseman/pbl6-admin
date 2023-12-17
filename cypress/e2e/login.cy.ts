describe('test case login', () => {
  it('error toast appear when wrong account', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('input[name=employeeNo]').type('superadmin')
    cy.get('input[name=password]').type('abc')
    cy.contains('Log in').click();
    cy.wait(200);
    cy.contains('Incorrect username or password').should('exist')
  })

  it('login successfully', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('input[name=employeeNo]').type('superadmin')
    cy.get('input[name=password]').type('Abc123!@#')
    cy.contains('Log in').click();
    cy.wait(200);
    cy.contains('Log in successfully').should('exist')
  })
})