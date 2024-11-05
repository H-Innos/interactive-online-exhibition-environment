describe('All Exhibitions Page', () => {

beforeEach(() => {
    cy.visit('/');
});

it('should load the page and display the search bar', () => {
    cy.get('input[type="text"]').should('exist');
    cy.contains('Explore Exhibitions').should('be.visible');
});

it('should filter exhibitions based on search input', () => {
    cy.contains('Loading...').should('not.exist'); 
    cy.get('input[type="text"]').type('Test Exhibition');   
    cy.get('div.flex.flex-col.bg-white.border').should('have.length.at.least', 1);
    cy.contains('Test Exhibition').should('be.visible');
});

it('should show "No exhibitions available" when search has no results', () => {
    cy.contains('Loading...').should('not.exist'); 
    cy.get('input[type="text"]').type('NonexistentExhibition12345');
    cy.contains('No exhibitions available').should('be.visible');
});

it('should clear search results when input is cleared', () => {
    cy.contains('Loading...').should('not.exist'); 
    cy.get('input[type="text"]').type('Test');
    cy.get('input[type="text"]').clear();
    cy.get('div.flex.flex-col.bg-white.border').should('have.length.at.least', 1);
});
});
