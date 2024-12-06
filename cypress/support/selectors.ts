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
};
