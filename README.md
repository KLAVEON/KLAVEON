# KLAVEON website

Static site (HTML, CSS, a little JavaScript). No build step.

- `index.html` home
- `work/index.html` selected work, Grid / List
- `work/skin-by-tea/index.html` case study with Defining Idea card and Visual / Reading view
- Font: Space Grotesk (Google Fonts)

## Run locally
`python3 -m http.server 8000` then open http://localhost:8000

## Before launch
1. Contact form: replace `YOUR_FORM_ID` in `index.html` with a Formspree form id (set the notification address to klaveonfoundry@gmail.com).
2. Images currently load from the Webflow CDN. Download the SKIN by Tea guide pages from the Webflow Assets panel into `assets/` and update the `src` paths, so the site does not depend on Webflow.

## Add a case study
Copy `work/skin-by-tea/` to `work/<name>/`, edit the text and images, and add a card to `work/index.html`.
