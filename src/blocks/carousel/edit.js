import { InnerBlockSlider } from '@humanmade/block-editor-components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
	Notice,
	TextControl,
} from '@wordpress/components';
import TabNav from './components/tab-nav';
import {
	DEFAULT_DIRECTION,
	DEFAULT_PADDING,
	DEFAULT_RESPONSIVE_BOOLEAN,
	DEFAULT_RESPONSIVE_LENGTH,
} from './config.mjs';

const SLIDE_LIMIT = 100;
const ALLOWED_BLOCK = 'hm/carousel-slide';
const ALLOWED_BLOCKS_ARTICLES = [ 'core/query' ];

// Templates for different layout types
const CAROUSEL_TEMPLATE = [ [ 'hm/carousel-slide' ] ];
const ARTICLES_CAROUSEL_TEMPLATE = [
	[
		'core/query',
		{
			query: {
				perPage: 6,
				pages: 0,
				offset: 0,
				postType: 'post',
				order: 'desc',
				orderBy: 'date',
				author: '',
				search: '',
				exclude: [],
				sticky: '',
				inherit: false,
			},
		},
		[ [ 'core/post-template' ] ],
	],
];
const DIRECTION_OPTIONS = [
	{ label: __( 'Left to right', 'hm-carousel' ), value: 'ltr' },
	{ label: __( 'Right to left', 'hm-carousel' ), value: 'rtl' },
	{ label: __( 'Top to bottom', 'hm-carousel' ), value: 'ttb' },
];

/**
 * Provide an interface for editing the block.
 *
 * @param {Object} props Props
 * @return {Element} Formatted blocks.
 */
