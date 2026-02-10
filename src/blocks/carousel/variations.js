/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const variations = [
	{
		name: 'hm/articles-carousel',
		title: __( 'Articles Carousel', 'hm-carousel-block' ),
		description: __( 'Carousel of query loop articles.', 'hm-carousel-block' ),
		attributes: {
			layout: 'articles-carousel',
		},
		scope: [ 'block', 'inserter' ],
		isActive: ( blockAttributes ) =>
			blockAttributes.layout === 'articles-carousel',
		icon: 'slides',
		keywords: [ 'articles', 'posts', 'query' ],
	},
];

export default variations;
