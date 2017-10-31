var less = require('gulp-less');
var gulp = require('gulp');
var config = require('./../config');
var plumber = require('./../plumber-wrapper');
var del = require('del');

gulp.task('bootstrap.prepare', function() {
    var src = [
        config.src.bower + '/bootstrap/less/**/*.less',
        '!src/client/styles/bootstrap/less/variables.less'
    ].concat(config.src.bootstrapAdvFiles);
    return gulp.src(src)
        .pipe(plumber())
        .pipe(gulp.dest(config.dest.lib + '/bootstrap'));
});

gulp.task('bootstrap.compile', ['bootstrap.prepare'], function() {
    return gulp.src(config.dest.lib + '/bootstrap/bootstrap.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(config.dest.lib));
});

gulp.task('bootstrap.clean', function(cb) {
    del([config.dest.lib + '/bootstrap'], cb)
});

gulp.task('bootstrap', ['bootstrap.compile'], function() {
    gulp.start('bootstrap.clean');
});