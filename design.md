# Astroj Chat — Design System

## Brand
- Product: **Astroj Chat** (mark from the JASTRO logo — orange diamond with four-point star)
- Voice: trusted, warm, Indian, premium-but-accessible. Hindi touches allowed sparingly.

## Color
| Token | Hex | Use |
|---|---|---|
| `--saffron` | #F97A00 | Brand primary (logo orange), CTAs, accents |
| `--saffron-deep` | #D96200 | Hover/pressed |
| `--ink` | #17120E | Primary text, dark sections, footer |
| `--cocoa` | #2A1E16 | Hero dark surface |
| `--ivory` | #FBF6EE | Page background |
| `--sand` | #F2E7D6 | Cards, alt section bg |
| `--gold` | #E9B65C | Stars, small highlights on dark |
| `--muted` | #6E6258 | Secondary text |

Dominant: ivory + ink. Saffron is the single sharp accent. Never purple.

## Typography
- Display: **Fraunces** (600–700, optical sizing, italic for emphasis words)
- Body/UI: **Poppins** (400/500/600)
- Scale: h1 clamp(2.6rem, 6vw, 5.2rem), h2 clamp(2rem, 4vw, 3.2rem), body 1rem/1.65

## Layout
- Max width 1240px, gutters 20px mobile / 32px desktop
- Sections 96px vertical (64px mobile)
- Hero: dark cocoa, split — headline left, portrait right with overlapping floating chips
- Grid-breaking: overlapping CTA tiles straddle hero bottom edge

## Components
- Buttons: pill, saffron fill / ink outline; 48px height
- Astrologer card: sand surface, square portrait, rating, langs, ₹/min, Chat + Call
- Category tiles: icon + label, hover lifts and fills saffron
- Diamond motif (rotated square) reused as bullet/ornament, echoing logo

## Motion
- Page load: staggered fade-up on hero elements (CSS keyframes, 80ms steps)
- Hover: 2–4px lift, 200ms ease
