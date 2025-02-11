import './view.css';

// Loaded globally to allow for re-use by other comnponents.
const Splide = window.Splide;

const BLOCK_STYLES =  [ 'timeline' ];

function getBlockStyle( blockElement ) {
	const styles = BLOCK_STYLES;
	const foundStyle = styles.findIndex( ( style ) =>
		blockElement.classList.contains( 'is-style-' + style )
	);
	return foundStyle >= 0 ? styles[ foundStyle ] : 'default';
}

/**
 * Functionality for the HM Carousel block.
 *
 * @param {Element} blockElement
 */
function setupCarousel( blockElement ) {
	// Setup splide structure.
	blockElement.classList.add( 'splide' );

	const listEl = blockElement.querySelector(
		'.hm-carousel__content'
	);
	listEl.classList.add( 'splide__list' );

	const trackEl = document.createElement( 'div' );
	trackEl.classList.add( 'splide__track' );

	// Wrap the target element with the container element
	blockElement.appendChild( trackEl );
	trackEl.appendChild( listEl );

	const slides = blockElement.querySelectorAll(
		'.hm-carousel-slide'
	);
	slides.forEach( ( slide ) => slide.classList.add( 'splide__slide' ) );

	const config = {
		type: 'fade',
		speed: 800,
		pagination: false,
		arrows: false,
		rewind: false,
	};

	return new Splide( blockElement, config );
}

/*
 * Setup secondary thumbnail carousel.
 *
 * Must do this after mounted.
 *
 * @param {Element} blockElement
 */
function setupThumbnailCarousel( blockElement ) {
	const thumbnailEl = document.createElement( 'div' );
	thumbnailEl.classList.add( 'hm-carousel__nav', 'splide' );

	const thumbnailTrack = document.createElement( 'div' );
	thumbnailTrack.classList.add( 'splide__track' );
	thumbnailEl.appendChild( thumbnailTrack );

	const thumbnailList = document.createElement( 'div' );
	thumbnailList.classList.add( 'splide__list' );
	thumbnailTrack.appendChild( thumbnailList );

	blockElement
		.querySelectorAll( '.hm-carousel-slide' )
		.forEach( ( slideEl ) => {
			const slideTitle = slideEl.dataset.title;
			const btnEl = document.createElement( 'button' );
			thumbnailList.appendChild( btnEl );

			// Container span for styling.
			const spanEl = document.createElement( 'span' );
			spanEl.classList.add( 'hm-carousel__nav-button-text' );
			spanEl.appendChild( document.createTextNode( slideTitle ) );

			btnEl.appendChild( spanEl );
			btnEl.classList.add(
				'splide__slide',
				'hm-carousel__nav-button'
			);

			// Thumbnail image.
			if ( slideEl.dataset.thumbnailImageSrc ) {
				const imgEl = document.createElement( 'img' );
				imgEl.classList.add( 'hm-carousel__nav-button-img' );
				imgEl.setAttribute( 'src', slideEl.dataset.thumbnailImageSrc );
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

	blockElement.appendChild( thumbnailEl );

	const style = getBlockStyle( blockElement );

	const defaultConfig = {
		isNavigation: true,
		rewind: false,
		pagination: false,
	};

	const config = {
		timeline: {
			perPage: 8,
			breakpoints: {
				1024: {
					perPage: 6,
				},
				782: {
					perPage: 5,
				},
				512: {
					perPage: 4,
				},
			},
		},
		default: {
			perPage: 5,
			gap: '1.5rem',
			breakpoints: {
				1024: {
					perPage: 4,
				},
				782: {
					perPage: 3,
				},
				512: {
					perPage: 2,
				},
			},
		},
	};

	const thumbnailSplide = new Splide( thumbnailEl, {
		...defaultConfig,
		...config[ style ],
	} );

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

/**
 * carousel block.
 *
 * Ensure initial state is correct.
 *
 * @param {HTMLElement} blockElement Carousel block.
 */
function initCarouselBlock( blockElement ) {
	const carousel = setupCarousel( blockElement );
	const thumbnailCarousel = setupThumbnailCarousel( blockElement );

	carousel.sync( thumbnailCarousel );
	carousel.mount();
	thumbnailCarousel.mount();
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
