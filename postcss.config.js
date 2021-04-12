module.exports = {
  "plugins": {
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {
      utf8: false
    },
    "postcss-preset-env": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore'],
      minPixelValue: 2,
      mediaQuery: false
    },
    "cssnano": {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false
    }
  }
}