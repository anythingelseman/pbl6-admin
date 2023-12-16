/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
    interface Chainable<Subject> {
      loginAdmin(): typeof loginAdmin;
    }
  }
  
  Cypress.Commands.add('loginAdmin' as any, loginAdmin);
  function loginAdmin() {
    cy.request({
      method: 'POST',
      url: 'http://cinephilewebapi.southeastasia.cloudapp.azure.com/api/identity/token',
      body: {
        employeeNo: 'superadmin',
        password: 'Abc123!@#',
      },
    }).then((res: any) => {
        window.localStorage.setItem('USER', JSON.stringify({'token': `${res.body.data.token}`}));
    });
  }
  
  