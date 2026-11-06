# Concept preview assets

The portfolio includes three working React concept sites at `?demo=forma`, `?demo=goodthings`, and `?demo=object`. All brands, products, and project descriptions are illustrative.

The checked-in MP4s are 8-second, silent scrolling pans of browser-rendered screenshots of these interfaces, encoded at 1200 × 783 / 24 fps using macOS AVFoundation. No external stock video is used. Playback pauses offscreen, can be paused manually, and respects reduced-motion preferences.

To recreate a clip, render a desktop screenshot at 1440 × 1800, then run on macOS:

```
swift scripts/create-preview.swift /absolute/path/to/screenshot.png public/previews/forma.mp4
swift scripts/create-poster.swift /absolute/path/to/screenshot.png public/previews/forma.png
```

The second command crops the first 940 pixels for a top-of-page poster. Change the output name for the other concepts. Swift and the macOS video encoder are development-only; the website itself is a static Vite build.

Run `npm run dev` for local preview, or `npm run build` for the production bundle. Ecommerce actions are browser-local demonstration state; checkout never collects payment. The contact link is a LinkedIn name search and should be replaced with your verified profile or email before public launch.
