import {
  createExhibition,
  archiveExhibition,
  unarchiveExhibition,
  deleteExhibition,
  login,
} from "cypress/support/commands";

describe("Archive Functionality", () => {
  const exhibitionTitle = "Test Exhibition for Archiving" + Date.now();

  beforeEach(() => {
    login();
  });

  it("should create a new exhibition", () => {
    createExhibition(exhibitionTitle, "Archiving");
    cy.contains(exhibitionTitle, { timeout: 10000 }).should("be.visible");
  });

  it("should archive a newly created exhibition", () => {
    archiveExhibition(exhibitionTitle);
    cy.contains(exhibitionTitle).should("not.exist");
  });

  it("should view the archived exhibition", () => {
    cy.visit("/dashboard/archive");
    cy.contains(exhibitionTitle).should("be.visible");
  });

  it("should unarchive the exhibition", () => {
    unarchiveExhibition(exhibitionTitle);
    cy.contains(exhibitionTitle).should("not.exist");
  });

  it("should delete the unarchived exhibition", () => {
    deleteExhibition(exhibitionTitle);
    cy.contains(exhibitionTitle).should("not.exist");
  });
});
