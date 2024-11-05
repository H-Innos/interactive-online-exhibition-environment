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

  it('should create a new exhibition and verify its display on the dashboard', () => {
    const exhibitionTitle = 'New Test Exhibition';
    const exhibitionDescription = 'This is a description for the new exhibition.';
    cy.get(selectors.newExhibitionButton).click();
    cy.get(selectors.exhibitionTitleInput).type(exhibitionTitle);
    cy.get(selectors.exhibitionDescriptionInput).type(exhibitionDescription);
    cy.get(selectors.createButton).click();
    cy.get(selectors.exhibitionCard(exhibitionTitle)).should('be.visible');
  });
});