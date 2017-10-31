var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var plumber = require('./../plumber-wrapper');
var config = require('./../config');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var sourceMaps = require('gulp-sourcemaps');
var rebaseUrl = require('gulp-css-rebase-urls');
var autoprefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var del = require('del');
var _if = require('gulp-if');


var filters = {
    js: {
        base: filter('**/*.js'),
        bootstrap: filter(['**/jquery.bootstrap*','**/bootstrap*', 'font-awesome*']),
        jquery: filter(['**/jquery*', '**/ui/*'])
    },
    css: {
        base: filter('*.css'),
        bootstrap: filter(['**/jquery.bootstrap*', '**/bootstrap*', 'font-awesome*']),
        jquery: filter(['**/jquery*', '**/ui/*'])
    },
    fonts: filter(['*.otf', '*.eot', '*.svg', '*.ttf', '*.woff', '*.woff2']),
    images: filter(['*.png', '*.jpg', '*.gif'])
};

var bowerFiles = mainBowerFiles();

gulp.task('bower.scripts', function() {
    return gulp.src(bowerFiles, {base: config.src.bower})
        .pipe(plumber())
        .pipe(filters.js.base)

        .pipe(_if(!config.isProduction, sourceMaps.init()))
        .pipe(filters.js.bootstrap)
        .pipe(concat('bootstrap-custom.js'))
        .pipe(filters.js.bootstrap.restore())

        .pipe(filters.js.jquery)
        .pipe(concat('jquery-custom.js'))
        .pipe(filters.js.jquery.restore())

        .pipe(flatten())

        .pipe(uglify())
        .pipe(_if(!config.isProduction, sourceMaps.write('./maps')))
        .pipe(gulp.dest(config.dest.lib));
});

gulp.task('bower.styles', ['bootstrap'], function() {
    return gulp.src(bowerFiles.concat(config.dest.lib + '/bootstrap.css'), {base: config.src.bower})
        .pipe(plumber())
        .pipe(flatten())
        .pipe(filters.css.base)

        .pipe(rebaseUrl())
        .pipe(autoprefix(config.pluginsOptions.autoprefix))
        .pipe(minifyCss(config.pluginsOptions.cleancss))

        .pipe(filters.css.bootstrap)
        .pipe(concat('bootstrap-custom.css'))
        .pipe(filters.css.bootstrap.restore())

        .pipe(filters.css.jquery)
        .pipe(concat('jquery-custom.css'))
        .pipe(filters.css.jquery.restore())

        .pipe(gulp.dest(config.dest.lib))
        .pipe(filters.css.base.restore());
});

gulp.task('bower.fonts', function() {
    return gulp.src(bowerFiles, {base: config.src.bower})
        .pipe(plumber())
        .pipe(flatten())

        .pipe(filters.fonts)
        .pipe(gulp.dest(config.dest.lib + '/fonts'));
});

gulp.task('bower.images', function() {
    return gulp.src(bowerFiles, {base: config.src.bower})
        .pipe(plumber())
        .pipe(flatten())

        .pipe(filters.images)
        .pipe(gulp.dest(config.dest.lib + '/img'))
});

gulp.task('bower.clean', function() {
    del([config.dest.lib + '/bootstrap.css'])
});

gulp.task('bower', ['bower.scripts', 'bower.styles', 'bower.fonts', 'bower.images'], function() {
    gulp.start('bower.clean');
});