# Scroll-Driven Hero Section Animation — Itzfizz

A responsive hero experience built with React, TypeScript, Tailwind CSS, and GSAP/ScrollTrigger loaded from CDN in the component. The page includes animated headline typography, three impact statistics, a custom SVG car illustration, and scroll-linked car movement, scaling, rotation, and fade-out.

## Run locally

1. Install Node.js (LTS).
2. In this folder, run:

   ```bash
   npm install
   npm run dev
   ```

3. Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Deploy free with Vercel

1. Upload this project folder to a GitHub repository (upload the contents of this folder, not the ZIP file).
2. Go to https://vercel.com and sign in with GitHub.
3. Choose **Add New → Project**, import the repository, and keep the default Vite settings.
4. Click **Deploy**. Vercel will provide a public website URL.

## Notes

- The original uploaded car animation is preserved in `src/App.tsx`.
- GSAP and ScrollTrigger are loaded by the component from cdnjs, so an internet connection is needed for the animation scripts.
- Do not upload `node_modules` or the generated `dist` folder.
