import { selectors } from "./selectors";

export function login() {
  cy.visit("/");

  cy.get("body").then(($body) => {
    if ($body.find(selectors.logoutButton).length > 0) {
      cy.log("User is already logged in, skipping the test.");
      return; // Skip the rest of the test
    } else {
      cy.get(selectors.loginDropdownButton).click({ force: true });
      cy.get(selectors.emailInput).type("test@test.com");
      cy.get(selectors.passwordInput).type("12345678");
      cy.get(selectors.registerButton).click({ force: true });

      cy.contains("User already exists", { timeout: 10000, log: false }).then(
        ($toast) => {
          if ($toast.length > 0) {
            cy.get(selectors.loginButton).click({ force: true });
          }
        },
      );
      cy.url().should("include", "/dashboard");
    }
  });
}

export function createExhibition(title: string, description: string) {
  cy.intercept("POST", "/api/trpc/**").as("createRequest");
  cy.visit("/dashboard/drafts");
  cy.get(selectors.newExhibitionButton, { timeout: 5000 })
    .should("be.visible")
    .debug()
    .click({ force: true });
  cy.get(selectors.exhibitionTitleInput).type(title);
  cy.get(selectors.exhibitionDescriptionInput).type(description);
  cy.get(selectors.createButton).click({ force: true });
  cy.wait("@createRequest").then((interception) => {
    expect(interception.response?.statusCode).to.eq(200);
  });
}

export function openExhibitionEditor(exhibitionTitle: string) {
  cy.visit("/dashboard/drafts");
  cy.get(selectors.exhibitionCard(exhibitionTitle))
    .first()
    .within(() => {
      cy.get(selectors.optionsButton)
        .should("be.visible")
        .click({ force: true });
    });

  cy.get(selectors.dropdownMenu).should("be.visible");
  clickDropdownMenuItem("Edit");
  cy.contains("Edit Exhibition", { timeout: 20000 }).should("be.visible");
}

export function publishExhibition(exhibitionTitle: string) {
  cy.intercept("POST", "/api/trpc/**").as("publishRequest");
  cy.visit("/dashboard");
  cy.get(selectors.exhibitionCard(exhibitionTitle))
    .first()
    .within(() => {
      cy.get(selectors.optionsButton)
        .should("be.visible")
        .click({ force: true });
    });

  cy.get(selectors.dropdownMenu).should("be.visible");
  clickDropdownMenuItem("Publish");
  cy.wait("@publishRequest").then((interception) => {
    expect(interception.response?.statusCode).to.eq(200);
  });
}

export function unpublishExhibition(exhibitionTitle: string) {
  cy.intercept("POST", "/api/trpc/**").as("unpublishRequest");
  cy.visit("/dashboard");
  cy.get(selectors.exhibitionCard(exhibitionTitle))
    .first()
    .within(() => {
      cy.get(selectors.optionsButton)
        .should("be.visible")
        .click({ force: true });
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
  cy.get(selectors.exhibitionCard(title))
    .first()
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

export function archiveExhibition(exhibitionTitle: string) {
  cy.intercept("POST", "/api/trpc/**").as("archiveRequest");
  cy.visit("/dashboard/drafts");
  cy.get(selectors.exhibitionCard(exhibitionTitle))
    .first()
    .within(() => {
      cy.get(selectors.optionsButton)
        .should("be.visible")
        .click({ force: true });
    });

  cy.get(selectors.dropdownMenu).should("be.visible");
  clickDropdownMenuItem("Archive");
  cy.wait("@archiveRequest").then((interception) => {
    expect(interception.response?.statusCode).to.eq(200);
  });
}

export function unarchiveExhibition(exhibitionTitle: string) {
  cy.intercept("POST", "/api/trpc/**").as("unarchiveRequest");
  cy.visit("/dashboard/archive");
  cy.get(selectors.exhibitionCard(exhibitionTitle))
    .first()
    .within(() => {
      cy.get(selectors.optionsButton)
        .should("be.visible")
        .click({ force: true });
    });

  cy.get(selectors.dropdownMenu).should("be.visible");
  clickDropdownMenuItem("Unarchive");
  cy.wait("@unarchiveRequest").then((interception) => {
    expect(interception.response?.statusCode).to.eq(200);
  });
}

function clickDropdownMenuItem(item: string | number | RegExp) {
  cy.contains(selectors.dropdownMenuItem, item, { timeout: 20000 }).click({
    force: true,
  });
}

export function openExhibitionDropdown(exhibitionTitle: string) {
  cy.get(selectors.exhibitionCard(exhibitionTitle))
    .first()
    .within(() => {
      cy.get(selectors.optionsButton)
        .should("be.visible")
        .click({ force: true });
    });

  cy.get(selectors.dropdownMenu).should("be.visible");
}

export function checkDropdownButtonDisabled(
  exhibitionTitle: string,
  buttonText: string,
) {
  cy.get(selectors.exhibitionCard(exhibitionTitle))
    .first()
    .within(() => {
      cy.get(selectors.optionsButton)
        .should("be.visible")
        .click({ force: true });
    });

  cy.get(selectors.dropdownMenu).should("be.visible");

  cy.contains(selectors.dropdownMenuItem, buttonText)
    .should("be.visible")
    .and("have.attr", "aria-disabled", "true");
}
