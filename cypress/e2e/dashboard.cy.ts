describe('Dashboard Page', () => {
  it('should display the Dashboard heading', () => {
    cy.visit('/dashboard').then(() => {
      cy.log('Dashboard page visited');
    });
    cy.contains('Dashboard').should('be.visible');
      });

  it('should open the Create Exhibition Modal', () => {
    cy.visit('/dashboard');
    cy.get('button').contains('New Exhibition').click();
    cy.get('Button').contains('Create').should('be.visible');
  });
});