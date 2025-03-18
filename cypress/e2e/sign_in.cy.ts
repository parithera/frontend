// https://on.cypress.io/api

describe('Sign_in', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Sign In')
  })
})
