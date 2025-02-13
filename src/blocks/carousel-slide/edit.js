import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';

import { TextControl, PanelBody } from '@wordpress/components';
import { ImageControl } from '@humanmade/block-editor-components';

/**
 * Provide an interface for editing the block.
 *
 * @param {Object}   props               Props
 * @param {Function} props.setAttributes Set attributes.
 * @param {Object}   props.attributes    Attributes.
 * @return {Element} Formatted blocks.
 */
function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps( {
		className: 'hm-carousel-slide',
	} );

	const template = [ [ 'core/paragraph' ] ];

	const { children, ...rest } = useInnerBlocksProps( blockProps, {
		template,
	} );

	return [
		<InspectorControls key="inspector-controls">
			<PanelBody
				title={ __( 'Carousel Slide Advanced Settings', 'hm-tabs' ) }
			>
				<TextControl
					label="Thumbnail title"
					value={ attributes.title }
					onChange={ ( title ) => setAttributes( { title } ) }
				/>
				<ImageControl
					label="Thumbnail image"
					value={ attributes.thumbnailImageId }
					onChange={ image => {
						setAttributes( { thumbnailImageId: image?.id || null } )
					} }
				/>
			</PanelBody>
		</InspectorControls>,
		<div key="block" { ...rest }>
			{ children }
		</div>,
	];
}

export default Edit;
