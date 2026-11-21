describe('Quiz Functionality', () => {
  const exhibitionTitle = `Quiz test ${Date.now()}`;
  let exhibitionId: number | undefined;

  before(() => {
    cy.request('POST', '/api/trpc/exhibition.create', {
      json: { name: exhibitionTitle },
    });
    cy.request('/api/trpc/exhibition.getDrafts').then(({ body }) => {
      const draft = body.result.data.json.find(
        (exhibition: { name: string }) => exhibition.name === exhibitionTitle,
      );
      expect(draft, 'quiz test exhibition').to.exist;
      exhibitionId = draft.id;
    });
  });

  it('opens the quiz creator with editing disabled', () => {
    cy.visit(`/dashboard/${exhibitionId}/quizzes`);
    cy.contains('button', 'New Quiz', { timeout: 60000 }).should('be.visible');
    cy.get('input[placeholder="Enter quiz title"]').should('have.prop', 'readOnly', true);
    cy.get('input[placeholder="Enter your question here"]').should('have.prop', 'readOnly', true);
    cy.contains('button', 'Upload Image').should('be.disabled');
    cy.get('[data-testid="answer-input"]').each(($input) => {
      cy.wrap($input).should('have.prop', 'readOnly', true);
    });
    cy.get('[data-testid="answer-checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).should('be.disabled');
    });
    cy.contains('button', 'Add Answer').should('be.disabled');
    cy.contains('button', 'Add Question').should('be.disabled');
    cy.contains('button[type="submit"]', 'Create Quiz').should('be.disabled');
  });

  after(() => {
    if (exhibitionId !== undefined) {
      cy.request('POST', '/api/trpc/exhibition.delete', {
        json: { id: exhibitionId },
      });
    }
  });
});
