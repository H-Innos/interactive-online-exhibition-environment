describe('All Exhibitions Page', () => {
    const selectors = {
      pageHeading: 'h1:contains("Explore Exhibitions")',
      exhibitionCard: (title: any) => `[data-testid="exhibition-card"]:contains("${title}")`,
    };
  
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should display the All Exhibitions page heading', () => {
      cy.get(selectors.pageHeading).should('be.visible');
    });
  
    it('should click on the first exhibition card', () => {
      cy.get(selectors.exhibitionCard("")).first().click();
    });
  });
  