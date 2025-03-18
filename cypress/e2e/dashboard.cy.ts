describe('Dashboard page', () => {
	
  beforeEach(() => {
    cy.login()
  })
	
  it('should actually be accessible', () => {
    cy.visit('/')
  })

  it('should have the correct page title', () => {
    cy.visit('/')
    cy.get('h5').should('contain', 'Heads Up!')
  })
  
})