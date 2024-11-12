describe('Dashboard Page', () => {
  const selectors = {
    dashboardHeading: 'h1:contains("Dashboard")',
    newExhibitionButton: 'button:contains("New Exhibition")',
    createButton: 'button:contains("Create")',
    viewAllButton: '[data-testid="view-all-button"]',
    cardOptionsButton: '[data-testid="card-options-button"]',
    editOption: 'Edit',
    exhibitionTitleInput: 'input[placeholder="Enter exhibition title"]',
    exhibitionDescriptionInput: 'textarea[placeholder="Enter exhibition description"]',
    exhibitionCard: (title: string) => `[data-testid="exhibition-card"]:contains("${title}")`,
  };

  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('should display the Dashboard heading', () => {
    cy.get(selectors.dashboardHeading).should('be.visible');
  });

  it('should open the Create Exhibition Modal', () => {
    cy.get(selectors.newExhibitionButton).click();
    cy.get(selectors.createButton).should('be.visible');
  });

  it('should navigate to the drafts page by clicking the arrow', () => {
    cy.get(selectors.viewAllButton).click();
    cy.url().should('include', '/dashboard/drafts');
  });

  it('should click the gear icon on a published exhibition card', () => {
    cy.get(selectors.cardOptionsButton).first().click();
    cy.contains(selectors.editOption).should('be.visible');
    cy.log('Verified that the gear icon is clickable');
  });

  it('should show disabled Delete, Edit, and Archive buttons for published exhibitions', () => {
    cy.contains('Published Exhibitions')
      .parent() 
      .find('[data-testid="card-options-button"]')
      .first()
      .click();
    cy.get('[role="menu"]').should('be.visible');  
    cy.get('[role="menuitem"][aria-disabled="true"]').should('have.length', 3);
    cy.get('[role="menuitem"]:not([aria-disabled="true"])').should('have.length', 1);
    cy.get('[role="menuitem"][aria-disabled="true"]').each(($el) => {
      cy.wrap($el)
        .should('have.attr', 'data-disabled', '')
        .and('have.class', 'opacity-50')
        .and('have.class', 'cursor-not-allowed');
    });
    cy.get('[role="menuitem"]:not([aria-disabled="true"])').should(($el) => {
      expect($el).not.to.have.attr('data-disabled');
      expect($el).not.to.have.class('opacity-50');
      expect($el).not.to.have.class('cursor-not-allowed');
    });
    cy.get('[role="menuitem"][aria-disabled="true"]').first().click({ force: true });
    cy.get('[role="menu"]').should('be.visible');
  });
  
});