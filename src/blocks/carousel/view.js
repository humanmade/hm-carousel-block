import './view.css';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

// Loaded globally to allow for re-use by other components.
let Splide = null;

const BLOCK_STYLES =  [ 'timeline' ];
const DEFAULT_DIRECTION = {
	desktop: 'ltr',
	tablet: 'ltr',
	mobile: 'ltr',
};
const DEFAULT_RESPONSIVE_LENGTH = {
	desktop: '',
	tablet: '',
	mobile: '',
};
const DEFAULT_PADDING = {
	left: '',
	right: '',
	top: '',
	bottom: '',
};
const BREAKPOINTS = {
	tablet: 1024,
	mobile: 768,
};

function parseJsonDataAttribute( value, fallback ) {
	if ( ! value ) {
		return fallback;
	}

	try {
		return JSON.parse( value );
	} catch ( error ) {
		return fallback;
	}
}

function normalizeResponsiveSetting( value, fallback ) {
	if ( typeof value === 'string' ) {
		return {
			...fallback,
			desktop: value,
			tablet: value,
			mobile: value,
		};
	}

	return {
		...fallback,
		...( value || {} ),
	};
}

function getResponsiveValue( setting, breakpoint, fallback = '' ) {
	return setting?.[ breakpoint ] ?? fallback;
}

function addResponsiveLength( config, option, values, breakpoint ) {
	const desktopValue = getResponsiveValue( values, 'desktop' );
	const value = getResponsiveValue( values, breakpoint );

	if ( value || ( breakpoint !== 'desktop' && desktopValue ) ) {
		config[ option ] = value;
	}
}

function getTrackPadding( padding, direction ) {
	const paddingConfig = {};
	const axis = direction === 'ttb' ? [ 'top', 'bottom' ] : [ 'left', 'right' ];

	axis.forEach( ( side ) => {
		if ( padding?.[ side ] ) {
			paddingConfig[ side ] = padding[ side ];
		}
	} );

	return Object.keys( paddingConfig ).length ? paddingConfig : null;
}

function getBlockStyle( blockEl ) {
	const styles = BLOCK_STYLES;
	const foundStyle = styles.findIndex( ( style ) =>
		blockEl.classList.contains( 'is-style-' + style )
	);
	return foundStyle >= 0 ? styles[ foundStyle ] : 'default';
}

/**
 * Functionality for the HM Carousel block.
 *
 * @param {Element} blockEl
 */
