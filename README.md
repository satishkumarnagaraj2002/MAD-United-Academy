# MAD United Academy

A responsive, static website for MAD United Academy. It uses native HTML, CSS and JavaScript, with a small Node.js build script and no runtime dependencies.

## Included pages

- Home
- About MAD United Academy
- Karate, Bharatanatyam, Western Dance and Yoga
- Classes and timetable
- Instructors
- Achievements
- Gallery
- Contact and join
- Privacy notice and terms

The student/parent portal and admin area are intentionally not included: authentication, permissions, data storage and review workflows have not been configured. The site does not present a fake sign-in or claim to accept enquiries until a real endpoint is connected.

## Requirements and local development

Install Node.js 20 or newer. No package installation is needed.

```powershell
npm run dev
```

Open <http://127.0.0.1:4173>. To create and preview the production output:

```powershell
npm run build
npm run preview
```

The preview server is available at <http://127.0.0.1:4173>. The development and preview servers bind to loopback only.

## Academy details to confirm

Update `src/config.js` with verified academy details and content:

- Contact email, telephone and WhatsApp number, only when supplied and verified.
- Class schedule, age groups, levels, instructors and programme details.
- Approved achievement records and testimonials.
- Academy gallery items with publication approval and appropriate consent.
- Social profiles, if any.

Schedule entries should be added to `academy.classes` and marked `published: true` only after verification. Instructor profiles require `approved: true`; public achievements require both `approvalStatus: "approved"` and `published: true`; gallery items require `approved: true` and `consentConfirmed: true`. Keep personal contact information and private student submissions out of this public configuration.

The supplied logo is preserved at `public/images/mad-united-academy-logo.jpeg`; a circular display version is generated at `public/images/mad-united-academy-logo-circle.png` for the website, favicon and social preview. The Karate imagery is intentionally a branded graphic rather than a photograph. Other programme photographs are illustrative remote stock images, not academy members. Verify image usage rights and replace them with licensed or academy-owned photography before launch. Never publish identifiable images of minors without appropriate parent or guardian consent.

## Enquiry delivery

The form validates its fields in the browser. It does **not** send or save an enquiry unless `ENQUIRY_ENDPOINT` is configured during the build. Without that setting, it reports that the enquiry was not sent; it never shows a false success state.

Configure a public HTTPS endpoint that:

1. Accepts a JSON `POST` containing the enquiry fields and consent value.
2. Validates and safely stores or forwards the request on the server.
3. Applies server-side spam protection, rate limits, and input-size limits.
4. Returns a 2xx response only after the enquiry is safely accepted.
5. Does not expose credentials or privileged database keys to the browser.

Set the endpoint in the build environment (for example, in Vercel project environment variables):

```text
ENQUIRY_ENDPOINT=https://your-service.example/api/enquiries
```

The browser also needs the endpoint to permit cross-origin requests from the deployed website. Review the endpoint's privacy, retention, security and child-data handling before enabling it. `.env.example` contains variable names only.

## SEO and production domain

No production domain was supplied, so the site intentionally emits no canonical URLs and no fabricated sitemap URLs. Set `SITE_URL` to the verified production origin during the build to generate canonical tags for every route and `dist/sitemap.xml`:

```text
SITE_URL=https://your-verified-domain.example
```

`robots.txt` is included. Page titles and descriptions are generated from the route metadata in `src/config.js`. Structured local-business data is omitted until the academy's public business details are verified.

## Build and Vercel

Run `npm run build` before deployment. The generated site is in `dist/`; a production build with no external services configured remains a valid static site, but enquiry delivery remains disabled. The repository includes `vercel.json` with the build command and output directory.

This workspace was empty and had no Git repository or remote configured when the site was created. Connect it to the intended GitHub repository before pushing; no Git remotes or deployment settings were changed.

To deploy with the existing GitHub/Vercel workflow:

1. Review and update the verified academy content and deployment environment variables.
2. Connect the workspace to the intended GitHub repository and push the project; do not commit `.env` files or private student data.
3. Import that repository into Vercel, preserving any existing project settings.
4. Confirm the project root is the repository root and the output directory is `dist`.
5. Set `SITE_URL` to the production domain and, only after the service is ready, set `ENQUIRY_ENDPOINT`.
6. Deploy a preview, test every page and enquiry behavior, then assign the verified production domain.

## Backend and future portal

No database, authentication, admin workflow, student portal, file upload or enquiry backend is implemented. Do not treat public configuration data as a secure database. Before adding those features, choose and configure a backend (for example, Supabase), server-side validation, role-based access controls, row-level security, private file storage and an approval workflow. Test that public queries expose only approved achievements and consented gallery items. Never use browser storage as an authentication or authorization mechanism.

The privacy and terms pages are clearly marked drafts. Have them updated to describe actual data practices and reviewed for applicable requirements before collecting personal information.
# MAD-United-Academy
