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

All names, messages, memory captions, and the heartfelt letter live in [`lib/content.js`](lib/content.js). Edit that file to make the words unmistakably yours.

The three memory cards currently display original symbolic flower artwork, so the site works immediately without personal photographs. If you later decide to include real photos, add images under `public/memories/` and change the card illustration markup in `components/Experience.jsx` to render your photos.

## Sections

00. Invitation — opening hero and first reveal
01. Her Universe — interactive 3D particles and name reveal
02. Before Everything — GSAP pinned scroll-through typography (desktop)
03. The Little Things — editorial appreciation cards
04. A Garden of Memories — illustrated memory gallery
05. A Letter From My Heart — a personal letter
06. One Last Surprise — interactive 3D rose blooming and birthday wishes

## Implementation notes

- `app/` uses the Next.js App Router, with page metadata and an icon.
- `components/CelestialCanvas.jsx` and `components/BloomFlower.jsx` are loaded on the client only and degrade gracefully without WebGL.
- `components/Experience.jsx` sets up ScrollTrigger and Lenis, and cleans both up on unmount.
- `prefers-reduced-motion` disables continuous 3D motion and long scrolling animation.
- No third-party tracking, accounts, backend, uploaded data, or personal photos are required.
- Google Fonts are loaded from a CSS import; local serif and sans-serif fallbacks are provided when they cannot load.
- Built-in music is **not** supplied; add only a licensed or self-owned track if you choose to include audio later.

## One last thing

The writing is deliberately heartfelt rather than generic. Before publishing publicly, read every line out loud and replace anything that isn't how you would actually speak to your Umma.
