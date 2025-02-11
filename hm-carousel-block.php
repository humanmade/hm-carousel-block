<?php
/**
 * Plugin Name:       HM Carousel Block
 * Description:       Carousel/Slider block for WordPress.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Human Made Limited
 * Author URI:        https://humanmade.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hm-carousel-block
 */

namespace HM\CarouselBlock;

const PLUGIN_PATH = __DIR__;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Setup
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function bootstrap() {
	require_once __DIR__ . '/src/blocks/carousel/register.php';
	require_once __DIR__ . '/src/blocks/carousel-slide/register.php';

	Blocks\Carousel\bootstrap();
	Blocks\CarouselSlide\bootstrap();
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap' );
