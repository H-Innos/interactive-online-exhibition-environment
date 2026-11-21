import { create } from "node_modules/cypress/types/lodash";

export const selectors = {
  newExhibitionButton: 'button:contains("New Exhibition")',
  createButton: 'button:contains("Create")',
  exhibitionTitleInput: 'input[placeholder="Enter exhibition title"]',
  exhibitionDescriptionInput:
    'textarea[placeholder="Enter exhibition description"]',
  exhibitionCard: (title: string) =>
    `[data-testid="exhibition-card"]:contains("${title}")`,
  optionsButton: '[data-testid="card-options-button"]',
  dropdownMenu: '[role="menu"]',
  dropdownMenuItem: '[role="menuitem"]',
  publishButton: '[data-testid="select-publish-exhibition"]',
  editorInput: '[contenteditable="true"]',
  saveEditorButton: '[data-testid="save-editor-changes"]',
  saveDataButton: 'button:contains("Save changes")',
  editButton: '[data-testid="select-edit-exhibition"]',
  deleteButton: '[data-testid="select-trash-exhibition"]',
  restoreButton: '[data-testid="select-restore-exhibition"]',
  archiveButton: '[data-testid="select-archive-exhibition"]',
  dashboardHeading: 'h1:contains("Dashboard")',
  viewAllButton: 'span:contains("〉")',

  // Login
  loginDropdownButton: '[data-testid="login-dropdown-button"]:visible',
  loginButton: '[data-testid="login-button"]:visible',
  logoutButton: 'button:contains("Log Out")',
  registerButton: '[data-testid="register-button"]:visible',
  emailInput: '[data-testid="email-input"]:visible',
  passwordInput: '[data-testid="password-input"]:visible',
  userExistsToast: ':contains("User already exists")',

  // Quiz
  createQuizButton: '[data-testid="create-quiz"]',
  newQuizButton: '[data-testid="new-quiz"]',
  quizTitleInput: '[data-testid="quiz-title-input"]',
  questionInput: '[data-testid="question-text-input"]',
  answerInput: '[data-testid="answer-input"]',
  saveQuizChangesButton: '[data-testid="save-quiz-changes-button"]',
  answerCheckbox: '[data-testid="answer-checkbox"]',
  activitiesDropdown: '[data-testid="activities-dropdown-button"]',
};
