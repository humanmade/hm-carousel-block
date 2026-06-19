export const DEFAULT_DIRECTION = {
	desktop: 'ltr',
	tablet: 'ltr',
	mobile: 'ltr',
};

export const DEFAULT_RESPONSIVE_LENGTH = {
	desktop: '',
	tablet: '',
	mobile: '',
};

export const DEFAULT_RESPONSIVE_BOOLEAN = {
	desktop: true,
	tablet: true,
	mobile: true,
};

export const DEFAULT_PADDING = {
	left: '',
	right: '',
	top: '',
	bottom: '',
};

export const BREAKPOINTS = {
	tablet: 1024,
	mobile: 768,
};

const RESPONSIVE_ORDER = [ 'desktop', 'tablet', 'mobile' ];

export function normalizeResponsiveSetting( value, fallback ) {
	if ( ! value || typeof value !== 'object' || Array.isArray( value ) ) {
		return { ...fallback };
	}

	return {
		...fallback,
		...value,
	};
}

export function getResponsiveValue( setting, breakpoint, fallback = '' ) {
	return setting?.[ breakpoint ] ?? fallback;
}

function getResponsiveDirection( directions, breakpoint ) {
	if ( breakpoint === 'desktop' ) {
		return getResponsiveValue(
			directions,
			'desktop',
			DEFAULT_DIRECTION.desktop
		);
	}

	if ( breakpoint === 'tablet' ) {
		return getResponsiveValue(
			directions,
			'tablet',
			getResponsiveDirection( directions, 'desktop' )
		);
	}

	return getResponsiveValue(
		directions,
		'mobile',
		getResponsiveDirection( directions, 'tablet' )
	);
}

function getInheritedLengthValue( values, breakpoint ) {
	const breakpointIndex = RESPONSIVE_ORDER.indexOf( breakpoint );
	const inheritedBreakpoints = RESPONSIVE_ORDER.slice(
		0,
		breakpointIndex + 1
	).reverse();

	return (
		inheritedBreakpoints
			.map( ( responsiveBreakpoint ) =>
				getResponsiveValue( values, responsiveBreakpoint )
			)
			.find( Boolean ) || ''
	);
}

function hasPreviousLengthValue( values, breakpoint ) {
	const breakpointIndex = RESPONSIVE_ORDER.indexOf( breakpoint );
	return RESPONSIVE_ORDER.slice( 0, breakpointIndex ).some(
		( responsiveBreakpoint ) =>
			!! getResponsiveValue( values, responsiveBreakpoint )
	);
}

function setResponsiveLengthOption(
	config,
	option,
	values,
	breakpoint,
	directions
) {
	const value = getResponsiveValue( values, breakpoint );

	if ( value ) {
		config[ option ] = value;
		return;
	}

	const direction = getResponsiveDirection( directions, breakpoint );

	if ( direction === 'ttb' ) {
		const inheritedValue = getInheritedLengthValue( values, breakpoint );
		if ( inheritedValue && breakpoint !== 'desktop' ) {
			config[ option ] = inheritedValue;
		}
		return;
	}

	if (
		breakpoint !== 'desktop' &&
		hasPreviousLengthValue( values, breakpoint )
	) {
		config[ option ] = '';
	}
}

function getTrackPadding( padding, direction ) {
	const paddingConfig = {};
	const axis =
		direction === 'ttb' ? [ 'top', 'bottom' ] : [ 'left', 'right' ];

	axis.forEach( ( side ) => {
		if ( padding?.[ side ] ) {
			paddingConfig[ side ] = padding[ side ];
		}
	} );

	return Object.keys( paddingConfig ).length ? paddingConfig : null;
}

function getAutoScrollConfig( settings ) {
	return {
		speed: settings.autoScrollSpeed,
		pauseOnHover: true,
		pauseOnFocus: true,
		rewind: false,
	};
}

function isAutoScrollEnabled( settings, breakpoint ) {
	return getResponsiveValue(
		settings.autoScrollBreakpoints,
		breakpoint,
		getResponsiveValue( settings.autoScrollBreakpoints, 'desktop', true )
	);
}

function setAutoScrollConfig( config, settings, breakpoint ) {
	const enabled = isAutoScrollEnabled( settings, breakpoint );

	if ( enabled ) {
		config.type = 'loop';
		config.autoplay = false;
		config.arrows = false;
		config.pagination = false;
		config.drag = 'free';
		config.focus = 'center';
		config.autoWidth = config.direction !== 'ttb' && ! settings.fixedWidth;
		config.autoScroll = getAutoScrollConfig( settings );
		return;
	}

	config.type = settings.type;
	config.autoplay = settings.autoplay;
	config.arrows = settings.hasNavButtons;
	config.pagination = settings.hasPagination;
	config.drag = true;
	config.focus = 0;
	config.autoWidth = false;
	config.autoScroll = false;
}

