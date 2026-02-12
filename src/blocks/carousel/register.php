<?php
/**
 * Carousel Block.
 */

namespace HM\CarouselBlock\Blocks\Carousel;

use const HM\CarouselBlock\PLUGIN_PATH;

/**
 * Setup.
 *
 * @return void
 */
function bootstrap(): void {
	add_action( 'init', __NAMESPACE__ . '\\register_block' );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\register_vendor_scripts' );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\modify_block_scripts', 100 );
}

/**
 * Register the carousel block.
 *
 * @return void
 */
function register_block(): void {
	register_block_type( PLUGIN_PATH . '/build/blocks/carousel/block.json' );
}

/**
 * Register vendor scripts and styles.
 *
 * @return void
 */
function register_vendor_scripts(): void {
	$splide_asset = include PLUGIN_PATH . '/build-vendor/splide.asset.php';
	wp_register_script(
		'splide',
		plugins_url( 'build-vendor/splide.js', PLUGIN_PATH . '/hm-carousel-block.php' ),
		$splide_asset['dependencies'],
		$splide_asset['version'],
		[
			'in_footer' => true,
			'strategy'  => 'defer',
		]
	);

	wp_register_style(
		'splide',
		plugins_url( 'build-vendor/splide.css', PLUGIN_PATH . '/hm-carousel-block.php' ),
		$splide_asset['dependencies'],
		$splide_asset['version'],
	);
}

/**
 * Modify block assets.
 *
 * @return void
 */
function modify_block_scripts(): void {
	// Defer load view script.
	wp_script_add_data( 'hm-carousel-view-script', 'strategy', 'defer' );

	global $wp_scripts, $wp_styles;

	// Add splide script as dependency.
	if ( isset( $wp_scripts->registered['hm-carousel-view-script'] ) ) {
		$wp_scripts->registered['hm-carousel-view-script']->deps[] = 'splide';
	}

	// Add splide styles as dependency.
	if ( isset( $wp_styles->registered['hm-carousel-style'] ) ) {
		$wp_styles->registered['hm-carousel-style']->deps[] = 'splide';
	}
}
