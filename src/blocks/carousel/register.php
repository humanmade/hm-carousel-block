<?php
/**
 * Carousel Block.
 */

namespace HM\CarouselBlock\Blocks\Carousel;

use const HM\CarouselBlock\PLUGIN_PATH;

function bootstrap() {
	add_action( 'init', __NAMESPACE__ . '\\register_block' );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts' );
}

function register_block() {
	register_block_type( PLUGIN_PATH . '/build/blocks/carousel/block.json' );
}

function enqueue_scripts() {
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

	// Defer load view script.
	wp_script_add_data( 'hm-carousel-view-script', 'strategy', 'defer' );

	// Ensure dependencies set up for view script.
	global $wp_scripts, $wp_styles;
	$wp_scripts->registered['hm-carousel-view-script']->deps[] = 'splide';
	$wp_styles->registered['hm-carousel-style']->deps[] = 'splide';
}
