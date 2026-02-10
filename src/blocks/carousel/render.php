<?php
/**
 * Carousel Block - Render Template.
 *
 * The view.js script checks for minimum slide count before initializing.
 */

// Always enqueue Splide library (view.js depends on it)
wp_enqueue_script( 'splide' );
wp_enqueue_style( 'splide' );

// Add data attributes for carousel settings
$p = new \WP_HTML_Tag_Processor( $content );

if ( $p->next_tag( [ 'tag_name' => 'div', 'class_name' => 'hm-carousel' ] ) ) {
	$p->set_attribute( 'data-has-tab-nav', $attributes['hasTabNav'] ? 'true' : 'false' );
	$p->set_attribute( 'data-has-pagination', $attributes['hasPagination'] ? 'true' : 'false' );
	$p->set_attribute( 'data-has-nav-buttons', $attributes['hasNavButtons'] ? 'true' : 'false' );
	$p->set_attribute( 'data-type', $attributes['type'] );
	$p->set_attribute( 'data-autoplay', $attributes['autoplay'] ? 'true' : 'false' );
	$p->set_attribute( 'data-interval', $attributes['interval'] );
	$p->set_attribute( 'data-speed', $attributes['speed'] );
	$p->set_attribute( 'data-easing', $attributes['easing'] );
	$p->set_attribute( 'data-move-slides-individually', $attributes['moveSlidesIndividually'] ? 'true' : 'false' );
	$p->set_attribute( 'data-has-thumbnail-pagination', $attributes['hasThumbnailPagination'] ? 'true' : 'false' );
	$p->set_attribute( 'data-thumbnail-count', wp_json_encode( $attributes['thumbnailCount'] ) );
	$p->set_attribute( 'data-slides-per-page', wp_json_encode( $attributes['slidesPerPage'] ) );
	$p->set_attribute( 'data-thumbnail-nav-type', $attributes['thumbnailNavType'] );
}

echo $p->get_updated_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
