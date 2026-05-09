// Theme definitions for sub-shops within Hillside Walk.
// Each theme is a self-contained look so the same component shells can re-skin.

export const subShopThemes = {
  sushi: {
    name: 'Kazu Sushi Bar',
    tagline: 'Hand-rolled. Hillside-fresh.',
    bg: 'bg-sushi-paper',
    bgGradient: 'bg-gradient-to-br from-sushi-paper via-white to-sushi-paper',
    text: 'text-sushi-ink',
    accent: 'text-sushi-vermillion',
    accentBg: 'bg-sushi-vermillion',
    accentBorder: 'border-sushi-vermillion',
    button:
      'bg-sushi-ink text-sushi-paper hover:bg-sushi-vermillion transition-colors',
    chip: 'bg-sushi-ink/5 text-sushi-ink border border-sushi-ink/10',
    cardBg: 'bg-white',
    fontDisplay: 'font-sushi_serif',
    fontBody: 'font-sushi_sans',
    decorClass: 'sushi-brush',
  },
  beauty: {
    name: 'Petal & Polish',
    tagline: 'Beauty rituals, reimagined.',
    bg: 'bg-beauty-cream',
    bgGradient: 'bg-gradient-to-br from-beauty-pearl via-beauty-blush to-beauty-rose/40',
    text: 'text-beauty-plum',
    accent: 'text-beauty-gold',
    accentBg: 'bg-beauty-gold',
    accentBorder: 'border-beauty-gold',
    button:
      'bg-beauty-plum text-beauty-pearl hover:bg-beauty-gold transition-colors',
    chip: 'bg-beauty-rose/40 text-beauty-plum border border-beauty-gold/30',
    cardBg: 'bg-white',
    fontDisplay: 'font-beauty_display italic',
    fontBody: 'font-beauty_sans',
    decorClass: 'beauty-iridescent',
  },
  bakery: {
    name: 'Sugar Hill Bakery',
    tagline: 'Sweet things made by hand.',
    bg: 'bg-bakery-buttercream',
    bgGradient:
      'bg-gradient-to-br from-bakery-buttercream via-bakery-vanilla to-bakery-frosting',
    text: 'text-bakery-chocolate',
    accent: 'text-bakery-strawberry',
    accentBg: 'bg-bakery-strawberry',
    accentBorder: 'border-bakery-strawberry',
    button:
      'bg-bakery-chocolate text-bakery-buttercream hover:bg-bakery-strawberry transition-colors',
    chip: 'bg-bakery-mint/40 text-bakery-chocolate border border-bakery-chocolate/10',
    cardBg: 'bg-white',
    fontDisplay: 'font-bakery_display',
    fontBody: 'font-bakery_sans',
    decorClass: 'bakery-sprinkles',
  },
}

export const getSubShopTheme = (code) => subShopThemes[code] || subShopThemes.sushi