function Edit( props ) {
	const { clientId, attributes, setAttributes } = props;
	const {
		layout,
		hasTabNav,
		hasPagination,
		hasNavButtons,
		type,
		autoplay,
		interval,
		speed,
		easing,
		moveSlidesIndividually,
		hasThumbnailPagination,
		thumbnailCount,
		slidesPerPage,
		direction,
		height,
		fixedHeight,
		thumbnailNavType,
		arrowPosition,
		fixedWidth,
		padding,
		gap,
		autoScroll,
		autoScrollBreakpoints,
		autoScrollSpeed,
	} = attributes;

	const isArticlesCarousel = layout === 'articles-carousel';
	const carouselDirection = { ...DEFAULT_DIRECTION, ...direction };
	const carouselHeight = { ...DEFAULT_RESPONSIVE_LENGTH, ...height };
	const carouselFixedHeight = {
		...DEFAULT_RESPONSIVE_LENGTH,
		...fixedHeight,
	};
	const carouselAutoScrollBreakpoints = {
		...DEFAULT_RESPONSIVE_BOOLEAN,
		...autoScrollBreakpoints,
	};
	const trackPadding = { ...DEFAULT_PADDING, ...padding };
	const setResponsiveAttribute = (
		attributeName,
		currentValue,
		breakpoint,
		value
	) => {
		setAttributes( {
			[ attributeName ]: {
				...currentValue,
				[ breakpoint ]: value,
			},
		} );
	};

	// Determine allowed blocks and template based on layout
	const allowedBlocks = isArticlesCarousel
		? ALLOWED_BLOCKS_ARTICLES
		: ALLOWED_BLOCK;
	const template = isArticlesCarousel
		? ARTICLES_CAROUSEL_TEMPLATE
		: CAROUSEL_TEMPLATE;

	const blockProps = useBlockProps( {
		className: 'hm-carousel',
	} );

	const [ currentSlideIndex, setCurrentSlideIndex ] = useState( 0 );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Carousel Navigation Settings',
						'hm-carousel'
					) }
				>
					<ToggleControl
						label={ __( 'Enable Pagination', 'hm-carousel' ) }
						checked={ hasPagination }
						onChange={ ( value ) =>
							setAttributes( { hasPagination: value } )
						}
					/>
					{ hasPagination && (
						<ToggleControl
							label={ __( 'Thumbnail Carousel', 'hm-carousel' ) }
							checked={ hasThumbnailPagination }
							onChange={ ( value ) =>
								setAttributes( {
									hasThumbnailPagination: value,
								} )
							}
						/>
					) }
					<ToggleControl
						label={ __( 'Show Navigation Buttons', 'hm-carousel' ) }
						checked={ hasNavButtons }
						onChange={ ( value ) =>
							setAttributes( { hasNavButtons: value } )
						}
					/>
					{ hasNavButtons && (
						<SelectControl
							label={ __( 'Arrow Position', 'hm-carousel' ) }
							value={ arrowPosition || 'default' }
							options={ [
								{
									label: __( 'Default', 'hm-carousel' ),
									value: 'default',
								},
								{
									label: __( 'Top Left', 'hm-carousel' ),
									value: 'top-left',
								},
								{
									label: __( 'Top Right', 'hm-carousel' ),
									value: 'top-right',
								},
								{
									label: __( 'Bottom Left', 'hm-carousel' ),
									value: 'bottom-left',
								},
								{
									label: __( 'Bottom Right', 'hm-carousel' ),
									value: 'bottom-right',
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { arrowPosition: value } )
							}
						/>
					) }
				</PanelBody>
				<PanelBody
					title={ __( 'Carousel Animation Settings', 'hm-carousel' ) }
				>
					<SelectControl
						label={ __( 'Carousel Type', 'hm-carousel' ) }
						value={ type }
						options={ [
							{
								label: __( 'Fade', 'hm-carousel' ),
								value: 'fade',
							},
							{
								label: __( 'Loop', 'hm-carousel' ),
								value: 'loop',
							},
							{
								label: __( 'Slide', 'hm-carousel' ),
								value: 'slide',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { type: value } )
						}
					/>
					<SelectControl
						label={ __( 'Animation style', 'hm-carousel' ) }
						value={ easing }
						options={ [
							{
								label: __( 'Ease', 'hm-carousel' ),
								value: 'ease',
							},
							{
								label: __( 'Linear', 'hm-carousel' ),
								value: 'linear',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { easing: value } )
						}
					/>
					<RangeControl
						label={ __(
							'Transition Speed (seconds)',
							'hm-carousel'
						) }
						value={ speed / 1000 }
						onChange={ ( value ) =>
							setAttributes( { speed: value * 1000 } )
						}
						min={ 0 }
						max={ 3 }
						step={ 0.1 }
					/>
					<ToggleControl
						label={ __( 'Autoplay', 'hm-carousel' ) }
						checked={ autoplay }
						disabled={ autoScroll }
						help={
							autoScroll
								? __(
										'Disabled while Auto-scroll is on.',
										'hm-carousel'
								  )
								: undefined
						}
						onChange={ ( value ) =>
							setAttributes( { autoplay: value } )
						}
					/>
					{ autoplay && ! autoScroll && (
						<>
							<RangeControl
								label={ __(
									'Autoplay Interval (seconds)',
									'hm-carousel'
								) }
								value={ interval / 1000 }
								onChange={ ( value ) =>
									setAttributes( { interval: value * 1000 } )
								}
								min={ 0 }
								max={ 10 }
								step={ 0.1 }
							/>
							{ autoplay &&
								! hasPagination &&
								! hasNavButtons && (
									<Notice
										status="warning"
										isDismissible={ false }
									>
										{ __(
											'For accessibility reasons it is best not to rely on autoplay alone for changing slides, unless the carousel is just for a decorative purpose. Otherwise, the user will have no way to rotate the carousel while prefers-reduced-motion is enabled.',
											'hm-carousel'
										) }
									</Notice>
								) }
						</>
					) }
					<ToggleControl
						label={ __( 'Auto-scroll', 'hm-carousel' ) }
						checked={ autoScroll }
						help={ __(
							'Continuously scroll the slides at a constant speed. Breakpoints with Auto-scroll disabled use the configured carousel type, autoplay, arrows, and pagination.',
							'hm-carousel'
						) }
						onChange={ ( value ) =>
							setAttributes( { autoScroll: value } )
						}
					/>
					{ autoScroll && (
						<>
							<RangeControl
								label={ __(
									'Auto-scroll Speed (pixels per frame)',
									'hm-carousel'
								) }
								value={ autoScrollSpeed }
								onChange={ ( value ) =>
									setAttributes( { autoScrollSpeed: value } )
								}
								min={ 0.1 }
								max={ 5 }
								step={ 0.1 }
							/>
							<ToggleControl
								label={ __(
									'Auto-scroll on desktop',
									'hm-carousel'
								) }
								checked={
									carouselAutoScrollBreakpoints.desktop
								}
								onChange={ ( value ) =>
									setResponsiveAttribute(
										'autoScrollBreakpoints',
										carouselAutoScrollBreakpoints,
										'desktop',
										value
									)
								}
							/>
							<ToggleControl
								label={ __(
									'Auto-scroll on tablet',
									'hm-carousel'
								) }
								checked={ carouselAutoScrollBreakpoints.tablet }
								onChange={ ( value ) =>
									setResponsiveAttribute(
										'autoScrollBreakpoints',
										carouselAutoScrollBreakpoints,
										'tablet',
										value
									)
								}
							/>
							<ToggleControl
								label={ __(
									'Auto-scroll on mobile',
									'hm-carousel'
								) }
								checked={ carouselAutoScrollBreakpoints.mobile }
								onChange={ ( value ) =>
									setResponsiveAttribute(
										'autoScrollBreakpoints',
										carouselAutoScrollBreakpoints,
										'mobile',
										value
									)
								}
							/>
						</>
					) }
					<TextControl
						label={ __( 'Slide Gap', 'hm-carousel' ) }
						help={ __(
							'CSS length for the space between slides (e.g. 1.5rem, 48px). Splide reads this to position slides; setting it via CSS alone causes loop math to drift.',
							'hm-carousel'
						) }
						value={ gap }
						onChange={ ( value ) =>
							setAttributes( { gap: value } )
						}
					/>
				</PanelBody>
				{ hasPagination && hasThumbnailPagination && (
					<PanelBody
						title={ __(
							'Thumbnail Carousel Settings',
							'hm-carousel'
						) }
					>
						<RangeControl
							label={ __(
								'Thumbnails shown (Desktop)',
								'hm-carousel'
							) }
							value={ thumbnailCount.desktop }
							onChange={ ( value ) =>
								setAttributes( {
									thumbnailCount: {
										...thumbnailCount,
										desktop: value,
									},
								} )
							}
							min={ 1 }
							max={ 10 }
						/>
						<RangeControl
							label={ __(
								'Thumbnails shown (Tablet)',
								'hm-carousel'
							) }
							value={ thumbnailCount.tablet }
							onChange={ ( value ) =>
								setAttributes( {
									thumbnailCount: {
										...thumbnailCount,
										tablet: value,
									},
								} )
							}
							min={ 1 }
							max={ 10 }
						/>
						<RangeControl
							label={ __(
								'Thumbnails shown (Mobile)',
								'hm-carousel'
							) }
							value={ thumbnailCount.mobile }
							onChange={ ( value ) =>
								setAttributes( {
									thumbnailCount: {
										...thumbnailCount,
										mobile: value,
									},
								} )
							}
							min={ 1 }
							max={ 10 }
						/>
						<SelectControl
							label={ __(
								'Thumbnail Navigation Type',
								'hm-carousel'
							) }
							value={ thumbnailNavType }
							options={ [
								{
									label: __( 'Pagination', 'hm-carousel' ),
									value: 'pagination',
								},
								{
									label: __( 'Buttons', 'hm-carousel' ),
									value: 'buttons',
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { thumbnailNavType: value } )
							}
							help={ __(
								'Displayed only when the number of thumbnails is greater than the thumbnails shown.'
							) }
						/>
					</PanelBody>
				) }
				{ ( type === 'loop' || type === 'slide' ) && (
					<PanelBody
						title={ __(
							'Slides Per Page Settings',
							'hm-carousel'
						) }
					>
						<RangeControl
							label={ __(
								'Slides per page (Desktop)',
								'hm-carousel'
							) }
							value={ slidesPerPage.desktop }
							onChange={ ( value ) =>
								setAttributes( {
									slidesPerPage: {
										...slidesPerPage,
										desktop: value,
									},
								} )
							}
							min={ 1 }
							max={ 10 }
						/>
						<RangeControl
							label={ __(
								'Slides per page (Tablet)',
								'hm-carousel'
							) }
							value={ slidesPerPage.tablet }
							onChange={ ( value ) =>
								setAttributes( {
									slidesPerPage: {
										...slidesPerPage,
										tablet: value,
									},
								} )
							}
							min={ 1 }
							max={ 10 }
						/>
						<RangeControl
							label={ __(
								'Slides per page (Mobile)',
								'hm-carousel'
							) }
							value={ slidesPerPage.mobile }
							onChange={ ( value ) =>
								setAttributes( {
									slidesPerPage: {
										...slidesPerPage,
										mobile: value,
									},
								} )
							}
							min={ 1 }
							max={ 10 }
						/>
						<ToggleControl
							label={ __(
								'Move one slide at a time',
								'hm-carousel'
							) }
							checked={ moveSlidesIndividually }
							onChange={ ( value ) =>
								setAttributes( {
									moveSlidesIndividually: value,
								} )
							}
							help={ __(
								'The default behavior is to move a page of slides at a time.'
							) }
						/>
					</PanelBody>
				) }
				{ ( type === 'loop' || type === 'slide' ) && (
					<PanelBody
						title={ __( 'Carousel Direction', 'hm-carousel' ) }
						initialOpen={ false }
					>
						<SelectControl
							label={ __( 'Direction (Desktop)', 'hm-carousel' ) }
							value={ carouselDirection.desktop }
							options={ DIRECTION_OPTIONS }
							onChange={ ( value ) =>
								setResponsiveAttribute(
									'direction',
									carouselDirection,
									'desktop',
									value
								)
							}
						/>
						<SelectControl
							label={ __( 'Direction (Tablet)', 'hm-carousel' ) }
							value={ carouselDirection.tablet }
							options={ DIRECTION_OPTIONS }
							onChange={ ( value ) =>
								setResponsiveAttribute(
									'direction',
									carouselDirection,
									'tablet',
									value
								)
							}
						/>
						<SelectControl
							label={ __( 'Direction (Mobile)', 'hm-carousel' ) }
							value={ carouselDirection.mobile }
							options={ DIRECTION_OPTIONS }
							onChange={ ( value ) =>
								setResponsiveAttribute(
									'direction',
									carouselDirection,
									'mobile',
									value
								)
							}
						/>
					</PanelBody>
				) }
				{ ( type === 'loop' || type === 'slide' ) && (
					<PanelBody
						title={ __( 'Slide Sizing', 'hm-carousel' ) }
						initialOpen={ false }
					>
						<TextControl
							label={ __( 'Fixed slide width', 'hm-carousel' ) }
							value={ fixedWidth }
							onChange={ ( value ) =>
								setAttributes( { fixedWidth: value } )
							}
							help={ __(
								'Optional. CSS length (e.g. "900px" or "60rem"). When set, each slide is sized to this width regardless of slides-per-page; useful for full-bleed carousels with consistent slide widths.',
								'hm-carousel'
							) }
						/>
						<TextControl
							label={ __(
								'Carousel height (Desktop)',
								'hm-carousel'
							) }
							value={ carouselHeight.desktop }
							onChange={ ( value ) =>
								setResponsiveAttribute(
									'height',
									carouselHeight,
									'desktop',
									value
								)
							}
							help={ __(
								'Optional. CSS length for the carousel height. Required by Splide for top-to-bottom carousels.',
								'hm-carousel'
							) }
						/>
						<TextControl
							label={ __(
								'Carousel height (Tablet)',
								'hm-carousel'
							) }
							value={ carouselHeight.tablet }
							onChange={ ( value ) =>
								setResponsiveAttribute(
									'height',
									carouselHeight,
									'tablet',
									value
								)
							}
						/>
						<TextControl
							label={ __(
								'Carousel height (Mobile)',
								'hm-carousel'
							) }
							value={ carouselHeight.mobile }
							onChange={ ( value ) =>
								setResponsiveAttribute(
									'height',
									carouselHeight,
									'mobile',
									value
								)
							}
						/>
						<TextControl
							label={ __(
								'Fixed slide height (Desktop)',
								'hm-carousel'
							) }
							value={ carouselFixedHeight.desktop }
							onChange={ ( value ) =>
								setResponsiveAttribute(
									'fixedHeight',
									carouselFixedHeight,
									'desktop',
									value
								)
							}
							help={ __(
								'Optional. CSS length that fixes each slide to this height. When set, Splide ignores slides-per-page height calculations.',
								'hm-carousel'
							) }
						/>
						<TextControl
							label={ __(
								'Fixed slide height (Tablet)',
								'hm-carousel'
							) }
							value={ carouselFixedHeight.tablet }
							onChange={ ( value ) =>
								setResponsiveAttribute(
									'fixedHeight',
									carouselFixedHeight,
									'tablet',
									value
								)
							}
						/>
						<TextControl
							label={ __(
								'Fixed slide height (Mobile)',
								'hm-carousel'
							) }
							value={ carouselFixedHeight.mobile }
							onChange={ ( value ) =>
								setResponsiveAttribute(
									'fixedHeight',
									carouselFixedHeight,
									'mobile',
									value
								)
							}
						/>
						<TextControl
							label={ __(
								'Track padding (left)',
								'hm-carousel'
							) }
							value={ trackPadding.left }
							onChange={ ( value ) =>
								setAttributes( {
									padding: { ...trackPadding, left: value },
								} )
							}
							help={ __(
								'Optional. CSS length to inset slides from the left edge of the carousel container. Useful for full-bleed carousels where the first slide should align with the content area.',
								'hm-carousel'
							) }
						/>
						<TextControl
							label={ __(
								'Track padding (right)',
								'hm-carousel'
							) }
							value={ trackPadding.right }
							onChange={ ( value ) =>
								setAttributes( {
									padding: { ...trackPadding, right: value },
								} )
							}
							help={ __(
								'Optional. CSS length to inset slides from the right edge of the carousel container.',
								'hm-carousel'
							) }
						/>
						<TextControl
							label={ __( 'Track padding (top)', 'hm-carousel' ) }
							value={ trackPadding.top }
							onChange={ ( value ) =>
								setAttributes( {
									padding: { ...trackPadding, top: value },
								} )
							}
							help={ __(
								'Optional. CSS length to inset slides from the top edge of a top-to-bottom carousel.',
								'hm-carousel'
							) }
						/>
						<TextControl
							label={ __(
								'Track padding (bottom)',
								'hm-carousel'
							) }
							value={ trackPadding.bottom }
							onChange={ ( value ) =>
								setAttributes( {
									padding: { ...trackPadding, bottom: value },
								} )
							}
							help={ __(
								'Optional. CSS length to inset slides from the bottom edge of a top-to-bottom carousel.',
								'hm-carousel'
							) }
						/>
					</PanelBody>
				) }
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlockSlider.Controlled
					allowedBlock={ allowedBlocks }
					className={ 'hm-carousel__content' }
					slideLimit={ SLIDE_LIMIT }
					parentBlockId={ clientId }
					currentItemIndex={ currentSlideIndex }
					setCurrentItemIndex={ setCurrentSlideIndex }
					perPage={ slidesPerPage.desktop }
					template={ template }
				/>
				{ hasTabNav && <TabNav blockId={ clientId } /> }
			</div>
		</>
	);
}

export default Edit;
