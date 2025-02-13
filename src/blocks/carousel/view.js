import './view.css';

// Loaded globally to allow for re-use by other comnponents.
const Splide = window.Splide;

const BLOCK_STYLES =  [ 'timeline' ];

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
	// Setup splide structure.
	blockEl.classList.add( 'splide' );

	const listEl = blockEl.querySelector(
		'.hm-carousel__content'
	);
	listEl.classList.add( 'splide__list' );

	const trackEl = document.createElement( 'div' );
	trackEl.classList.add( 'splide__track' );

	// Wrap the target element with the container element
	blockEl.appendChild( trackEl );
	trackEl.appendChild( listEl );

	const slides = blockEl.querySelectorAll(
		'.hm-carousel-slide'
	);
	slides.forEach( ( slide ) => slide.classList.add( 'splide__slide' ) );

	setupNav( blockEl, settings );

	const splideConfig = {
		type: settings.type,
		speed: settings.speed,
		pagination: settings.hasPagination,
		arrows: settings.hasNavButtons,
		rewind: false,
		perPage: settings.type === 'fade' ? 1 : settings.perPage,
		autoplay: settings.autoplay,
		pauseOnHover: settings.autoplay,
		interval: settings.interval + settings.speed,
		easing: settings.easing,
	};

	if ( settings.perPage > 1 && settings.moveSlidesIndividually ) {
		splideConfig.perMove = settings.moveSlidesIndividually ? 1 : settings.perPage;
		splideConfig.focus = settings.moveSlidesIndividually ? 0 : 1;
	}

	return new Splide( blockEl, splideConfig );
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
		// hasTabNav: blockEl.dataset.hasTabNav === 'true',
		hasPagination: blockEl.dataset.hasPagination === 'true',
		hasNavButtons: blockEl.dataset.hasNavButtons === 'true',
		perPage: parseInt(blockEl.dataset.perPage, 10) || 1,
		autoplay: blockEl.dataset.autoplay === 'true',
		interval: blockEl.dataset.interval !== undefined ? parseInt(blockEl.dataset.interval, 10) : 3000,
		easing: blockEl.dataset.easing || 'ease',
		moveSlidesIndividually: blockEl.dataset.moveSlidesIndividually === 'true',
	};

	const carousel = setupCarousel( blockEl, settings );
	carousel.mount();
}

/**
 * Kick it all off.
 */
function bootstrap() {
	document
		.querySelectorAll( '.hm-carousel' )
		.forEach( ( el ) => initCarouselBlock( el ) );
}

if ( document.readyState !== 'loading' ) {
	bootstrap();
} else {
	document.addEventListener( 'DOMContentLoaded', bootstrap );
}
