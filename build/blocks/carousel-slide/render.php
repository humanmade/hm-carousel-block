<?php
/**
 *  Adding classes in PHP prevents FOUC.
 */

$p = new \WP_HTML_Tag_Processor( $content );

if ( $p->next_tag( [ 'tag_name' => 'div', 'class_name' => 'hm-carousel-slide' ] ) ) {
	$p->add_class( 'splide__slide' );

	$thumbnail = ! empty( $attributes['thumbnailImageId'] ) ? wp_get_attachment_image_src( $attributes['thumbnailImageId'], 'medium' ) : null;
	if ( $thumbnail ) {
		$p->set_attribute( 'data-thumbnail-image-src', $thumbnail[0] );
	}
}

echo $p->get_updated_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
