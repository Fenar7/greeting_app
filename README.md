# For Shahanas, With All My Heart ♡

A handcrafted, seven-chapter birthday experience made for **Shahanas (Umma)**, November 22, 2026.

Designed with an editorial cream-and-burgundy palette, an interactive Three.js starfield, a blooming 3D rose, GSAP ScrollTrigger storytelling, graceful fallback artwork, and responsive layouts.

## Quick start

Requires **Node.js 20.9 or later** and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Build for production:

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push the contents of this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import that repository, and use the automatically detected **Next.js** framework.
3. Keep the root directory as `./` and run a deployment. There are no API keys or environment variables.
4. Test the site on your phone before sharing with Umma.

Vercel will assign an available domain, such as `your-project.vercel.app`; that example is not a reserved address.

## Personalize it

All names, messages, garden notes, and the heartfelt letter live in [`lib/content.js`](lib/content.js). Edit that file to make the words unmistakably yours.

This experience is **100% photo-free** by design. The garden contains three original vector-flower illustrations with interactive notes, and the rest of the journey uses typography, GSAP motion, a Three.js starfield, and a blooming 3D rose. No uploads, personal photographs, or external image assets are required.

## Sections

00. Invitation — opening hero and first reveal
01. Her Universe — interactive 3D particles and name reveal
02. Before Everything — GSAP pinned scroll-through typography (desktop)
03. The Little Things — editorial appreciation cards
04. A Garden of Feelings — original illustrated flowers and tap-to-open love notes
05. A Letter From My Heart — a personal letter
06. One Last Surprise — interactive 3D rose blooming and birthday wishes

## Implementation notes

- `app/` uses the Next.js App Router, with page metadata and an icon.
- `components/CelestialCanvas.jsx` and `components/BloomFlower.jsx` are loaded on the client only and degrade gracefully without WebGL.
- `components/Experience.jsx` sets up ScrollTrigger and Lenis, and cleans both up on unmount.
- `prefers-reduced-motion` disables continuous 3D motion and long scrolling animation.
- No third-party tracking, accounts, backend, uploaded data, or personal photos are included or required.
- Google Fonts are loaded from a CSS import; local serif and sans-serif fallbacks are provided when they cannot load.
- Built-in music is **not** supplied; add only a licensed or self-owned track if you choose to include audio later.

## One last thing

The writing is deliberately heartfelt rather than generic. Before publishing publicly, read every line out loud and replace anything that isn't how you would actually speak to your Umma.

## Pushing to `main`

This birthday site was originally developed on `shahanas-birthday`. The repository's default `main` branch previously hosted a Python/Flask greeting application (`app.py`, `Procfile`, `requirements.txt`, `static/`, and `templates/`). Those original files are preserved; the root `package.json` and `app/` directory now define the Next.js entry point for Vercel. Set the Vercel framework preset to **Next.js** with root directory `./`.
