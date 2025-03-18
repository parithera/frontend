describe('Projects page', () => {
	
  beforeEach(() => {
    cy.login()
  })
	
  it('should actually be accessible', () => {
    cy.visit('/projects')
  })

  it('should have a button to add a new project', () => {
    cy.visit('/projects')
    cy.get('button').should('contain', 'New project')
  })
})