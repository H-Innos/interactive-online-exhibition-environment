describe('Archive Functionality', () => {
    const exhibitionTitle = 'Test Exhibition for Archiving';
  
    beforeEach(() => {
    });
  
    it('should create a new exhibition', () => {
      cy.visit('/dashboard');
      cy.get('button').contains('New Exhibition').click();
      cy.get('input[placeholder="Enter exhibition title"]').type(exhibitionTitle);
      cy.get('textarea[placeholder="Enter exhibition description"]').type('Archiving');
      cy.get('button[type="submit"]').contains('Create').click();
      cy.contains(exhibitionTitle, { timeout: 10000 }).should('be.visible');
    });
  
    it('should archive a newly created exhibition', () => {
      cy.visit('/dashboard/drafts');
      cy.contains('h2', exhibitionTitle, { timeout: 10000 }).should('be.visible').as('exhibitionTitle');
      cy.get('@exhibitionTitle').closest('.relative').as('exhibitionCard');
      
      cy.get('@exhibitionCard').within(() => {
        cy.get('button[aria-haspopup="menu"]').as('optionsButton');
        cy.get('@optionsButton').should('be.visible').click({ force: true });
      });
  
      cy.get('[role="menu"]').should('be.visible');
      cy.contains('[role="menuitem"]', 'Archive').click({ force: true });
      
      cy.contains(exhibitionTitle).should('not.exist');
    });
  
    it('should view the archived exhibition', () => {
      cy.visit('/archive');
      cy.contains(exhibitionTitle, { timeout: 10000 }).should('be.visible');
    });
  
    it('should unarchive the exhibition', () => {
      cy.visit('/archive');
      cy.contains('h2', exhibitionTitle, { timeout: 10000 }).should('be.visible').as('exhibitionTitle');
      cy.get('@exhibitionTitle').closest('.relative').as('exhibitionCard');
      
      cy.get('@exhibitionCard').within(() => {
        cy.get('button[aria-haspopup="menu"]').as('optionsButton');
        cy.get('@optionsButton').should('be.visible').click({ force: true });
      });
  
      cy.get('[role="menu"]').should('be.visible');
      cy.contains('[role="menuitem"]', 'Unarchive').click({ force: true });
      
      cy.contains(exhibitionTitle).should('not.exist');
    });
  
    it('should delete the unarchived exhibition', () => {
      cy.visit('/dashboard/drafts');
      cy.contains('h2', exhibitionTitle, { timeout: 10000 }).should('be.visible').as('exhibitionTitle');
      cy.get('@exhibitionTitle').closest('.relative').as('exhibitionCard');
      
      cy.get('@exhibitionCard').within(() => {
        cy.get('button[aria-haspopup="menu"]').as('optionsButton');
        cy.get('@optionsButton').should('be.visible').click({ force: true });
      });
  
      cy.get('[role="menu"]').should('be.visible');
      cy.contains('[role="menuitem"]', 'Delete').click({ force: true });
      
      cy.on('window:confirm', () => true);
      cy.contains(exhibitionTitle).should('not.exist');
    });
  });