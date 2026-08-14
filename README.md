# Swara Sadhana

A Carnatic vocal practice companion that runs entirely in your browser. Sing into the
microphone and it shows you where your voice actually landed against the swara you meant
to sing, keeps your daily practice honest, and walks the traditional ladder from your
first sustained Sa to the keerthanas.

**Practice here → https://manojworkspace98.github.io/swara-sadhana/**

Install it from the browser menu ("Add to Home Screen" / "Install") to practise offline
and full-screen on a phone or tablet.

## What it does

- **Listens while you sing.** Live pitch detection maps your voice onto the swara ladder
  relative to your chosen sruti, with a cents readout and gamaka-tolerant scoring that
  does not punish you for oscillating around a note the way the music asks you to.
- **Keeps tala.** A metronome with the sapta talas, beat-aligned lesson timelines, and
  rhythm scoring against where each swara was supposed to land.
- **Plays the reference.** Tanpura drone and swara playback are synthesised in the
  browser from the notation itself. No recordings are used or needed.
- **Tracks the sadhana.** Streaks, a practice calendar, mastery stars per lesson, vocal
  range as it opens up, and a library of your takes so you can hear last month against
  today.
- **Teaches in three scripts.** Every lyric line is available in Latin transliteration,
  Telugu, and Devanagari.

## The curriculum

Sruti and breath basics → sarali varisai → janta, dhatu and sthayi varisai → alankaras in
the seven talas → geetams → swarajati → varnam → starter keerthanas → the long pieces
(*Bhavamulona*, *Ananda Narthana Ganapatim*, *Kalinga Narthana Thillana*), each broken
into sections you can work one at a time.

## Running it locally

```bash
npm install
npm run dev
```

Microphone access needs a secure context; `localhost` counts, so local development works
without any extra setup.

```bash
npm run test    # unit tests for the pitch, tala, scoring and content logic
npm run build   # production build
```

## Notes on the music and the art

The compositions taught here are the work of Purandara Dasa, Annamacharya, Tyagaraja,
Muthuswami Dikshitar, Oothukkadu Venkata Kavi, Patnam Subramania Iyer and Poochi
Srinivasa Iyengar, all of whom died well before 1930; the compositions are in the public
domain. Notation for a kriti varies between schools, so each piece names the patantara it
was encoded from. All audio in the app is synthesised from that notation — no commercial
recording is bundled or streamed.

Devotional artwork used in the app is public domain and attributed in
[`public/art/CREDITS.md`](public/art/CREDITS.md).

## Licence

MIT — see [LICENSE](LICENSE).
