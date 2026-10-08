# Farmily prototype

Local React, TypeScript, and Vite recreation of the Farmily product onboarding flow.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. On a phone-sized viewport, the screen fills the display. On desktop, it appears as a centered mobile canvas. Choose a photo to begin, confirm the product details, edit or polish the story, review the listing, choose a packaging path, and continue through the product preview to the saved confirmation. The AI actions use the example states shown in Figma.

The initial screen matches the selected 402 × 875 Figma frame. Subsequent screens follow the Figma product-details, story, review, packaging, and product-page frames. Palanquin is loaded from Google Fonts when online; the layout and controls work without it using local fallbacks.
