/**
 * Block grouping for a carousel layout block.
 */

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import variations from './variations';
import { registerBlockType, registerBlockStyle } from '@wordpress/blocks';

import './index.css';

registerBlockType( metadata.name, {
	edit: Edit,
	save: Save,
	variations,
} );
