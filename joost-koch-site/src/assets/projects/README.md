# Project Data Structure (`src/assets/projects.json`)

This document explains the structure and keys used in the `projects.json` file, which stores information about various projects displayed on the website. This information is intended to help developers and Language Models (LLMs) understand how to correctly format and utilize this data.

The `projects.json` file contains a JSON array of project objects. Each object represents a single project and has the following keys:

*   `id`: (String, Required) A unique identifier for the project. This ID is used in URLs (e.g., `/projects/[id]`) and to locate project-specific assets, such as images, which should be stored in a directory named after the ID within `src/assets/projects/` (e.g., `src/assets/projects/[id]/`). The ID should be URL-friendly (lowercase, hyphenated).
*   `title`: (String, Required) The main title or name of the project.
*   `date`: (String, Required) The project's creation or last significant update date. This should be formatted according to the ISO 8601 standard (e.g., "YYYY-MM-DDTHH:mm:ss.sssZ").
*   `rank`: (Number, Required) A numerical value used for ordering projects when displayed. Projects with lower `rank` values are typically displayed first or considered more important.
*   `tags`: (Array of Strings, Required) A list of keywords or categories associated with the project. These help in filtering or searching for projects.
*   `status`: (String, Required) The current development or completion status of the project (e.g., "Completed", "Live", "Exploratory", "Archived", "Functional Prototype").
*   `team`: (Array of Strings, Required) A list of names of individuals who primarily worked on or contributed to the project.
*   `technologies`: (Array of Strings, Required) A list of key technologies, programming languages, frameworks, or tools used in the development of the project.
*   `description`: (String, Required) A detailed description of the project. This field supports Markdown for formatting (e.g., bold, italics, lists). It also supports special placeholders for embedding images directly within the description: `{{image_name.extension}}`. When this placeholder is encountered, it will be replaced by an image file located at `src/assets/projects/[id]/image_name.extension`.
*   `url`: (String, Optional) The direct URL to the live project, demo, or primary landing page if available.
*   `github`: (String, Optional) The URL to the project's GitHub repository. Include this key only if a public GitHub repository exists for the project.
*   `images`: (Array of Strings, Optional) A list of filenames (including extensions) for additional images associated with the project. These images are typically displayed separately from the main description, perhaps in a gallery or carousel. The image files should be located in the project's asset directory: `src/assets/projects/[id]/[image_filename]`.
*   `pdfs`: (Array of Strings, Optional) A list of filenames (including extensions) for PDF documents associated with the project. Each string in the array is a filename of a PDF document (e.g., `"mydoc.pdf"`). These PDF files are expected to be located in the project's specific asset directory: `src/assets/projects/[project_id]/[pdf_filename.pdf]`. This key is optional; a project may not have any associated PDFs.

## Example Project Object

```json
{
  "id": "example-ai-system",
  "title": "Advanced AI Assessment Platform",
  "date": "2025-02-23T12:00:00.000Z",
  "rank": 1,
  "tags": [
    "AI",
    "Machine Learning",
    "Education Tech",
    "Python",
    "Vue.js"
  ],
  "url": "https://example-ai-system.com/demo",
  "status": "Completed",
  "team": [
    "Jane Doe",
    "John Smith"
  ],
  "technologies": [
    "Python",
    "Flask",
    "PyTorch",
    "Google Cloud Platform",
    "Vue.js",
    "Vuetify",
    "Firebase"
  ],
  "description": "This project showcases an innovative system for **AI-Powered Assessment**. It can grade various types of questions.\n\nHere's an inline image of the architecture: {{system-architecture.png}}.\n\nKey features include automated grading and detailed analytics.",
  "github": "https://github.com/username/example-ai-system",
  "images": [
    "dashboard-screenshot.jpg",
    "report-example.png"
  ],
  "pdfs": [
    "project-proposal.pdf",
    "final-report.pdf"
  ]
}