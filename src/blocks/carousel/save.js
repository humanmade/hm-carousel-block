import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Saves the block content for display on the frontend.
 *
 * @return {Element} Formatted block.
 */
function Save() {
	const blockProps = useBlockProps.save( {
		className: 'hm-carousel',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'hm-carousel__content splide__list',
	} );

	return (
		<div { ...blockProps }>
			<div className="splide__track">
				<div { ...innerBlocksProps } />
			</div>
		</div>
	);
}

export default Save;
