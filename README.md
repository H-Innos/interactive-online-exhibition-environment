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
- Exhibition Overview: An attractive home page displaying all available exhibitions with the ability to filter and search by categories, topics or keywords.
- Interactive Content: High-resolution images, embedded videos, audio explanations and 3D models improve the visitor experience.
- Educational Tools: Interactive quizzes, questionnaires and educational games related to the content of the exhibition.
- Multilingual Support: Content is available in both Estonian and English to reach a wider audience.
- Feedback Opportunity: Visitors can leave comments or feedback that encourages community engagement.
- Additional materials: Possibility to download guides or additional materials to consume the exhibitions content offline.

### For librarians

- Content Management Desktop: Secure access to a simple tools to create new exhibitions and edit them.
- Easy Media Upload: Ability to upload images, videos, PDFs and other materials.
- Drag-and-Drop Interface: Easy to use content placement mechanism.
- Customizable Templates: A selection of different templates to easily customize the look and feel of exhibitions.
- Adding Metadata: Tagging exhibition items with important data such as title, author, date and material.
- Scheduling and Drafts: Ability to save exhibitions as drafts and schedule them to be published in the future.
- Educational Content Creation: Tools to add quizzes, games and interactive elements without programming.

### Exhibition Editor Guide
1. Use the + symbol or type / to add content to the page or drag and drop images, videos etc.
2. Select text to change its style (font, color etc).
3. Don't forget to save the exhibition from time to time to prevent any content getting lost.
4. You can change the title, description, thumbnail and contributors with the Details button in the toolbar.
5. Only drafts can be edited. To edit a published or archived exhibition, you first have to make it back into a draft.
6. Quizzes can be added with the Create Quiz button in the toolbar and are linked with the specific exhibition.
7. Use the Preview button to see the current state of the exhibition. Make sure to save the exhibition before so it reflects the correct content.
8. You can upload and readjust the cover image in the toolbar. This is separate from the thumbnail.


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

## Future development
1. Adding gallery and flipbook components. These were started by us and the corresponding branches can be found under Code -> Branches.
2. Implement the university login to authorize librarians correctly. Make drafts user specific and track user actions for creating and modifying exhibitions.
3. Change the current media storage from Cloudinary to a bigger solution to handle more data.

## Licence

This project is licensed under the BSD 2-Clause License.
See [LICENSE](LICENSE) for details.

## University Branding

This project was developed as part of the LTAT.05.005 Software Project course as a prototype for the University of Tartu Library.

The University of Tartu's name, logos, trademarks, and other official visual identity assets remain the property of their respective rights holders and are not licensed under the BSD 2-Clause License.

This repository is maintained independently and is not an official University of Tartu product.
