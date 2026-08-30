# /public/audio/

Real audio files go here when you want to switch from the synth engine to HTML5 Audio.

## How to upgrade

1. Add `.mp3` (or `.ogg`) files with filenames matching `audioUrl` values in `src/data/tracks.ts`.
2. Example: `t-paper1.mp3` → set the track's `audioUrl: '/audio/t-paper1.mp3'`.
3. The `AudioEngine` detects the file and plays via `<audio>` automatically.

## Demo / royalty-free sources

- [Free Music Archive](https://freemusicarchive.org)
- [ccMixter](https://ccmixter.org)
- [Incompetech](https://incompetech.com)
- [Pixabay music](https://pixabay.com/music/)

All real tracks must be royalty-free or you must hold the license.

## Current state

No external audio files are required — playback works fully via the procedural Web Audio synth.
