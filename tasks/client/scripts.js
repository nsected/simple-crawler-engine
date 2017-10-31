var gulp = require('gulp');
var sourceMaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var _if = require('gulp-if');
var ts = require('gulp-typescript');
var config = require('./../config');
var plumber = require('./../plumber-wrapper');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');



gulp.task('client.ts', function () {
    var bundles = {
        main: filter('**/_main/**/*.js')
    };

    return gulp.src(config.src.scripts)
        .pipe(plumber())
        .pipe(_if(!config.isProduction, sourceMaps.init()))
        .pipe(ts({
            target: 'ES5',
            module: 'commonjs',
            noExternalResolve: true,
            isolatedModules: true,
            removeComments: true
        }))

        .pipe(bundles.main)
        .pipe(concat('main.js'))
        .pipe(bundles.main.restore())

        .pipe(uglify())
        .pipe(_if(!config.isProduction, sourceMaps.write('./maps')))
        .pipe(gulp.dest(config.dest.assets + '/js'));
});