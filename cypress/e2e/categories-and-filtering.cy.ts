import { selectors } from "cypress/support/selectors";
import {
  createExhibition,
  deleteExhibition,
  login,
  openExhibitionEditor,
  register,
} from "cypress/support/commands";

describe("Categories and Filtering Functionality", () => {
  const exhibitionTitle = "Test Exhibition for cat and fit";
  const exhibitionDescription = "This is a test exhibition";
  const newCategoryName = "Test Category5";

  before(() => {
    cy.visit("/");
    register();
  });

  beforeEach(() => {
    cy.visit("/");
    login();

    cy.visit("/dashboard");
  });

  it("should create a new category, filter by it, and then clean up", () => {
    // Create a new draft exhibition
    createExhibition(exhibitionTitle, exhibitionDescription);

    // Open the editor view
    openExhibitionEditor(exhibitionTitle);
    // Add a new category
    cy.get('[data-testid="categories-button"]').click({ force: true });
    cy.get('[data-testid="new-category-input"]').type(newCategoryName);
    cy.get('[data-testid="add-category-button"]').click({ force: true });
    cy.wait(2000);
    cy.get('[data-testid="close-category-modal"]').click({ force: true });

    // Save changes
    cy.get('[data-testid="save-editor-changes"]').click({ force: true });
    cy.get('[data-sonner-toast][data-type="success"]', { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Exhibition updated successfully!");
    cy.wait(2000);
    // Go back to drafts and filter
    cy.visit("/dashboard/drafts");
    cy.get('[data-testid="filter-by-button"]').click({ force: true });
    cy.get(`[data-testid="category-checkbox-${newCategoryName}"]`).click({
      force: true,
    });
    cy.get('[data-testid="apply-filter-button"]').click({ force: true });

    // Verify only the new exhibition is visible
    cy.get('[data-testid="exhibition-list"]').should("have.length", 1);
    cy.get('[data-testid="exhibition-list"]').should(
      "contain",
      exhibitionTitle,
    );

    // Clean up
    openExhibitionEditor(exhibitionTitle);
    cy.get('[data-testid="categories-button"]').click({ force: true });
    cy.get(`[data-testid="deselect-category-${newCategoryName}"]`).click();
    cy.get(`[data-testid="delete-category-${newCategoryName}"]`).click({
      force: true,
    });
    cy.get('[data-testid="close-category-modal"]').click({ force: true });
    cy.get('[data-testid="categories-button"]').click({ force: true });
    cy.get('[data-testid="category-list"]').should(
      "not.contain",
      newCategoryName,
    );
    cy.get('[data-testid="close-category-modal"]').click({ force: true });
    cy.visit("/dashboard/drafts");
    deleteExhibition(exhibitionTitle);

    // Verify the exhibition and category are gone
    cy.get('[data-testid="exhibition-list"]').should(
      "not.contain",
      exhibitionTitle,
    );
  });
});
