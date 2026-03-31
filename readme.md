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

## Using with Query Loop & Arrow Position

You can use the Carousel block to display posts from a Query Loop. To do this:

1. Add the Carousel block to your page or post.
2. Select the "Articles Carousel" variation when inserting the block, or add a Query Loop block inside the carousel manually.
3. The carousel will automatically detect the number of columns set in the Query Loop (e.g., columns-2, columns-3) and use that as the number of slides per page.
4. To set the arrow position, open the block settings sidebar, enable navigation buttons, and choose the desired Arrow Position (Default, Top Left, Top Right, Bottom Left, Bottom Right). The arrows will be positioned accordingly.

### Articles Carousel Variation

The block provides a variation called "Articles Carousel" for quickly creating a carousel of posts using the Query Loop. This variation is optimized for displaying articles and automatically configures the Query Loop inside the carousel.

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

## Release Process

Merges to `main` will automatically [build](https://github.com/humanmade/hm-carousel-block/actions/workflows/build-release-branch.yml) to the `release` branch. A project may be set up to track the `release` branch using [composer](http://getcomposer.org/) to pull in the latest built beta version.

Commits on the `release` branch may be tagged for installation via [packagist](https://packagist.org/packages/humanmade/hm-carousel-block) and marked as releases in GitHub for manual download using a [manually-dispatched "Tag and Release" GH Actions workflow](https://github.com/humanmade/hm-carousel-block/actions/workflows/tag-and-release.yml).

To tag a new release,

1. Review the unreleased features in the [Changelog](./CHANGELOG.md) and choose the target version number for the next release using [semantic versioning](https://semver.org/)
2. Checkout a `prepare-v#.#.#` branch. In that branch,
   - Add a new header into [CHANGELOG.md](./CHANGELOG.md) for any unreleased features
   - Bump the version number in the [hm-carousel-block.php](./hm-carousel-block.php) file's PHPDoc header
3. Open a pull request from your branch titled "Prepare release v#.#.#"
4. Review and merge your "Prepare release" pull request
5. Wait for the `release` branch to [update](https://github.com/humanmade/hm-carousel-block/actions/workflows/build-release-branch.yml) with the build that includes the new version number
6. On the ["Tag and Release" GH Action page](https://github.com/humanmade/hm-carousel-block/actions/workflows/tag-and-release.yml)],
   - Click the "Run workflow" button in the "workflow_dispatch" notification banner (see screenshot below)
   - Fill out the "Version tag" field with your target version number
	  - This version must match the version in `hm-carousel-block.php` and your newest Changelog section
	  - Use the format `v#.#.#` for your version tag
   - Leave the "Branch to tag" field as `release` (we will add the tag on the release branch containing the latest built code)
   - Click "Run workflow"

![Screenshot of Run workflow dropdown form being filled out](./.github/docs/release-tagging-action.jpg)

Once the workflow completes, your new version should be [tagged](https://github.com/humanmade/hm-carousel-block/tags) and available in the list of [releases](https://github.com/humanmade/hm-carousel-block/releases)

## Local Development

We recommend cloning this repository into your active project (or installing the repository via composer with `composer update humanmade/hm-carousel-block --prefer-source`) so that feature development can be tested in the context of full applications, but this repository does support a lightweight [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/) development environment for testing within a vanilla, un-customized WordPress installation.

After running the `env:start` script, your site will start at [localhost:2001](http://localhost:2001). Log in with `admin` / `password` at [localhost:2001/wp-admin](http://localhost:2001/wp-admin).

Command                   | Description
------------------------- | -----------
npm run env:start         | Start a local docker-based WordPress environment
npm run env:stop          | Turn off the WordPress environment
npm run env:cli -- wp ... | Run any WP-CLI command within your environment
npm run env:destroy       | Delete the local wp-env docker environment and clean images and containers

## License

This plugin is licensed under the GPL v2 or later. The Splide library used in this plugin is licensed under the MIT License.

## Credits

- [Splide](https://splidejs.com/) - A lightweight, flexible, and accessible slider/carousel library.
