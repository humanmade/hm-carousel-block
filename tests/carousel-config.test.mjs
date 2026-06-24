import assert from 'node:assert/strict';
import test from 'node:test';

import {
	BREAKPOINTS,
	createSplideConfig,
} from '../src/blocks/carousel/config.mjs';

const defaultSettings = {
	type: 'slide',
	speed: 800,
	hasPagination: true,
	hasNavButtons: true,
	autoplay: true,
	interval: 3000,
	easing: 'ease',
	gap: '1.5rem',
	slidesPerPage: {
		desktop: 4,
		tablet: 2,
		mobile: 1,
	},
	direction: {
		desktop: 'ltr',
		tablet: 'ltr',
		mobile: 'ltr',
	},
	height: {
		desktop: '',
		tablet: '',
		mobile: '',
	},
	fixedHeight: {
		desktop: '',
		tablet: '',
		mobile: '',
	},
	padding: null,
	autoScroll: false,
	autoScrollSpeed: 1,
	hasThumbnailPagination: false,
	moveSlidesIndividually: false,
	fixedWidth: '',
};

function buildConfig( overrides = {} ) {
	return createSplideConfig( {
		...defaultSettings,
		...overrides,
	} );
}

test( 'inherits height for vertical breakpoints with blank height fields', () => {
	const config = buildConfig( {
		direction: {
			desktop: 'ttb',
			tablet: 'ttb',
			mobile: 'ttb',
		},
		height: {
			desktop: '520px',
			tablet: '',
			mobile: '',
		},
	} );

	assert.equal( config.height, '520px' );
	assert.equal( config.breakpoints[ BREAKPOINTS.tablet ].height, '520px' );
	assert.equal( config.breakpoints[ BREAKPOINTS.mobile ].height, '520px' );
} );

test( 'clears inherited vertical height when a breakpoint switches to horizontal', () => {
	const config = buildConfig( {
		direction: {
			desktop: 'ttb',
			tablet: 'ltr',
			mobile: 'ltr',
		},
		height: {
			desktop: '520px',
			tablet: '',
			mobile: '',
		},
	} );

	assert.equal( config.height, '520px' );
	assert.equal( config.breakpoints[ BREAKPOINTS.tablet ].height, '' );
	assert.equal( config.breakpoints[ BREAKPOINTS.mobile ].height, '' );
} );

test( 'keeps Auto-scroll active while sizing follows responsive direction', () => {
	const config = buildConfig( {
		autoScroll: true,
		direction: {
			desktop: 'ttb',
			tablet: 'ltr',
			mobile: 'ltr',
		},
	} );

	assert.equal( config.type, 'loop' );
	assert.equal( config.autoplay, false );
	assert.equal( config.arrows, false );
	assert.equal( config.pagination, false );
	assert.equal( typeof config.autoScroll, 'object' );
	assert.equal( config.autoWidth, false );

	assert.equal( config.breakpoints[ BREAKPOINTS.tablet ].type, 'loop' );
	assert.equal( config.breakpoints[ BREAKPOINTS.tablet ].autoplay, false );
	assert.equal( config.breakpoints[ BREAKPOINTS.tablet ].arrows, false );
	assert.equal( config.breakpoints[ BREAKPOINTS.tablet ].pagination, false );
	assert.equal(
		typeof config.breakpoints[ BREAKPOINTS.tablet ].autoScroll,
		'object'
	);
	assert.equal( config.breakpoints[ BREAKPOINTS.tablet ].autoWidth, true );

	assert.equal( config.breakpoints[ BREAKPOINTS.mobile ].type, 'loop' );
	assert.equal( config.breakpoints[ BREAKPOINTS.mobile ].autoplay, false );
	assert.equal( config.breakpoints[ BREAKPOINTS.mobile ].arrows, false );
	assert.equal( config.breakpoints[ BREAKPOINTS.mobile ].pagination, false );
	assert.equal(
		typeof config.breakpoints[ BREAKPOINTS.mobile ].autoScroll,
		'object'
	);
	assert.equal( config.breakpoints[ BREAKPOINTS.mobile ].autoWidth, true );
} );

test( 'keeps thumbnail pagination controls disabled across breakpoints', () => {
	const config = buildConfig( {
		autoScroll: true,
		hasThumbnailPagination: true,
	} );

	assert.equal( config.arrows, false );
	assert.equal( config.pagination, false );
	assert.equal( config.breakpoints[ BREAKPOINTS.tablet ].arrows, false );
	assert.equal( config.breakpoints[ BREAKPOINTS.tablet ].pagination, false );
	assert.equal( config.breakpoints[ BREAKPOINTS.mobile ].arrows, false );
	assert.equal( config.breakpoints[ BREAKPOINTS.mobile ].pagination, false );
} );

test( 'uses padding values from the active carousel axis', () => {
	const config = buildConfig( {
		direction: {
			desktop: 'ttb',
			tablet: 'ltr',
			mobile: 'ltr',
		},
		padding: {
			left: '2rem',
			right: '3rem',
			top: '4rem',
			bottom: '5rem',
		},
	} );

	assert.deepEqual( config.padding, {
		top: '4rem',
		bottom: '5rem',
	} );
	assert.deepEqual( config.breakpoints[ BREAKPOINTS.tablet ].padding, {
		left: '2rem',
		right: '3rem',
	} );
	assert.deepEqual( config.breakpoints[ BREAKPOINTS.mobile ].padding, {
		left: '2rem',
		right: '3rem',
	} );
} );
