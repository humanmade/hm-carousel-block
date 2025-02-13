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
	$p->set_attribute( 'data-type', $attributes['type'] );
	$p->set_attribute( 'data-autoplay', $attributes['autoplay'] ? 'true' : 'false' );
	$p->set_attribute( 'data-interval', $attributes['interval'] );
	$p->set_attribute( 'data-speed', $attributes['speed'] );
	$p->set_attribute( 'data-easing', $attributes['easing'] );
	$p->set_attribute( 'data-move-slides-individually', $attributes['moveSlidesIndividually'] ? 'true' : 'false' );
	$p->set_attribute( 'data-has-thumbnail-pagination', $attributes['hasThumbnailPagination'] ? 'true' : 'false' );
	$p->set_attribute( 'data-thumbnail-count', wp_json_encode( $attributes['thumbnailCount'] ) );
	$p->set_attribute( 'data-slides-per-page', wp_json_encode( $attributes['slidesPerPage'] ) );
}

if ( $p->next_tag( [ 'tag_name' => 'div', 'class_name' => 'hm-carousel__content' ] ) ) {
	$p->add_class( 'splide__list' );
}

echo $p->get_updated_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