function setupCarousel( blockEl, settings ) {
	const carouselContentEl = blockEl.querySelector('.hm-carousel__content');
	const postTemplateEl = blockEl.querySelector('.wp-block-post-template');
	const isQueryLoop = !!postTemplateEl;

	       let targetList;
	       let trackEl = blockEl.querySelector('.splide__track');
	       if (!trackEl) {
		       trackEl = document.createElement('div');
		       trackEl.classList.add('splide__track');
		       blockEl.appendChild(trackEl);
	       }

	       if (isQueryLoop) {
		       // Only move postTemplateEl if not already inside trackEl
		       if (postTemplateEl.parentElement !== trackEl) {
			       trackEl.appendChild(postTemplateEl);
		       }
		       postTemplateEl.classList.add('splide__list');
		       targetList = postTemplateEl;
	       } else {
		       if (carouselContentEl.parentElement !== trackEl) {
			       trackEl.appendChild(carouselContentEl);
		       }
		       carouselContentEl.classList.add('splide__list');
		       targetList = carouselContentEl;
	       }

	// Don't initialize carousel if target list doesn't exist or has less than 2 slides
	if (!targetList || targetList.childElementCount < 2) {
		return null;
	}

	blockEl.classList.add('splide');

	let slides;
	if (isQueryLoop) {
		Array.from(targetList.children).forEach((child) => {
			if (child.nodeType === 1) {
				child.classList.add('splide__slide');
			}
		});
		slides = targetList.querySelectorAll('.splide__slide');
	} else {
		slides = targetList.querySelectorAll('.hm-carousel-slide');
		slides.forEach((slide) => slide.classList.add('splide__slide'));
	}

	setupNav( blockEl, settings );

	// Detects columns for Query Loop and uses that as the perPage value, otherwise defaults to slidesPerPage setting or 1 for fade type.
	let columns = null;
	if (isQueryLoop && postTemplateEl) {
		const match = Array.from(postTemplateEl.classList).find(cls => cls.startsWith('columns-'));
		if (match) {
			columns = parseInt(match.replace('columns-', ''), 10);
		}
	}

	const splideConfig = {
		type: settings.type,
		speed: settings.speed,
		pagination: settings.hasPagination,
		arrows: settings.hasNavButtons,
		rewind: false,
		direction: getResponsiveValue( settings.direction, 'desktop', 'ltr' ),
		perPage: columns || (settings.type === 'fade' ? 1 : settings.slidesPerPage.desktop),
		autoplay: settings.autoplay,
		pauseOnHover: settings.autoplay,
		interval: settings.interval + settings.speed,
		easing: settings.easing,
		gap: settings.gap,
		breakpoints: {
			[ BREAKPOINTS.tablet ]: {
				direction: getResponsiveValue( settings.direction, 'tablet', getResponsiveValue( settings.direction, 'desktop', 'ltr' ) ),
				perPage: columns || settings.slidesPerPage.tablet,
			},
			[ BREAKPOINTS.mobile ]: {
				direction: getResponsiveValue( settings.direction, 'mobile', getResponsiveValue( settings.direction, 'tablet', getResponsiveValue( settings.direction, 'desktop', 'ltr' ) ) ),
				perPage: columns || settings.slidesPerPage.mobile,
			},
		},
	};

	addResponsiveLength( splideConfig, 'height', settings.height, 'desktop' );
	addResponsiveLength( splideConfig, 'fixedHeight', settings.fixedHeight, 'desktop' );
	Object.entries( BREAKPOINTS ).forEach( ( [ breakpoint, width ] ) => {
		addResponsiveLength( splideConfig.breakpoints[ width ], 'height', settings.height, breakpoint );
		addResponsiveLength( splideConfig.breakpoints[ width ], 'fixedHeight', settings.fixedHeight, breakpoint );
	} );

	// Auto-scroll: continuous linear scroll via Splide's AutoScroll extension.
	// Requires type:'loop' and is incompatible with autoplay/pagination/arrows.
	// autoWidth lets each slide size to its content; this is the marquee
	// behavior AutoScroll expects, and avoids slides being stretched to a
	// perPage-based width. Themes that need uniform slide widths can still
	// set fixedWidth, which takes precedence over autoWidth in Splide.
	if ( settings.autoScroll ) {
		splideConfig.type = 'loop';
		splideConfig.autoplay = false;
		splideConfig.arrows = false;
		splideConfig.pagination = false;
		splideConfig.drag = 'free';
		splideConfig.focus = 'center';
		splideConfig.autoWidth = ! settings.fixedWidth;
		splideConfig.autoScroll = {
			speed: settings.autoScrollSpeed,
			pauseOnHover: true,
			pauseOnFocus: true,
			rewind: false,
		};
	}

	// Force disable pagination if thumbnail carousel is enabled.
	if ( settings.hasThumbnailPagination ) {
		splideConfig.pagination = false;
		splideConfig.arrows = false;
	}

	// Should navigation move single slides or a page of slides.
	if ( settings.moveSlidesIndividually ) {
		splideConfig.perMove = 1;
		splideConfig.focus = 0;
	}

	// Fixed slide width — overrides perPage-based sizing. Useful for layouts
	// that need consistent slide widths regardless of viewport.
	if ( settings.fixedWidth ) {
		splideConfig.fixedWidth = settings.fixedWidth;
	}

	// Track padding — inset slides from the edges of the carousel container.
	// Horizontal tracks use left/right and vertical tracks use top/bottom.
	if ( settings.padding ) {
		const desktopPadding = getTrackPadding( settings.padding, splideConfig.direction );
		if ( desktopPadding ) {
			splideConfig.padding = desktopPadding;
		}
		Object.values( BREAKPOINTS ).forEach( ( width ) => {
			const breakpointPadding = getTrackPadding(
				settings.padding,
				splideConfig.breakpoints[ width ].direction
			);

			if ( breakpointPadding ) {
				splideConfig.breakpoints[ width ].padding = breakpointPadding;
			}
		} );
	}

	return new Splide( blockEl, splideConfig );
}

/*
 * Setup secondary thumbnail carousel.
 *
 * Must do this after mounted.
 *
 * @param {Element} blockEl
 */
