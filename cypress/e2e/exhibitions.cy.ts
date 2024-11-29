import {
  createExhibition,
  deleteExhibition,
  publishExhibition,
  unpublishExhibition,
} from "cypress/support/commands";

describe("All Exhibitions Page", () => {
  const selectors = {
    pageHeading: 'h1:contains("Explore Exhibitions")',
    exhibitionCard: '[data-testid="exhibition-card"]',
    exhibitionTitle: "h2",
  };

  const exhibitionTitle = `Test exhibition ${Date.now()}`;

  before(() => {
    createExhibition(exhibitionTitle, "Test Exhibition Description");
    publishExhibition(exhibitionTitle);
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the All Exhibitions page heading", () => {
    cy.get(selectors.pageHeading).should("be.visible");
  });

  it("should click on the first exhibition card", () => {
    cy.get(selectors.exhibitionCard).first().click();
  });

  it("should load the page and display the search bar", () => {
    cy.get('input[type="text"]').should("exist");
    cy.contains("Explore Exhibitions").should("be.visible");
  });

  it("should filter exhibitions based on search input", () => {
    cy.contains("Loading...").should("not.exist");
    cy.get(selectors.exhibitionCard)
      .first()
      .find(selectors.exhibitionTitle)
      .invoke("text")
      .then((firstExhibitionTitle) => {
        cy.get('input[type="text"]').type(firstExhibitionTitle.trim());
        cy.get(selectors.exhibitionCard).should("have.length.at.least", 1);
        cy.contains(firstExhibitionTitle.trim()).should("be.visible");
      });
  });

  it('should show "No exhibitions available" when search has no results', () => {
    cy.contains("Loading...").should("not.exist");
    cy.get('input[type="text"]').type("NonexistentExhibition12345");
    cy.contains("No exhibitions available").should("be.visible");
  });

  it("should clear search results when input is cleared", () => {
    cy.contains("Loading...").should("not.exist");
    cy.get('input[type="text"]').type("Test");
    cy.get('input[type="text"]').clear();
    cy.get(selectors.exhibitionCard).should("have.length.at.least", 1);
  });

  after(() => {
    unpublishExhibition(exhibitionTitle);
    deleteExhibition(exhibitionTitle);
  });
});
