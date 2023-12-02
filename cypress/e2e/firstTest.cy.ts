describe('first test', () => {
  it('error toast appear when wrong credentials', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('input[name=employeeNo]').type('superadmin')
    cy.get('input[name=password]').type('abc')
    cy.contains('Log in').click();
    cy.contains('Incorrect username or password').should('exist')
  })
})