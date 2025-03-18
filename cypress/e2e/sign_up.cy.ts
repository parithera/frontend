describe('Sign up test', () => {

  it('visits the app root url', () => {
    cy.visit('/signup')
    cy.contains('h1', 'Sign Up')
  })

  it('creates a new user', () => {
    cy.fixture('user2.json').then((user) => {
      cy.visit('/signup')
      cy.get('[name=email]').type(user.email)
      cy.get('[name=first_name]').type(user.first_name)
      cy.get('[name=last_name]').type(user.last_name)
      cy.get('[name=plainPassword]').type(user.password)
      cy.get('[name=plainPasswordConfirm]').type(user.password)
      cy.get('[role="checkbox"]').click()
      cy.get('[type="submit"]').click()
      cy.wait(500)
    });
  })

})
