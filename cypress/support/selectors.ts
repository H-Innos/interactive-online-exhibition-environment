
export const selectors = {
  newExhibitionButton: 'button:contains("New Exhibition")',
  exhibitionTitleInput: 'input[placeholder="Enter exhibition title"]',
  exhibitionDescriptionInput: 'textarea[placeholder="Enter exhibition description"]',
  createExhibitionButton: 'button[type="submit"]:contains("Create")',
  exhibitionCard: (title: string) => `[data-testid="dashboard-exhibition-card"]:contains("${title}")`,
  optionsButton: 'button[aria-haspopup="menu"]',
  dropdownMenu: '[role="menu"]',
  dropdownMenuItem: `[role="menuitem"]`,
  publishButton: 'button:contains("Publish")',
  editorInput: '[contenteditable="true"]',
  saveEditorButton: '[data-testid="save-editor-changes"]',
  saveDataButton: 'button[type="submit"]:contains("Save changes")',
  editButton: 'button:contains("Edit")',
  titleInput: '[id="title"]',
  descriptionInput: '[id="description"]',
}