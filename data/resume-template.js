// Starter resume in Markdown for the resume builder's "Use template" button.
// Plain text only (no emoji or tables) so it stays ATS-friendly and prints cleanly to PDF.
export function buildResumeTemplate({ name, email } = {}) {
  return `# ${name || "Your Name"}

**Job title you are targeting**
${email || "you@example.com"} | +91 98765 43210 | City, Country | [LinkedIn](https://linkedin.com/in/your-profile) | [GitHub](https://github.com/your-handle)

## Summary

Two or three sentences: what you do, for how long, and the result you are best at. Example: Frontend engineer with 3 years building React apps used by 50k people a month; cut page load time by 40% at my last role.

## Skills

- **Languages:** JavaScript, TypeScript, Python
- **Frameworks:** React, Next.js, Node.js
- **Tools:** Git, Docker, PostgreSQL, AWS

## Experience

### Job Title, Company Name
*Month Year to Present* | City or Remote

- Start each line with a verb and end with a result: Built X, which did Y, measured by Z.
- Shipped a feature or project, and say how many people used it or what it saved.
- Mention the tools you used where they matter to the job you want.

### Job Title, Company Name
*Month Year to Month Year* | City or Remote

- Led, built, improved or reduced something, with a number if you have one.
- Keep 3 to 5 lines per role, most impressive first.

## Projects

### Project Name | [Live](https://example.com) | [Code](https://github.com/your-handle/project)

- One line on what it does and who it is for.
- One line on the hardest part you solved and the stack you used.

## Education

### Degree, Major, University Name
*Year to Year* | CGPA or percentage (optional)

## Certifications

- Certification Name, Issuing Organization, Year
`;
}
