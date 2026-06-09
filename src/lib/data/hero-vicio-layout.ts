/**
 * Layout Panel 1 @ 1920×1080.
 */
export const HERO_CANVAS = { w: 1920, h: 1080, bg: "#F1EFE8" } as const;

export const HERO_LAYOUT_PX = {
  meta: { left: 798, top: 54, fontSize: 7, tracking: "0.36em" },

  title: {
    left: 798,
    top: 72,
    fontSize: 198,
    lineHeight: 0.74,
    letterSpacing: "-0.022em",
    zIndex: 24,
  },

  collection: {
    left: 98,
    top: 578,
    fontSize: 160,
    lineHeight: 0.86,
    letterSpacing: "-0.046em",
    zIndex: 8,
  },

  burger: {
    left: 42,
    top: 84,
    width: 756,
    /** Solo altura — sin ensanchar */
    heightScale: 1.08,
    zIndex: 28,
  },

  menuLink: { left: 98, top: 718, fontSize: 12.5 },
  menuLine: { left: 98, top: 748, fontSize: 10.5, maxWidth: 960, tracking: "0.18em" },
  handle: { left: 798, top: 218, fontSize: 7 },

  stickers: [] as const,
} as const;
