<?php
/**
 *  Adding classes in PHP prevents FOUC.
 */

$p = new \WP_HTML_Tag_Processor( $content );

if ( $p->next_tag( [ 'tag_name' => 'div', 'class_name' => 'hm-carousel' ] ) ) {
	$p->add_class( 'splide' );
}

if ( $p->next_tag( [ 'tag_name' => 'div', 'class_name' => 'hm-carousel__content' ] ) ) {
	$p->add_class( 'splide__list' );
}

echo $p->get_updated_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
