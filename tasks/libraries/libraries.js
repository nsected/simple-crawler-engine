var less = require('gulp-less');
var gulp = require('gulp');
var config = require('./../config');
var plumber = require('./../plumber-wrapper');
var del = require('del');

gulp.task('libraries', function() {
    var src = [config.src.libraries + '/**'];
    return gulp.src(src)
        .pipe(plumber())
        .pipe(gulp.dest(config.dest.lib));
});

gulp.task('libraries.clean', function(cb) {
    del([config.dest.lib], cb)
});