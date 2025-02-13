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
		perPage: settings.type === 'fade' ? 1 : settings.slidesPerPage.desktop,
		autoplay: settings.autoplay,
		pauseOnHover: settings.autoplay,
		interval: settings.interval + settings.speed,
		easing: settings.easing,
		gap: '1.5rem',
		breakpoints: {
			1024: {
				perPage: settings.slidesPerPage.tablet,
			},
			768: {
				perPage: settings.slidesPerPage.mobile,
			},
		},
	};

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

	blockEl
		.querySelectorAll( '.hm-carousel-slide' )
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

	const thumbnailSplideConfig = {
		rewind: true,
		pagination: false,
		isNavigation: true,
		arrows: false,
		perPage: settings.thumbnailCount.desktop,
		gap: '1.5rem',
		breakpoints: {
			1024: {
				perPage: settings.thumbnailCount.tablet,
			},
			768: {
				perPage: settings.thumbnailCount.mobile,
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
	};

	const carousel = setupCarousel( blockEl, settings );

	if ( settings.hasThumbnailPagination ) {
		const thumbnailCarousel = setupThumbnailCarousel( blockEl, settings );
		carousel.sync( thumbnailCarousel );
		carousel.mount();
		thumbnailCarousel.mount();
	} else {
		carousel.mount();
	}

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
