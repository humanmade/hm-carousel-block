import { InnerBlockSlider } from '@humanmade/block-editor-components';
import { useMemo, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	store as blockEditorDataStore,
} from '@wordpress/block-editor';

const SLIDE_LIMIT = 100;
const ALLOWED_BLOCK = 'hm/carousel-slide';

/**
 * Provide an interface for editing the block.
 *
 * @param {Object} props Props
 * @return {Element} Formatted blocks.
 */
function Edit( props ) {
	const { clientId } = props;

	const innerBlocks = useSelect(
		( select ) => {
			return (
				select( 'core/block-editor' ).getBlock( clientId )
					?.innerBlocks || []
			);
		},
		[ clientId ]
	);

	// Memoize an array of titles to reduce computation within the effect.
	const slideList = useMemo( () => {
		return innerBlocks.map( ( block ) => ( {
			title: block?.attributes?.title ?? '',
			id: block?.attributes?.id || block.clientId,
		} ) );
	}, [ innerBlocks ] );

	const blockProps = useBlockProps( {
		className: 'hm-carousel',
	} );

	const { updateBlockAttributes } = useDispatch( blockEditorDataStore.name );

	const [ currentSlideIndex, setCurrentSlideIndex ] = useState( 0 );

	return (
		<div { ...blockProps }>
			<InnerBlockSlider.Controlled
				allowedBlock={ ALLOWED_BLOCK }
				className={ 'hm-carousel__content' }
				slideLimit={ SLIDE_LIMIT }
				parentBlockId={ clientId }
				currentItemIndex={ currentSlideIndex }
				setCurrentItemIndex={ setCurrentSlideIndex }
			/>
			<div className="hm-carousel__nav">
				{ slideList.map( ( slide, i ) => {
					let buttonClassName = 'hm-carousel__nav-button';

					if ( i === currentSlideIndex ) {
						buttonClassName +=
							' hm-carousel__nav-button is-active';
					}

					return (
						<button
							className={ buttonClassName }
							key={ slide.id }
							onClick={ () => {
								setCurrentSlideIndex( i );
							} }
						>
							<RichText
								tagName="span"
								value={ slide.title }
								onChange={ ( title ) => {
									updateBlockAttributes( slide.id, {
										title,
									} );
								} }
								placeholder={ __(
									'Slide title…',
									'hm-carousel'
								) }
							/>
						</button>
					);
				} ) }
			</div>
		</div>
	);
}

export default Edit;
