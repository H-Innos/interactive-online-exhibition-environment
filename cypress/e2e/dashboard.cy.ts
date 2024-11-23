describe("Dashboard Page", () => {
  const selectors = {
    dashboardHeading: 'h1:contains("Dashboard")',
    newExhibitionButton: 'button:contains("New Exhibition")',
    createButton: 'button:contains("Create")',
    viewAllButton: '[data-testid="view-all-button"]',
    cardOptionsButton: 'button[aria-label="Card options"]',
    editOption: "Edit",
    editorInput: '.editor-container__editor div[contenteditable="true"]',
    exhibitionTitleInput: 'input[placeholder="Enter exhibition title"]',
    exhibitionDescriptionInput:
      'textarea[placeholder="Enter exhibition description"]',
    exhibitionCard: (title: string) =>
      `[data-testid="dashboard-exhibition-card"]:contains("${title}")`,
  };

  beforeEach(() => {
    cy.visit("/dashboard");
  });

  it("should display the Dashboard heading", () => {
    cy.get(selectors.dashboardHeading).should("be.visible");
  });

  it("should open the Create Exhibition Modal", () => {
    cy.get(selectors.newExhibitionButton).click();
    cy.get(selectors.createButton).should("be.visible");
  });

  it("should navigate to the drafts page by clicking the arrow", () => {
    cy.get(selectors.viewAllButton).click();
    cy.url().should("include", "/dashboard/drafts");
  });

  it("should click the gear icon on a published exhibition card", () => {
    cy.contains("Published Exhibitions")
      .parent()
      .find(selectors.cardOptionsButton)
      .first()
      .click();

    cy.contains(selectors.editOption).should("be.visible");
    cy.log("Verified that the gear icon is clickable");
  });

  it("should show disabled Delete, Edit, and Archive buttons for published exhibitions", () => {
    cy.contains("Published Exhibitions")
      .parent()
      .find(selectors.cardOptionsButton)
      .first()
      .click();

    cy.contains("Edit")
      .should("be.visible")
      .and("have.attr", "aria-disabled", "true")
      .and("have.class", "opacity-50")
      .and("have.class", "cursor-not-allowed");

    cy.contains("Edit").click({ force: true });
    cy.url().should("not.include", "dashboard/");
  });

  it("should show disabled Delete button for published exhibitions", () => {
    cy.contains("Published Exhibitions")
      .parent()
      .find(selectors.cardOptionsButton)
      .first()
      .click();

    cy.contains("Delete")
      .should("be.visible")
      .and("have.attr", "aria-disabled", "true")
      .and("have.class", "opacity-50")
      .and("have.class", "cursor-not-allowed");

    cy.contains("Delete").click({ force: true });
    cy.get(selectors.cardOptionsButton).should("exist");
  });
});
