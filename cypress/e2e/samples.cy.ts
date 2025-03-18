describe('Sample page', () => {
	
  beforeEach(() => {
    cy.login()
  })
	
  it('should actually be accessible', () => {
    cy.visit('/samples')
  })

  it('should have a button to add a new sample', () => {
    cy.visit('/samples')
    cy.get('button').should('contain', 'New sample')
  })
})