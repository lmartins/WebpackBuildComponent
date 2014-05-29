'use strict';

var info = require('./package.json');

var fs = require('fs');
var flo = require('fb-flo');
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackCompiler;

// common config
var config = {

	JS: {
		src: ["src/JS/**/*.js"],
		build: "build/js/"
	},

	COMPONENT: {
		manifest: "component.json",
		// este src é usado para fazer watching de components pessoais
		src: ["mycomponents/**/*.coffee", "mycomponents/**/*.js", "mycomponents/**/*.css"],
		build: "build/css/"
	},

	HTML:{
		src: ['*.html','lab/**/*.html']
	},

	SASS: {
		src: "src/sass/**/*.scss",
		build: "build/css/"
	},

	IMAGES: {
		src    : "src/images/**/*",
		build  : "build/images",
	},

	LIVE_RELOAD_PORT: 35728

}


gulp.task('webpack', function(callback) {
	webpackCompiler.run(function(err, stats) {
		if (err) {
			throw new gutil.PluginError('webpack', err);
		}

		gutil.log('webpack', stats.toString({
			colors: true,
		}));

		callback();
	});
});

gulp.task('flo', function() {
	flo(
		'./',
		{
			port: 8888,
			host: 'localhost',
			glob: [
				'**/*.{css,html}',
				'**/main.bundle.js',
			]
		},
		function(filepath, callback) {
			gutil.log('Reloading \'' + gutil.colors.cyan(filepath) + '\' with flo...');
			callback({
				resourceURL: '/' + filepath,
				contents: fs.readFileSync('./' + filepath).toString(),
				reload: filepath.match(/\.(js|html)$/),
			});
		});
})

// handle dev/prod config
gulp.task('set-env-dev', function() {
	config.webpack = {
		cache: true,
		debug: true,
		devtool: 'source-map',
		entry: {
			main: './src/js/main.js',
		},
		output: {
			path: config.JS.build ,
			filename: '[name].bundle.js',
			chunkFilename: '[id].chunk.js',
			publicPath: '/static/js/',
		},
		plugins: [
			new webpack.BannerPlugin(info.name + '\n' + info.version + ':' + Date.now() + ' [development build]'),
			new webpack.DefinePlugin({
				DEV: true,
			}),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
			}),
		]
	};
	webpackCompiler = webpack(config.webpack);
})

gulp.task('set-env-prod', function() {
	config.webpack = {
		cache: true,
		entry: {
			main: __assets_src + 'js/main.js',
		},
		output: {
			path: __assets_dest + 'js/',
			filename: '[name].bundle.js',
			chunkFilename: '[id].chunk.js',
			publicPath: '/static/js/',
		},
		plugins: [
			new webpack.BannerPlugin(info.name + '\n' + info.version + ':' + Date.now() + ' [production build]'),
			new webpack.DefinePlugin({
				DEV: false,
			}),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
			}),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.AggressiveMergingPlugin(),
			new webpack.optimize.UglifyJsPlugin()
		]
	};
	webpackCompiler = webpack(config.webpack);
});


// main tasks
gulp.task('development', ['set-env-dev', 'webpack', 'flo'], function() {
	gulp.watch( config.JS.src , ['webpack']);
});
gulp.task('production', ['set-env-prod'], function() {});