export function createSplideConfig( settings, columns = null ) {
	const directions = normalizeResponsiveSetting(
		settings.direction,
		DEFAULT_DIRECTION
	);
	const heights = normalizeResponsiveSetting(
		settings.height,
		DEFAULT_RESPONSIVE_LENGTH
	);
	const fixedHeights = normalizeResponsiveSetting(
		settings.fixedHeight,
		DEFAULT_RESPONSIVE_LENGTH
	);
	const autoScrollBreakpoints = normalizeResponsiveSetting(
		settings.autoScrollBreakpoints,
		DEFAULT_RESPONSIVE_BOOLEAN
	);
	const configSettings = {
		...settings,
		direction: directions,
		height: heights,
		fixedHeight: fixedHeights,
		autoScrollBreakpoints,
	};
	const desktopDirection = getResponsiveDirection( directions, 'desktop' );
	const tabletDirection = getResponsiveDirection( directions, 'tablet' );
	const mobileDirection = getResponsiveDirection( directions, 'mobile' );
	const desktopPerPage =
		columns ||
		( settings.type === 'fade' ? 1 : settings.slidesPerPage.desktop );
	const tabletPerPage = columns || settings.slidesPerPage.tablet;
	const mobilePerPage = columns || settings.slidesPerPage.mobile;

	const splideConfig = {
		type: settings.type,
		speed: settings.speed,
		pagination: settings.hasPagination,
		arrows: settings.hasNavButtons,
		rewind: false,
		direction: desktopDirection,
		perPage: desktopPerPage,
		autoplay: settings.autoplay,
		pauseOnHover: settings.autoplay,
		interval: settings.interval + settings.speed,
		easing: settings.easing,
		gap: settings.gap,
		breakpoints: {
			[ BREAKPOINTS.tablet ]: {
				direction: tabletDirection,
				perPage: tabletPerPage,
			},
			[ BREAKPOINTS.mobile ]: {
				direction: mobileDirection,
				perPage: mobilePerPage,
			},
		},
	};

	setResponsiveLengthOption(
		splideConfig,
		'height',
		configSettings.height,
		'desktop',
		directions
	);
	setResponsiveLengthOption(
		splideConfig,
		'fixedHeight',
		configSettings.fixedHeight,
		'desktop',
		directions
	);
	Object.entries( BREAKPOINTS ).forEach( ( [ breakpoint, width ] ) => {
		setResponsiveLengthOption(
			splideConfig.breakpoints[ width ],
			'height',
			configSettings.height,
			breakpoint,
			directions
		);
		setResponsiveLengthOption(
			splideConfig.breakpoints[ width ],
			'fixedHeight',
			configSettings.fixedHeight,
			breakpoint,
			directions
		);
	} );

	if ( settings.autoScroll ) {
		setAutoScrollConfig( splideConfig, configSettings, 'desktop' );
		Object.entries( BREAKPOINTS ).forEach( ( [ breakpoint, width ] ) => {
			setAutoScrollConfig(
				splideConfig.breakpoints[ width ],
				configSettings,
				breakpoint
			);
		} );
	}

	if ( settings.hasThumbnailPagination ) {
		splideConfig.pagination = false;
		splideConfig.arrows = false;
		Object.values( BREAKPOINTS ).forEach( ( width ) => {
			splideConfig.breakpoints[ width ].pagination = false;
			splideConfig.breakpoints[ width ].arrows = false;
		} );
	}

	if ( settings.moveSlidesIndividually ) {
		splideConfig.perMove = 1;
		splideConfig.focus = 0;
	}

	if ( settings.fixedWidth ) {
		splideConfig.fixedWidth = settings.fixedWidth;
	}

	if ( settings.padding ) {
		const desktopPadding = getTrackPadding(
			settings.padding,
			splideConfig.direction
		);
		if ( desktopPadding ) {
			splideConfig.padding = desktopPadding;
		}
		Object.values( BREAKPOINTS ).forEach( ( width ) => {
			const breakpointPadding = getTrackPadding(
				settings.padding,
				splideConfig.breakpoints[ width ].direction
			);

			if ( breakpointPadding ) {
				splideConfig.breakpoints[ width ].padding = breakpointPadding;
			}
		} );
	}

	return splideConfig;
}
