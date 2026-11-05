# RASCO Industries: Testing Machines Presentation

An interactive, 19-slide sales presentation for RASCO Industries of Chakan, Pune, India, showing the leak, end-of-line and functional testing machines the company designs and builds. It is a static website with live 3D machine models, made to run in a browser or on GitHub Pages.

## Features

- 16:9 slides that scale to any screen, with keyboard, touch and on-screen controls
- Two live 3D machine models with exploded, blueprint and guard views
- Speaker notes, a slide list and direct links to any slide
- Works offline: no build step, server or internet connection needed
- Prints to a 19-page PDF

## Running it

Open `index.html` in Chrome or Edge. From PowerShell:

```powershell
Start-Process "index.html"
```

To view it the way GitHub Pages serves it:

```powershell
python -m http.server 8000
```

Then open http://localhost:8000.

## Presenting

| Key | Action |
| --- | --- |
| Right arrow, Space, Page Down | Next slide |
| Left arrow, Page Up | Previous slide |
| Home, End | First, last slide |
| F | Full screen |
| N | Speaker notes |
| M | Slide list |
| E | Exploded view (on the 3D slides) |

Move the mouse to show the on-screen buttons. A link ending in `#7` opens slide 7.

To save a PDF, press Ctrl+P in Chrome or Edge, choose Save as PDF, set Margins to None and turn on Background graphics.

## Project structure

```text
index.html          All slides and speaker notes
css/deck.css        Layout, colors and motion
js/deck.js          Slide navigation and controls
js/rig3d.js         3D viewer, bundled with three.js
assets/
  brand/            RASCO logo
  clients/          Client logos
  fonts/            Archivo and IBM Plex
  machines/         Machine images
  model/            3D models and still posters
  photos/           Factory and team photos
  video/            Company film
```

## Editing

- **Client name:** in `index.html`, set `data-client="Company Name"` on the `<body>` tag to show "Prepared for Company Name" on the cover.
- **Text and speaker notes:** everything is in `index.html`, with one commented `<section>` per slide. Notes sit in `<aside class="notes">`.
- **Images:** replace a file in `assets/machines/` or `assets/photos/` using the same name, or update its path in `index.html`.

`Raw_Images/` is a local folder for source files. It is excluded by `.gitignore` and must stay out of this repository, because CAD source files can contain customer names, part numbers and internal paths.

## 3D models

`assets/model/rig.js` holds two compressed models, embedded so that they also work when `index.html` is opened directly. Customer product, part names and file paths were removed before they were added. Finishes are display colors in the RASCO palette, not the CAD colors. `js/rig3d.js` is the viewer.

Export any new machine from SolidWorks as GLB with customer product left out.

## Publishing on GitHub Pages

In the repository, open Settings, then Pages. Under Source choose Deploy from a branch, then `main` and `/ (root)`. The site appears at `https://<account>.github.io/<repository>/`. All paths are relative, and `.nojekyll` tells GitHub to serve the files as they are.

A GitHub Pages site can be opened by anyone who has the link. The `noindex` tag asks search engines to leave it out, but it does not restrict access.

## License and ownership

The MIT License in [LICENSE](LICENSE) applies to the source code only: the HTML, CSS and JavaScript written for this presentation.

It does not apply to the RASCO name and logo, or to the machine images, photographs, company film and 3D models. These are the property of RASCO Industries, all rights reserved. Client logos are the trademarks of their owners and are shown for identification only.

Third-party components keep their own licenses: three.js (MIT), and the Archivo and IBM Plex fonts (SIL Open Font License).
