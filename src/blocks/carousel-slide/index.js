/**
 * Block grouping for a carousel layout block.
 */
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import { registerBlockType } from '@wordpress/blocks';

registerBlockType( metadata.name, {
	edit: Edit,
	save: Save,
} );
