import { selectors } from "cypress/support/selectors";

import {
  createExhibition,
  deleteExhibition,
  publishExhibition,
  openExhibitionDropdown,
  checkDropdownButtonDisabled,
} from "cypress/support/commands";

describe("Dashboard Page", () => {
  const exhibitionTitle = `Test exhibition ${Date.now()}`;

  before(() => {
    createExhibition(exhibitionTitle, "Test Exhibition Description");
    publishExhibition(exhibitionTitle);
  });

  beforeEach(() => {
    cy.visit("/dashboard");
  });

  it("should display the Dashboard heading", () => {
    cy.get(selectors.dashboardHeading).should("be.visible");
  });

  it("should open the Create Exhibition Modal", () => {
    cy.get(selectors.newExhibitionButton).click({ force: true });
    cy.get(selectors.createButton).should("be.visible");
  });

  it("should navigate to the drafts page by clicking the arrow", () => {
    cy.get(selectors.viewAllButton).click();
    cy.url().should("include", "/dashboard/drafts");
  });

  it("should click the gear icon on a published exhibition card", () => {
    cy.visit("/dashboard/published");
    cy.contains("Published Exhibitions");
    openExhibitionDropdown(exhibitionTitle);
    cy.log("Verified that the gear icon is clickable");
  });

  describe("Dropdown Button Disabled Tests", () => {
    it("should show disabled Edit button for published exhibitions", () => {
      cy.visit("/dashboard/published");
      cy.contains("Published Exhibitions");
      checkDropdownButtonDisabled(exhibitionTitle, "Edit");
    });

    it("should show disabled Delete button for published exhibitions", () => {
      cy.visit("/dashboard/published");
      cy.contains("Published Exhibitions");
      checkDropdownButtonDisabled(exhibitionTitle, "Delete");
    });
  });
});
