# Changelog

## v1.3.0

- Add `direction` attribute, which can be used to specify vertical ("ttb") instead of horizontal ("ltr" and "rtl).
- Add "height" and "fixedHeight" attributes for aid in styling.

## v1.2.0

- Add `autoScroll` and `autoScrollSpeed` block attributes, backed by [Splide's AutoScroll extension](https://splidejs.com/extensions/auto-scroll/). When enabled, the carousel scrolls continuously at a constant pixels-per-frame speed, pauses on hover/focus, and forces `type: 'loop'`. Intended for non-interactive surfaces such as logo strips and press tickers; autoplay, arrows, and pagination are disabled while auto-scroll is on. `autoWidth` is forced on when `autoScroll` is enabled (unless `fixedWidth` is set) so slides size to their content; without this, AutoScroll stretches each slide to a perPage-based width and the marquee shows one giant slide at a time.
- Add `gap` block attribute (string, default `'1.5rem'`) controlling the CSS length between slides. Splide reads this value to compute slide positions; overriding the gap with theme CSS alone causes loop-math drift on every cycle.

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
