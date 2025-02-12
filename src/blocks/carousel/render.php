<?php
/**
 *  Adding classes in PHP prevents FOUC.
 */

$p = new \WP_HTML_Tag_Processor( $content );

if ( $p->next_tag( [ 'tag_name' => 'div', 'class_name' => 'hm-carousel' ] ) ) {
	$p->add_class( 'splide' );
	$p->set_attribute( 'data-has-tab-nav', $attributes['hasTabNav'] ? 'true' : 'false' );
	$p->set_attribute( 'data-has-pagination', $attributes['hasPagination'] ? 'true' : 'false' );
	$p->set_attribute( 'data-has-nav-buttons', $attributes['hasNavButtons'] ? 'true' : 'false' );
	$p->set_attribute( 'data-per-page', $attributes['perPage'] );
	$p->set_attribute( 'data-type', $attributes['type'] );
	$p->set_attribute( 'data-autoplay', $attributes['autoplay'] ? 'true' : 'false' );
	$p->set_attribute( 'data-interval', $attributes['interval'] );
	$p->set_attribute( 'data-speed', $attributes['speed'] );
	$p->set_attribute( 'data-easing', $attributes['easing'] );
}

if ( $p->next_tag( [ 'tag_name' => 'div', 'class_name' => 'hm-carousel__content' ] ) ) {
	$p->add_class( 'splide__list' );
}

echo $p->get_updated_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
