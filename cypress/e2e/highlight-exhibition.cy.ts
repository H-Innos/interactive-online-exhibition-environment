import {
  createExhibition,
  deleteExhibition,
  featureExhibition,
  login,
  publishExhibition,
  register,
  unpublishExhibition,
} from "cypress/support/commands";

describe("Highlight Exhibition", () => {
  const exhibitionTitle = `exhibition-${Date.now()}`;
  const exhibtionDescription = "create test description";

  before(() => {
    register();
  });

  beforeEach(() => {
    login();
    createExhibition(exhibitionTitle, exhibtionDescription);
  });

  it("should highlight an exhibition", () => {
    publishExhibition(exhibitionTitle);
    featureExhibition(exhibitionTitle);

    cy.visit("/");
    cy.contains(exhibitionTitle).should("be.visible");

    unpublishExhibition(exhibitionTitle);
    deleteExhibition(exhibitionTitle);

    cy.visit("/");
    cy.contains(exhibitionTitle).should("not.exist");
  });
});
