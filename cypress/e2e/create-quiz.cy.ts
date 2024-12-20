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

describe("Create Quiz", () => {
  const exhibitionTitle = `exhibition-${Date.now()}`;
  const exhibtionDescription = "create test description";

  const quizTitle = "test quiz";
  const questionText = "test question";
  const answerText1 = "test answer 1";
  const answerText2 = "test answer 2";

  before(() => {
    register();
  });

  beforeEach(() => {
    login();
    createExhibition(exhibitionTitle, exhibtionDescription);
    cy.on("window:alert", (str) => {
      return true;
    });

    cy.on("window:confirm", (str) => {
      return true;
    });
  });

  it("should create a quiz", () => {
    openExhibitionEditor(exhibitionTitle);
    cy.url().then((url) => {
      const newUrl = `${url}/quizzes`;
      cy.visit(newUrl);
    });

    cy.get(selectors.newQuizButton).click({ force: true });

    cy.get(selectors.quizTitleInput).type(quizTitle);
    cy.get(selectors.questionInput).type(questionText);
    cy.get(selectors.answerInput).first().type(answerText1);
    cy.get(selectors.answerInput).eq(1).type(answerText2);
    cy.get(selectors.answerCheckbox).first().click({ force: true });
    cy.intercept("POST", "/api/trpc/quiz**").as("createQuizRequest");
    cy.get(selectors.saveQuizChangesButton).click({ force: true });
    cy.wait("@createQuizRequest");
    publishExhibition(exhibitionTitle);

    cy.visit("/all");
    cy.get(selectors.exhibitionCard(exhibitionTitle)).first().click({
      force: true,
    });

    cy.get(selectors.activitiesDropdown, { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });

    cy.contains(quizTitle).click({ force: true });

    cy.contains(quizTitle, { timeout: 10000 }).should("be.visible");
    cy.contains(questionText, { timeout: 10000 }).should("be.visible");
    cy.contains(answerText1, { timeout: 10000 }).should("be.visible");
    cy.contains(answerText2, { timeout: 10000 }).should("be.visible");
  });

  afterEach(() => {
    unpublishExhibition(exhibitionTitle);
    deleteExhibition(exhibitionTitle);
  });
});
