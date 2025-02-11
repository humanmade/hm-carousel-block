import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Saves the block content for display on the frontend.
 *
 * @param {Object} props Props
 * @return {Element} Formatted block.
 */
function Save( props ) {
	const blockProps = useBlockProps.save( {
		className: 'hm-carousel-slide',
		'data-title': props.attributes.title,
	} );

	const innerBlockProps = useInnerBlocksProps.save( {
		className: 'hm-carousel-slide__content',
	} );

	return (
		<div { ...blockProps }>
			<div { ...innerBlockProps } />
		</div>
	);
}

export default Save;
