# HM Carousel Block

HM Carousel Block is a lightweight WordPress plugin designed to add a carousel block to modern WordPress sites. It uses the Splide library, which is lightweight (12kB gzipped) and accessible.

## Features

- Lightweight with no dependencies
- Uses Splide library for carousel functionality
- Accessible and responsive design
- Easy to use and customize
- Allows you to put any blocks or patterns in carousel slides
- Supports using the Query Loop block to create a carousel of posts
- Supports various navigation types (button, pagination, and thumbnails)
- Bring your own styles. We only load the minimal core splide CSS needed to function. You can style everything else as you wish. More info below.

## Installation

1. Download the plugin zip file.
2. In your WordPress admin panel, go to Plugins > Add New.
3. Click "Upload Plugin" and choose the downloaded zip file.
4. Click "Install Now" and then "Activate" the plugin.

## Usage

1. In the WordPress editor, add a new block.
2. Search for "Carousel" and add it to your page or post.
3. Note that the view in the editor is a simplified version for ease of managing the content.
4. Add Carousel Slide blocks to the carousel. You can then add whatever content you wish to these.
5. Customize the carousel settings as needed.

## Styling

The recommended approach is to register a new block stylesheet with your custom CSS. This ensures it is only loaded when the block is on the page.

This code demnstrates how to do this for a CSS file build using `@wordpress/scripts`.

```php
$filename = 'custom-carousel-styles';
$asset = require get_stylesheet_directory() . "/build/css/{$filename}.css.asset.php";

wp_enqueue_block_style(
	'hm/carousel,
	[
		'handle' => "my-project-{$filename}",
		'src'    => get_theme_file_uri( "build/css/{$filename}.css.css" ),
		'path'   => get_theme_file_path( "build/css/{$filename}.css.css" ),
		'ver'    => $asset['version'],
		'deps'   => $asset['dependencies'],
	]
);
```

## License

This plugin is licensed under the GPL v2 or later. The Splide library used in this plugin is licensed under the MIT License.

## Credits

- [Splide](https://splidejs.com/) - A lightweight, flexible, and accessible slider/carousel library.

## Releasing a new version

To ensure built scripts are included releases should be done from the `release` branch.

Run `npm run release` to update the release branch with the current state of `main`, run build scripts and commit the build files.

From github, create a new release and tag as appropriate. Make sure to set the target branch as `release`.
