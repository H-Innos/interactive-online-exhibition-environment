describe('Archive Functionality', () => {

    it('should create a new exhibition', () => {
        cy.visit('/dashboard');
        cy.get('button').contains('New Exhibition').click();
        cy.get('input[placeholder="Enter exhibition title"]').type('Test Exhibition for Archiving');
        cy.get('textarea[placeholder="Enter exhibition description"]').type('This is a test exhibition for archive functionality');
        cy.get('button[type="submit"]').contains('Create').click();
        cy.contains('Test Exhibition for Archiving', { timeout: 10000 }).should('be.visible');
    });


    it('should archive a newly created exhibition', () => {
        cy.visit('/dashboard');
        cy.contains('h2', 'Test Exhibition for Archiving', { timeout: 20000 }).should('be.visible');
        cy.contains('h2', 'Test Exhibition for Archiving')
            .closest('.relative')
            .as('exhibitionCard');
        cy.get('@exhibitionCard').then($card => { 
            cy.log('Exhibition card HTML:', $card.html());
        }); 
        cy.get('@exhibitionCard')
            .find('[data-testid="card-options-button"]')
            .should('be.visible')
            .as('optionsButton');
        cy.get('@optionsButton').then($button => {
            cy.log('Options button HTML:', $button.html());
        });
        cy.get('@optionsButton').click({ force: true });
        cy.get('[role="menu"]', { timeout: 10000 }).should('be.visible').then($menu => {
            cy.log('Dropdown menu HTML:', $menu.html());
        });
        cy.get('[role="menu"]').contains('Archive').click({ force: true }); 
        cy.contains('Test Exhibition for Archiving').should('not.exist');
    });


    it('should view the archived exhibition', () => {
        cy.visit('/archive');
        cy.contains('Test Exhibition for Archiving', { timeout: 10000 }).should('be.visible');});

    
    it('should unarchive the exhibition', () => {
        cy.visit('/archive');
        cy.contains('h2', 'Test Exhibition for Archiving', { timeout: 20000 }).should('be.visible');
        cy.contains('h2', 'Test Exhibition for Archiving')
            .closest('.relative')
            .as('exhibitionCard');
        cy.get('@exhibitionCard').then($card => {
            cy.log('Exhibition card HTML:', $card.html());
        });
        cy.get('@exhibitionCard')
            .find('[data-testid="card-options-button"]')
            .should('be.visible')
            .as('optionsButton');
        cy.get('@optionsButton').then($button => {
            cy.log('Options button HTML:', $button.html());
        });
        cy.get('@optionsButton').click({ force: true });
        cy.get('[role="menu"]', { timeout: 10000 }).should('be.visible').then($menu => {
            cy.log('Dropdown menu HTML:', $menu.html());
        });
        cy.get('[role="menu"]').contains('Unarchive').click({ force: true });
        cy.contains('Test Exhibition for Archiving').should('not.exist');
    });


    it('should delete the unarchived exhibition', () => {
        cy.visit('/dashboard');
        cy.contains('h2', 'Test Exhibition for Archiving', { timeout: 20000 }).should('be.visible');
        cy.contains('h2', 'Test Exhibition for Archiving')
            .closest('.relative')
            .as('exhibitionCard');
        cy.get('@exhibitionCard').then($card => {
            cy.log('Exhibition card HTML:', $card.html());
        });
        cy.get('@exhibitionCard')
            .find('[data-testid="card-options-button"]')
            .should('be.visible')
            .as('optionsButton');
        cy.get('@optionsButton').then($button => {
            cy.log('Options button HTML:', $button.html());
        });
        cy.get('@optionsButton').click({ force: true });
        cy.get('[role="menu"]', { timeout: 10000 }).should('be.visible').then($menu => {
            cy.log('Dropdown menu HTML:', $menu.html());
        });
        cy.get('[role="menu"]').contains('Delete').click({ force: true });
        cy.on('window:confirm', () => true);
        cy.contains('Test Exhibition for Archiving').should('not.exist');
    });
}); 