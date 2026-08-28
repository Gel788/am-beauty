# AM Beauty — Design System

## Archetype
Luxury skincare e-commerce · editorial apothecary · low density

## Palette
| Token | Value | Role |
|-------|-------|------|
| Stone | `#F5F1EB` | Background |
| Espresso | `#1C1917` | Text, footer |
| Copper | `#9C7355` | Primary accent |
| Warm gray | `#6B5D50` | Muted text |

## Typography
- **Display:** Cormorant Garamond — editorial serif, italic emphasis
- **Body:** DM Sans — clean utility

## Layout
- Split hero: text left, product visual right
- Asymmetric product grid (staggered columns)
- Hairline dividers, zero border-radius buttons
- No gradient hero overlays

## Motion
- motion.dev reveal on scroll (`Reveal` component)
- `prefers-reduced-motion` respected
- Lenis smooth scroll

## Anti-patterns (avoid)
- Wine/burgundy + Playfair template
- Unsplash remote images (blocked in env)
- CSS blob bottles, canvas scroll
- Generic shadcn card grid

## Assets
Local SVG product photography in `/public/products/`
