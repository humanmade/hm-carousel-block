import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorDataStore } from '@wordpress/block-editor';

/**
 * Tabs component for carousel navigation.
 *
 * @param {Object} props Component properties.
 * @param {string} props.blockId The block ID.
 * @returns {JSX.Element} The Tabs component.
 */
const TabNav = ( { blockId } ) => {
	const [ currentSlideIndex, setCurrentSlideIndex ] = useState( 0 );

	const innerBlocks = useSelect( ( select ) => {
		return select( 'core/block-editor' ).getBlock( blockId )?.innerBlocks || [];
	}, [ blockId ] );

	const { updateBlockAttributes } = useDispatch( blockEditorDataStore.name );

	// Memoize an array of titles to reduce computation within the effect.
	const slideList = useMemo( () => {
		return innerBlocks.map( ( block ) => ( {
			title: block?.attributes?.title ?? '',
			id: block?.attributes?.id || block.clientId,
		} ) );
	}, [ innerBlocks ] );

	return (
		<div className="hm-carousel__nav">
			{ slideList.map( ( slide, i ) => {
				let buttonClassName = 'hm-carousel__nav-button';

				if ( i === currentSlideIndex ) {
					buttonClassName += ' hm-carousel__nav-button is-active';
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
								updateBlockAttributes( slide.id, { title } );
							} }
							placeholder={ __( 'Slide title…', 'hm-carousel' ) }
						/>
					</button>
				);
			} ) }
		</div>
	);
};

export default TabNav;
