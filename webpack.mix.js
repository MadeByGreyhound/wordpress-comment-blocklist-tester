let mix = require('laravel-mix');

mix
	.options({
		processCssUrls: false
	})
	.js( 'src/js/main.js', 'js' )
	.vue()
	.setPublicPath( 'build' );
