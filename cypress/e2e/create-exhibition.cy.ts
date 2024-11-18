import { createExhibition, deleteExhibition, openExhibitionEditor, unpublishExhibition } from "cypress/support/commands";
import { selectors } from "cypress/support/selectors";


describe("Create Exhibition", () => {
  const exhibitionTitle = `exhibition-${Date.now()}`;
  const exhibtionDescription = "create test description";
  beforeEach (() => {
    createExhibition(exhibitionTitle, exhibtionDescription);

    openExhibitionEditor(exhibitionTitle);
  });


  it('should publish exhibition through the editor', () => {
    cy.intercept('POST', '/api/trpc/**').as('publishRequest');
    cy.get(selectors.publishButton, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });
    cy.wait('@publishRequest')
      .then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
      }
    );
    cy.visit('/');
    cy.contains(exhibitionTitle, { timeout: 20000 })
      .should('be.visible');
    cy.contains(exhibtionDescription, { timeout: 20000 })
      .should('be.visible');

    unpublishExhibition(exhibitionTitle);
  });

  it('should edit and save content', () => {
    cy.intercept('POST', '/api/trpc/**').as('saveRequest');
    
    cy.get(selectors.editorInput)
      .type('test content');
    cy.get(selectors.saveEditorButton, { timeout: 20000 })
      .should('be.visible')
      .click({ force: true });
    cy.wait('@saveRequest')
      .then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
      }
    );

    cy.visit('/dashboard/drafts');
    cy.contains(exhibitionTitle, { timeout: 20000 })
      .should('be.visible').click({ force: true });
    cy.contains('test content', { timeout: 20000 })
      .should('be.visible');
  });

  afterEach(() => {
    deleteExhibition(exhibitionTitle);
  });
});



