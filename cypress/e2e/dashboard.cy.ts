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

  it('should show disabled Edit button for published exhibitions', () => {
    cy.contains('Published Exhibitions')
      .parent() 
      .find('[data-testid="card-options-button"]')
      .first()
      .click();

    cy.contains('Edit')
      .should('be.visible')
      .and('have.attr', 'aria-disabled', 'true')
      .and('have.attr', 'data-disabled', '')
      .and('have.class', 'opacity-50')
      .and('have.class', 'cursor-not-allowed');
    
    cy.contains('Edit').click({ force: true });
    cy.url().should('not.include', '/dashboard/');
  });

  it('should show disabled Delete button for published exhibitions', () => {
    cy.contains('Published Exhibitions')
      .parent() 
      .find('[data-testid="card-options-button"]')
      .first()
      .click();

    cy.contains('Delete')
      .should('be.visible')
      .and('have.attr', 'aria-disabled', 'true')
      .and('have.attr', 'data-disabled', '')
      .and('have.class', 'opacity-50')
      .and('have.class', 'cursor-not-allowed');
    
    cy.contains('Delete').click({ force: true });
    cy.get('[data-testid="card-options-button"]').should('exist'); 
  });

});