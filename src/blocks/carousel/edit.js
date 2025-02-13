import { InnerBlockSlider } from '@humanmade/block-editor-components';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl, SelectControl, Notice } from '@wordpress/components';
import TabNav from './components/tab-nav';

const SLIDE_LIMIT = 100;
const ALLOWED_BLOCK = 'hm/carousel-slide';

/**
 * Provide an interface for editing the block.
 *
 * @param {Object} props Props
 * @return {Element} Formatted blocks.
 */
function Edit( props ) {
	const { clientId, attributes, setAttributes } = props;
	const { hasTabNav, hasPagination, hasNavButtons, perPage, type, autoplay, interval, speed, easing, moveSlidesIndividually, hasThumbnailPagination } = attributes;

	const blockProps = useBlockProps( {
		className: 'hm-carousel',
	} );

	const innerBlocksProps = useInnerBlocksProps( {
		className: 'hm-carousel__content',
	} );

	const [ currentSlideIndex, setCurrentSlideIndex ] = useState( 0 );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Carousel Settings', 'hm-carousel' ) }>
					<ToggleControl
						label={ __( 'Enable Pagination', 'hm-carousel' ) }
						checked={ hasPagination }
						onChange={ ( value ) => setAttributes( { hasPagination: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Navigation Buttons', 'hm-carousel' ) }
						checked={ hasNavButtons }
						onChange={ ( value ) => setAttributes( { hasNavButtons: value } ) }
					/>
					<SelectControl
						label={ __( 'Carousel Type', 'hm-carousel' ) }
						value={ type }
						options={ [
							{ label: __( 'Fade', 'hm-carousel' ), value: 'fade' },
							{ label: __( 'Loop', 'hm-carousel' ), value: 'loop' },
							{ label: __( 'Slide', 'hm-carousel' ), value: 'slide' },
						] }
						onChange={ ( value ) => setAttributes( { type: value } ) }
					/>
					{ ( type === 'loop' || type === 'slide' ) && (
						<RangeControl
							label={ __( 'Slides Per Page', 'hm-carousel' ) }
							value={ perPage }
							onChange={ ( value ) => setAttributes( { perPage: value } ) }
							min={ 1 }
							max={ 10 }
						/>
					) }
					{ perPage > 1 && (
						<ToggleControl
							label={ __( 'Move one slide at a time', 'hm-carousel' ) }
							checked={ moveSlidesIndividually }
							onChange={ ( value ) => setAttributes( { moveSlidesIndividually: value } ) }
						/>
					) }
					<SelectControl
						label={ __( 'Animation style', 'hm-carousel' ) }
						value={ easing }
						options={ [
							{ label: __( 'Ease', 'hm-carousel' ), value: 'ease' },
							{ label: __( 'Linear', 'hm-carousel' ), value: 'linear' },
						] }
						onChange={ ( value ) => setAttributes( { easing: value } ) }
					/>
					<RangeControl
						label={ __( 'Transition Speed (seconds)', 'hm-carousel' ) }
						value={ speed / 1000 }
						onChange={ ( value ) => setAttributes( { speed: value * 1000 } ) }
						min={ 0 }
						max={ 3 }
						step={ 0.1 }
					/>
					<ToggleControl
						label={ __( 'Autoplay', 'hm-carousel' ) }
						checked={ autoplay }
						onChange={ ( value ) => setAttributes( { autoplay: value } ) }
					/>
					{ autoplay && (
						<>
							<RangeControl
								label={ __( 'Autoplay Interval (seconds)', 'hm-carousel' ) }
								value={ interval / 1000 }
								onChange={ ( value ) => setAttributes( { interval: value * 1000 } ) }
								min={ 0 }
								max={ 10 }
								step={ 1 }
							/>
							{ autoplay && ! hasPagination && ! hasNavButtons && (
								<Notice
									status="warning"
									isDismissible={ false }
								>
									{ __( 'For accessibility reasons it is best not to rely on autoplay alone for changing slides, unless the carousel is just for a decorative purpose. Otherwise, the user will have no way to rotate the carousel while prefers-reduced-motion is enabled.', 'hm-carousel' ) }
								</Notice>
							) }
						</>
					) }
					{ hasPagination && (
						<ToggleControl
							label={ __( 'Thumbnail Carousel', 'hm-carousel' ) }
							checked={ hasThumbnailPagination }
							onChange={ ( value ) => setAttributes( { hasThumbnailPagination: value } ) }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlockSlider.Controlled
					allowedBlock={ ALLOWED_BLOCK }
					className={ 'hm-carousel__content' }
					slideLimit={ SLIDE_LIMIT }
					parentBlockId={ clientId }
					currentItemIndex={ currentSlideIndex }
					setCurrentItemIndex={ setCurrentSlideIndex }
					perPage={ perPage }
				/>
				{ hasTabNav && (
					<TabNav
						blockId={ clientId }
					/>
				) }
			</div>
		</>
	);
}

export default Edit;
