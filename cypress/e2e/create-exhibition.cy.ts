import {
  createExhibition,
  deleteExhibition,
  login,
  openExhibitionEditor,
  publishExhibition,
  register,
  unpublishExhibition,
} from "cypress/support/commands";
import { selectors } from "cypress/support/selectors";

describe("Create Exhibition", () => {
  const exhibitionTitle = `exhibition-${Date.now()}`;
  const exhibtionDescription = "create test description";

  before(() => {
    register();
  });

  beforeEach(() => {
    login();
    createExhibition(exhibitionTitle, exhibtionDescription);
  });

  it("should create and publish exhibition", () => {
    openExhibitionEditor(exhibitionTitle);
    cy.intercept("POST", "/api/trpc/**").as("saveRequest");

    cy.get(selectors.editorInput).type("test content");
    cy.get(selectors.saveEditorButton, { timeout: 20000 })
      .should("be.visible")
      .click({ force: true });
    cy.wait("@saveRequest").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.intercept("POST", "/api/trpc/**").as("publishRequest");
    publishExhibition(exhibitionTitle);
    cy.wait("@publishRequest").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.visit("/all");
    cy.contains(exhibitionTitle, { timeout: 20000 }).should("be.visible");
    cy.get(selectors.exhibitionCard(exhibitionTitle)).first().click({
      force: true,
    });

    cy.contains("test content", { timeout: 20000 }).should("be.visible");
    unpublishExhibition(exhibitionTitle);
  });

  afterEach(() => {
    cy.visit("/dashboard/drafts");
    cy.get(selectors.exhibitionCard(exhibitionTitle), { timeout: 10000 })
      .should("exist")
      .then(($el) => {
        if ($el.length) {
          cy.wrap($el).should("be.visible");
          deleteExhibition(exhibitionTitle);
        } else {
          cy.log("Exhibition card not found for deletion.");
        }
      });
  });
});
