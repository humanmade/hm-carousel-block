<?php
/**
 * Carousel Slide Block.
 */

namespace HM\CarouselBlock\Blocks\CarouselSlide;

use const HM\CarouselBlock\PLUGIN_PATH;

function bootstrap() {
	add_action( 'init', __NAMESPACE__ . '\\register_block' );
}

function register_block() {
	register_block_type( PLUGIN_PATH . '/build/blocks/carousel-slide' );
}