function setupThumbnailCarousel( blockEl, settings ) {
	const navEl = blockEl.querySelector( '.hm-carousel__nav' );

	const thumbnailEl = document.createElement( 'div' );
	thumbnailEl.classList.add( 'hm-carousel__thumbnails', 'splide' );

	const thumbnailTrack = document.createElement( 'div' );
	thumbnailTrack.classList.add( 'splide__track' );
	thumbnailEl.appendChild( thumbnailTrack );

	const thumbnailList = document.createElement( 'ul' );
	thumbnailList.classList.add( 'splide__list' );
	thumbnailTrack.appendChild( thumbnailList );

	// Support both carousel slides and Query Loop posts.
	const isQueryLoop = !! blockEl.querySelector( '.wp-block-post-template' );
	const slideSelector = isQueryLoop ? '.wp-block-post' : '.hm-carousel-slide';

	blockEl
		.querySelectorAll( slideSelector )
		.forEach( ( slideEl, i ) => {
			const slideTitle = slideEl.dataset.title || 'Slide ' + ( i + 1 );

			const thumbnailSlideEl = document.createElement( 'li' );
			thumbnailSlideEl.classList.add( 'splide__slide' );
			thumbnailList.appendChild( thumbnailSlideEl );

			const btnEl = document.createElement( 'button' );
			btnEl.classList.add( 'hm-carousel__thumbnails-button' );
			thumbnailSlideEl.appendChild( btnEl );

			// Container span for styling.
			const spanEl = document.createElement( 'span' );
			spanEl.classList.add( 'hm-carousel__thumbnails-button-text' );
			spanEl.appendChild( document.createTextNode( slideTitle ) );

			btnEl.appendChild( spanEl );

			// Thumbnail image.
			if ( slideEl.dataset.thumbnailImageSrc ) {
				const imgEl = document.createElement( 'img' );
				imgEl.classList.add( 'hm-carousel__thumbnails-button-img' );
				imgEl.setAttribute( 'src', slideEl.dataset.thumbnailImageSrc );
				imgEl.setAttribute( 'alt', slideTitle );
				imgEl.setAttribute( 'loading', 'lazy' );
				btnEl.appendChild( imgEl );
			}
		} );

	// Create arrow container
	const arrowsEl = document.createElement( 'div' );
	arrowsEl.classList.add( 'splide__arrows' );

	// Create previous/next buttons.
	const prevBtnEl = document.createElement( 'button' );
	prevBtnEl.appendChild( document.createTextNode( 'Previous Slide' ) );
	prevBtnEl.classList.add( 'splide__arrow', 'splide__arrow--prev' );

	const nextBtnEl = document.createElement( 'button' );
	nextBtnEl.appendChild( document.createTextNode( 'Next Slide' ) );
	nextBtnEl.classList.add( 'splide__arrow', 'splide__arrow--next' );

	// Add arrow elements to page.
	arrowsEl.appendChild( prevBtnEl );
	arrowsEl.appendChild( nextBtnEl );
	thumbnailEl.appendChild( arrowsEl );

	// Add to nav.
	navEl.appendChild( thumbnailEl );

	const slideCount = blockEl.querySelectorAll( slideSelector ).length;

	const thumbnailSplideConfig = {
		rewind: true,
		pagination: slideCount > settings.thumbnailCount.desktop && settings.thumbnailNavType === 'pagination',
		arrows: slideCount > settings.thumbnailCount.desktop && settings.thumbnailNavType === 'buttons',
		isNavigation: true,
		perPage: settings.thumbnailCount.desktop,
		gap: '1.5rem',
		breakpoints: {
			1024: {
				perPage: settings.thumbnailCount.tablet,
				pagination: slideCount > settings.thumbnailCount.tablet && settings.thumbnailNavType === 'pagination',
				arrows: slideCount > settings.thumbnailCount.tablet && settings.thumbnailNavType === 'buttons',
			},
			768: {
				perPage: settings.thumbnailCount.mobile,
				pagination: slideCount > settings.thumbnailCount.tablet && settings.thumbnailNavType === 'pagination',
				arrows: slideCount > settings.thumbnailCount.tablet && settings.thumbnailNavType === 'buttons',
			},
		},
	};

	const thumbnailSplide = new Splide( thumbnailEl, thumbnailSplideConfig );

	thumbnailSplide.on( 'mounted', () => {
		const slides = thumbnailSplide.Components.Elements.slides;

		slides.forEach( ( slide ) => {
			slide.setAttribute(
				'aria-label',
				slide.textContent + ': ' + slide.getAttribute( 'aria-label' )
			);
		} );
	} );

	return thumbnailSplide;
}

function createNavButtons() {
	// Create arrow container
	const arrowsEl = document.createElement( 'div' );
	arrowsEl.classList.add( 'splide__arrows' );

	// Create previous/next buttons.
	const prevBtnEl = document.createElement( 'button' );
	prevBtnEl.appendChild( document.createTextNode( 'Previous Slide' ) );
	prevBtnEl.classList.add( 'splide__arrow', 'splide__arrow--prev' );

	const nextBtnEl = document.createElement( 'button' );
	nextBtnEl.appendChild( document.createTextNode( 'Next Slide' ) );
	nextBtnEl.classList.add( 'splide__arrow', 'splide__arrow--next' );

	// Add arrow elements to page.
	arrowsEl.appendChild( prevBtnEl );
	arrowsEl.appendChild( nextBtnEl );

	return arrowsEl;
}

