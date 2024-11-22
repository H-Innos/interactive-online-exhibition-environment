import { selectors } from "./selectors";

export function createExhibition(title: string, description: string) {
  cy.intercept("POST", "/api/trpc/**").as("createRequest");

  cy.visit("/dashboard/drafts");
  cy.get(selectors.newExhibitionButton).click();

  cy.get(selectors.exhibitionTitleInput).type(title);
  cy.get(selectors.exhibitionDescriptionInput).type(description);

  cy.get(selectors.createExhibitionButton).contains("Create").click();

  cy.wait("@createRequest").then((interception) => {
    expect(interception.response?.statusCode).to.eq(200);
  });
}

export function openExhibitionEditor(exhibitionTitle: string) {
  cy.visit("/dashboard/drafts");
  cy.get(selectors.exhibitionCard(exhibitionTitle)).first().within(() => {
    cy.get(selectors.optionsButton).should("be.visible").click({ force: true });
  });

  cy.get(selectors.dropdownMenu).should("be.visible");
  clickDropdownMenuItem("Edit");
  cy.contains("Edit Exhibition", { timeout: 20000 }).should("be.visible");
}

export function unpublishExhibition(exhibitionTitle: string) {
  cy.intercept("POST", "/api/trpc/**").as("unpublishRequest");
  cy.visit("/dashboard");
  cy.get(selectors.exhibitionCard(exhibitionTitle)).first().within(() => {
    cy.get(selectors.optionsButton).should("be.visible").click({ force: true });
  });

  cy.get(selectors.dropdownMenu).should("be.visible");
  clickDropdownMenuItem("Unpublish");
  cy.wait("@unpublishRequest").then((interception) => {
    expect(interception.response?.statusCode).to.eq(200);
  });
}

export function deleteExhibition(title: string) {
  cy.intercept("POST", "/api/trpc/**").as("deleteRequest");

  cy.visit("/dashboard/drafts");
  cy.get(selectors.exhibitionCard(title)).first()
    .should("be.visible")
    .within(() => {
      cy.get(selectors.optionsButton)
        .should("be.visible")
        .click({ force: true });
    });

  cy.get(selectors.dropdownMenu).should("be.visible");

  clickDropdownMenuItem("Delete");
  cy.wait("@deleteRequest").then((interception) => {
    expect(interception.response?.statusCode).to.eq(200);
  });
}

function clickDropdownMenuItem(item: string) {
  cy.contains(selectors.dropdownMenuItem, item, { timeout: 20000 }).click({
    force: true,
  });
}
