describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('should display the Dashboard heading', () => {
    cy.contains('Dashboard').should('be.visible');
  });

  it('should open the Create Exhibition Modal', () => {
    cy.get('button').contains('New Exhibition').click();
    cy.get('Button').contains('Create').should('be.visible');
  });

  it('should navigate to the drafts page by clicking the arrow', () => {
    cy.get('[data-testid="view-all-button"]').click();
    cy.url().should('include', '/dashboard/drafts');
  });

  it('should click the gear icon on a published exhibition card', () => {
    cy.get('[data-testid="card-options-button"]').first().click();
    cy.contains('Edit').should('be.visible');
    cy.log('Verified that the gear icon is clickable');
  });

});