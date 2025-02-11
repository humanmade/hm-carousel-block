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
		className: 'hm-carousel__content',
	} );

	return (
		<div { ...blockProps }>
			<div { ...innerBlocksProps } />
		</div>
	);
}

export default Save;
