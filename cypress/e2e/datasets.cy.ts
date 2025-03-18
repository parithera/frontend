describe('Datasets page', () => {
	
  beforeEach(() => {
    cy.login()
  })
	
  it('should actually be accessible', () => {
    cy.visit('/datasets')
  })

})