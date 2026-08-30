import type { LyricLine } from '../types'

/* ============================================================= *
 *  Approximate, original lyrics for a handful of tracks.
 *  Tracks without an entry render a graceful "no lyrics" state.
 *  (Times are approximate cue points in seconds.)
 * ============================================================= */

export const lyrics: Record<string, LyricLine[]> = {
  't-paper1': [
    { time: 0, text: 'Paper Constellations' },
    { time: 6, text: 'We drew the sky on the ceiling' },
    { time: 13, text: 'a hundred little suns in chalk' },
    { time: 20, text: 'and called it a feeling' },
    { time: 28, text: 'You said the dark was just a canvas' },
    { time: 35, text: 'waiting on the light' },
    { time: 42, text: 'so we pinned up paper stars' },
    { time: 49, text: 'and stayed up half the night' },
    { time: 58, text: 'Hold still, hold still' },
    { time: 63, text: 'let the quiet do the talking' },
    { time: 70, text: 'we are only ever falling' },
    { time: 77, text: 'into orbit, into orbit' },
    { time: 88, text: '(instrumental)' },
    { time: 120, text: 'And if the ceiling ever caves' },
    { time: 127, text: 'we will hang the stars again' },
    { time: 134, text: 'paper constellations' },
    { time: 141, text: 'burning slow, my friend' },
  ],
  't-mid1': [
    { time: 0, text: 'Midnight Cassette' },
    { time: 5, text: 'Press play on the neon' },
    { time: 11, text: 'let the tape reel spin' },
    { time: 18, text: 'the city is a circuit' },
    { time: 24, text: 'and we are plugged in' },
    { time: 33, text: 'Headlights like comets' },
    { time: 39, text: 'on a highway of glass' },
    { time: 46, text: 'every song is a memory' },
    { time: 52, text: 'we are driving too fast' },
    { time: 62, text: 'Rewind, rewind' },
    { time: 67, text: 'play it one more time' },
    { time: 74, text: 'midnight on a cassette' },
    { time: 81, text: 'and the whole world in rhyme' },
  ],
  't-after1': [
    { time: 0, text: 'Afterglow' },
    { time: 5, text: 'When the confetti settles' },
    { time: 11, text: 'and the lights come down low' },
    { time: 18, text: 'I still feel the whole room' },
    { time: 24, text: 'in the afterglow' },
    { time: 32, text: 'Dance until the morning' },
    { time: 38, text: 'we are gold, we are chrome' },
    { time: 45, text: 'take the long way, take the long way' },
    { time: 52, text: 'take the long way home' },
  ],
  't-velvet1': [
    { time: 0, text: 'Velvet Hours' },
    { time: 6, text: 'Pour the evening slow' },
    { time: 13, text: 'let it warm the room' },
    { time: 20, text: 'there is nowhere else to be' },
    { time: 27, text: 'nothing left to prove' },
    { time: 36, text: 'These are velvet hours' },
    { time: 42, text: 'soft around the edge' },
    { time: 49, text: 'stay a little longer, love' },
    { time: 56, text: 'out here on the ledge' },
  ],
  't-glass1': [
    { time: 0, text: 'Glass Hours' },
    { time: 6, text: 'Everything is fragile in the morning' },
    { time: 13, text: 'light through a window, no warning' },
    { time: 21, text: 'hold me like a secret you are keeping' },
    { time: 29, text: 'the whole house is still sleeping' },
  ],
}
