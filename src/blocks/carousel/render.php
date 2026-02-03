<?php
/**
 *  Adding classes in PHP prevents FOUC.
 */

use const HM\CarouselBlock\PLUGIN_PATH;

// Count slides using simple string occurrence counting (safe, no loops)
$slide_count = 0;

// Check for Query Loop first (wp-block-post class)
if ( strpos( $content, 'wp-block-post' ) !== false ) {
	// Count <li class="wp-block-post tags
	preg_match_all( '/<li[^>]*class="[^"]*\bwp-block-post\b[^"]*"/', $content, $matches );
	$slide_count = count( $matches[0] );
}

// If no Query Loop posts, check for regular carousel slides
if ( $slide_count === 0 ) {
	// Count <div class="...hm-carousel-slide..." tags
	preg_match_all( '/<div[^>]*class="[^"]*\bhm-carousel-slide\b[^"]*"/', $content, $matches );
	$slide_count = count( $matches[0] );
}

// Only enqueue scripts if there are 2 or more slides
if ( $slide_count >= 2 ) {
	wp_enqueue_script( 'splide' );
	wp_enqueue_style( 'splide' );

	$asset_file = include PLUGIN_PATH . '/build/blocks/carousel/view.asset.php';
	wp_register_script(
		'hm-carousel-view-script',
		plugins_url( 'build/blocks/carousel/view.js', PLUGIN_PATH . '/hm-carousel-block.php' ),
		array_merge( $asset_file['dependencies'] ?? [], [ 'splide' ] ),
		$asset_file['version'] ?? '1.0.0',
		true
	);

	wp_register_style(
		'hm-carousel-style',
		plugins_url( 'build/blocks/carousel/view.css', PLUGIN_PATH . '/hm-carousel-block.php' ),
		[ 'splide' ],
		$asset_file['version'] ?? '1.0.0'
	);

	wp_enqueue_script( 'hm-carousel-view-script' );
	wp_enqueue_style( 'hm-carousel-style' );
}

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
