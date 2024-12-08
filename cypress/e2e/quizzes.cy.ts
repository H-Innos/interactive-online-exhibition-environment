import {
  createExhibition,
  deleteExhibition,
  login,
  openExhibitionEditor,
  unpublishExhibition,
} from "cypress/support/commands";
import { selectors } from "cypress/support/selectors";

describe("Quiz Functionality", () => {
  const exhibitionTitle = "quiz test";

  const selectors = {
    newExhibitionButton: 'button:contains("New Exhibition")',
    exhibitionTitleInput: 'input[placeholder="Enter exhibition title"]',
    exhibitionDescriptionInput:
      'textarea[placeholder="Enter exhibition description"]',
    submitButton: 'button[type="submit"]:contains("Create")',
    dashboardCard: (title: string) =>
      `[data-testid="dashboard-exhibition-card"]:contains("${title}")`,
    dropdownMenu: '[role="menu"]',
    dropdownMenuItem: `[role="menuitem"]`,
    quizTitleInput: 'input[placeholder="Enter quiz title"]',
    questionInput: 'input[placeholder="Enter your question here"]',
    imageUploadButton: 'button[type="button"]:contains("Upload Image")',
    answerInput: '[data-testid="answer-input"]',
    answerCheckbox: '[data-testid="answer-checkbox"]',
    addAnswerButton: 'button:contains("Add Answer")',
    addQuestionButton: 'button:contains("Add Question")',
    createQuizButton: '[data-testid="create-quiz"]',
  };
  beforeEach(() => {
    login();
    createExhibition(exhibitionTitle, "sdasd");
    openExhibitionEditor(exhibitionTitle);
  });

  /*it("should have fields disabled on creator open", () => {
    cy.get(selectors.createQuizButton).click();
    cy.get(selectors.quizTitleInput).should("have.attr", "readonly");
    cy.get(selectors.questionInput).should("have.attr", "readonly");
    cy.get(selectors.imageUploadButton).should("be.disabled");
    cy.get(selectors.answerInput).each(($el) => {
      cy.wrap($el).should("have.attr", "readonly");
    });
    cy.get(selectors.answerCheckbox).each(($el) => {
      cy.wrap($el).should("be.disabled");
    });
    cy.get(selectors.addAnswerButton).should("be.disabled");
    cy.get(selectors.addQuestionButton).should("be.disabled");
    cy.get(selectors.createQuizButton).should("be.disabled");
  });*/

  after(() => {
    cy.visit("/dashboard/drafts");
    cy.get(selectors.dashboardCard(exhibitionTitle), { timeout: 20000 })
      .should("be.visible")
      .as("exhibitionCard");

    cy.get("@exhibitionCard").within(() => {
      cy.get('button[aria-haspopup="menu"]').as("optionsButton");
      cy.get("@optionsButton").should("be.visible").click({ force: true });
    });

    cy.get(selectors.dropdownMenu).should("be.visible");
    cy.contains(selectors.dropdownMenuItem, "Delete", { timeout: 20000 }).click(
      { force: true },
    );
  });
});
