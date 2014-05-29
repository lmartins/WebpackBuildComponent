'use strict';

var gulp            = require('gulp'),
    gutil           = require('gulp-util'),
    sass            = require('gulp-sass'),
    prefix          = require('gulp-autoprefixer'),
    component       = require('gulp-component'),
    componentcoffee = require('component-coffee'),
    webpack         = require('webpack'),
    webpackConfig   = require("./webpack.config.js"),
    webpackCompiler,
    plumber         = require('gulp-plumber'),
    changed         = require('gulp-changed'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    connect         = require('gulp-connect'),
    watch           = require('gulp-watch'),
    notify          = require('gulp-notify'),
    info            = require('./package.json');

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

// SERVER ---------------------------------------------------------------------
gulp.task('connect', function() {
  connect.server({
    // root: './'
    port: 8080,
    livereload: true
  });
});

// SASS -----------------------------------------------------------------------
gulp.task('sass', function() {
  gulp.src( config.SASS.src )
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'normal'
      }))
    .on("error", notify.onError())
    .on("error", function (err) {
      console.log("Error:", err);
    })
    .pipe(prefix( "last 1 version" ))
    .pipe(gulp.dest( config.SASS.build ))
    .pipe(connect.reload());
});




// WEBPACK ------------------------------------------------------------------

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

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function() {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) {
      throw new gutil.PluginError("webpack:build-dev", err)
    }
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
	});

});

// gulp.task('js', function () {
//   gulp.src( config.JS.build )
//     .pipe(connect.reload());
// });


// COMPONENT ------------------------------------------------------------------
gulp.task('component-js', function () {
  gulp.src( config.COMPONENT.manifest )
    .pipe(component.scripts({
      standalone: false,
      configure: function (builder) {
        builder.use( componentcoffee )
      }
    }))
    .pipe(gulp.dest( config.COFFEE.build ))
})

gulp.task('component-css', function () {
  gulp.src( config.COMPONENT.manifest )
    .pipe(component.styles({
      configure: function (builder) {
        builder.use( sass )
      }
    }))
    .pipe(gulp.dest( config.SASS.build ))
})


// BOWER ----------------------------------------------------------------------
gulp.task ('bowerCopy', function () {
  gulp.src ([
      'src/vendor/jquery/dist/jquery.js',
      'src/vendor/backbone/backbone.js',
      'src/vendor/underscore/underscore.js'
      ])
    .pipe (uglify())
    .pipe (gulp.dest( "build/vendor/" ))
});

gulp.task ('bowerMerge', function () {
  gulp.src ([
      'src/vendor/jquery-easing/jquery.easing.js'
    ])
    .pipe (concat ("bundle.js"))
    .pipe (uglify())
    .pipe (gulp.dest ("build/vendor/"))
});

gulp.task('bower', [ 'bowerCopy', 'bowerMerge' ]);



// HTML -----------------------------------------------------------------------
gulp.task('html', function () {
  gulp.src( config.HTML.src )
    .pipe(connect.reload());
});

// ENVIRONMENT CONFIG ---------------------------------------------------------

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
});

gulp.task('set-env-prod', function() {
  config.webpack = {
    cache: true,
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


// GLOBAL TASKS ---------------------------------------------------------------

// gulp.task('component', [ 'component-js', 'component-css' ]);

gulp.task('watch', function () {
  gulp.watch( config.HTML.src , ['html']);
  gulp.watch( config.JS.src , ["webpack"]);
  // gulp.watch( config.JS.build , ["js"]);
  gulp.watch( [config.COMPONENT.manifest, config.COMPONENT.src] , ['component-js', 'component-css']);
  // gulp.watch(config.IMAGE_SOURCE, ['images']);
  gulp.watch( config.SASS.src , ['sass']  );
});

gulp.task('default', ['prod'] );
gulp.task('dev', ['set-env-dev', 'connect', 'watch'] );
gulp.task('prod', ['set-env-prod', 'connect', 'watch'] );



// main tasks
// gulp.task('development', ['set-env-dev', 'webpack', 'flo'], function() {
//   gulp.watch( config.JS.src , ['webpack']);
// });
// gulp.task('production', ['set-env-prod'], function() {});
