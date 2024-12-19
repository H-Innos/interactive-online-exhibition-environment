# Interactive environment for online exhibitions

An online platform that allows visitors to explore exhibitions virtually, offering librarians an easy way to create and manage digital exhibitions.

## Project Description

The Interactive Online Exhibition Environment is a web-based platform developed to display the University of Tartu Library's unique collections through virtual exhibitions.

Because exhibition space in libraries is limited and some materials must be stored in special conditions, libraries cannot always display them in physical exhibitions. Traveling exhibitions also have limitations - they can only be in one place at a time. In order to overcome these obstacles, we are creating an online platform where visitors can explore library exhibitions at any time and from any place. This way we can make our exhibitions more accessible and interesting for everyone.

## Objectives

- Expanding Availability: Bring the collections of the University of Tartu Library to a wider audience.
- Increase Engagement: Provide interactive features such as educational games, quizzes and multimedia content.
- Easy Content Creation: Provide librarians with a simple and user-friendly environment to create and manage exhibitions without the need for technical skills.
- Preservation of Exhibitions: To extend the lifetime of exhibitions by allowing them to remain available online after the end of physical exhibition.

## Basic functions

### For visitors

- User-friendly Interface: A website that works smoothly on desktops, tablets and mobile devices.
- Exhibition Overview: An attractive home page displaying all available exhibitions with the ability to filter by categories and search by title.
- Interactive Content: High-resolution images, embedded videos, files and audio explanations improve the visitor experience.
- Educational Tools: Interactive quizzes related to the content of the exhibition.
- Multilingual Support: The page is available in both Estonian and English to reach a wider audience.
- Additional materials: Possibility to download guides to consume the exhibitions content offline.

### For librarians

- Content Management Dashboard: Simple tools to create new exhibitions and edit them.
- Easy Media Upload: Ability to upload images, videos, PDFs and other materials.
- Drag-and-Drop Interface: Easy to use content placement mechanism.
- Drafts: Ability to keep exhibitions as drafts and archive them to be saved privately.
- Educational Content Creation: Tools to add quizzes without programming.

## Local development

1.  Clone the repository.
2.  Run `pnpm install`.
3.  Create a file called `.env` in the root directory.
4.  Copy the following into the `.env` file:

```
POSTGRES_URL=postgres://postgres:postgres@localhost:5432/local-db
```
**Also add to the file the API key, required for file uploads (ask for this from a team member)**.

5.  Make sure you have Docker installed and running.
6.  Run `pnpm db:up` to start the local database. Make sure that postgres is not already running as a background task.
7.  If this is your first time starting the database, or you have modified the `src/server/db/schema.ts` file, run `pnpm db:push` to update the database schema.
8.  Run `pnpm dev` and the application will be accessible at http://localhost:3000.
9.  Run `pnpm db:down` to stop the database.
