# Changelog

## v1.2.0

- Add `autoScroll` and `autoScrollSpeed` block attributes, backed by [Splide's AutoScroll extension](https://splidejs.com/extensions/auto-scroll/). When enabled, the carousel scrolls continuously at a constant pixels-per-frame speed, pauses on hover/focus, and forces `type: 'loop'`. Intended for non-interactive surfaces such as logo strips and press tickers; autoplay, arrows, and pagination are disabled while auto-scroll is on.

## v1.1.4

- Add `fixedWidth` and `padding` block attributes that are passed through to Splide. Enables full-bleed carousel layouts where each slide has a consistent width and the first slide is inset from the container edge by a configurable amount.

## v1.1.3

- Fix issue where global `Splide` object reference fails when using WordPress VIP script concatenation [#17](https://github.com/humanmade/hm-carousel-block/pull/17)

## v1.1.2

- Fix issue where splide.js was not present in released build bundle [#14](https://github.com/humanmade/hm-carousel-block/pull/14)

## v1.1.1

- Fix build error due to outdated package-lock.json [#12](https://github.com/humanmade/hm-carousel-block/pull/12)

## v1.1.0

- Add support for visually positioning arrows at vertical midpoint or on any given corner of the slideshow container element [#7](https://github.com/humanmade/hm-carousel-block/pull/7)
- Fix bug where carousel did not properly initialize due to script execution order [#6](https://github.com/humanmade/hm-carousel-block/pull/6) / [#9](https://github.com/humanmade/hm-carousel-block/pull/9)
- Introduce helper scripts to set up lightweight test environment for local development [#8](https://github.com/humanmade/hm-carousel-block/pull/8)

## v1.0.0

- Initial release: Implement Carousel and Carousel Slide blocks for building [Splide](https://splidejs.com/)-based carousels natively within the block editor