/*
 * Setup secondary thumbnail carousel.
 *
 * Must do this after mounted.
 *
 * @param {Element} blockEl
 */
function setupNav( blockEl, settings ) {
	const navEl = document.createElement( 'div' );
	navEl.classList.add( 'hm-carousel__nav' );
	blockEl.appendChild( navEl );

	if ( settings.hasNavButtons ) {
		const arrowsEl = createNavButtons();
		navEl.appendChild( arrowsEl );
	}

	if ( settings.hasPagination ) {
		const paginationEl = document.createElement( 'ul' );
		paginationEl.classList.add( 'splide__pagination' );
		navEl.appendChild( paginationEl );
	}

	return navEl;
}

/**
 * carousel block.
 *
 * Ensure initial state is correct.
 *
 * @param {HTMLElement} blockEl Carousel block.
 */
function initCarouselBlock( blockEl ) {
	const settings = {
		speed: parseInt(blockEl.dataset.speed, 10) || 800,
		type: blockEl.dataset.type || 'slide',
		hasPagination: blockEl.dataset.hasPagination === 'true',
		hasNavButtons: blockEl.dataset.hasNavButtons === 'true',
		autoplay: blockEl.dataset.autoplay === 'true',
		interval: blockEl.dataset.interval !== undefined ? parseInt(blockEl.dataset.interval, 10) : 3000,
		easing: blockEl.dataset.easing || 'ease',
		moveSlidesIndividually: blockEl.dataset.moveSlidesIndividually === 'true',
		hasThumbnailPagination: blockEl.dataset.hasPagination === 'true' && blockEl.dataset.hasThumbnailPagination === 'true',
		thumbnailCount: JSON.parse(blockEl.dataset.thumbnailCount),
		slidesPerPage: JSON.parse(blockEl.dataset.slidesPerPage),
		direction: normalizeResponsiveSetting(
			parseJsonDataAttribute( blockEl.dataset.direction, DEFAULT_DIRECTION ),
			DEFAULT_DIRECTION
		),
		height: normalizeResponsiveSetting(
			parseJsonDataAttribute( blockEl.dataset.height, DEFAULT_RESPONSIVE_LENGTH ),
			DEFAULT_RESPONSIVE_LENGTH
		),
		fixedHeight: normalizeResponsiveSetting(
			parseJsonDataAttribute( blockEl.dataset.fixedHeight, DEFAULT_RESPONSIVE_LENGTH ),
			DEFAULT_RESPONSIVE_LENGTH
		),
		thumbnailNavType: blockEl.dataset.thumbnailNavType || 'pagination',
		fixedWidth: blockEl.dataset.fixedWidth || '',
		gap: blockEl.dataset.gap || '1.5rem',
		padding: blockEl.dataset.padding ? { ...DEFAULT_PADDING, ...parseJsonDataAttribute( blockEl.dataset.padding, DEFAULT_PADDING ) } : null,
		autoScroll: blockEl.dataset.autoScroll === 'true',
		autoScrollSpeed: blockEl.dataset.autoScrollSpeed !== undefined ? parseFloat(blockEl.dataset.autoScrollSpeed) : 1,
	};

	const carousel = setupCarousel( blockEl, settings );

	// If carousel returned null (less than 2 slides), don't initialize
	if ( ! carousel ) {
		return;
	}

	const extensions = settings.autoScroll ? { AutoScroll } : undefined;

	if ( settings.hasThumbnailPagination ) {
		const thumbnailCarousel = setupThumbnailCarousel( blockEl, settings );
		carousel.sync( thumbnailCarousel );
		carousel.mount( extensions );
		thumbnailCarousel.mount();
	} else {
		carousel.mount( extensions );
	}

}

/**
 * Kick it all off.
 */
function bootstrap() {
	// Initialize our local Splide constructor reference.
	Splide = window.Splide;

	// Check if Splide is available
	if ( ! Splide ) {
		console.error( 'Splide library not loaded. Carousel cannot be initialized.' );
		return;
	}
	document
		.querySelectorAll( '.hm-carousel' )
		.forEach( ( el ) => initCarouselBlock( el ) );
}

if ( document.readyState !== 'loading' ) {
	bootstrap();
} else {
	document.addEventListener( 'DOMContentLoaded', bootstrap );
}
