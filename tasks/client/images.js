var gulp = require('gulp');
var plumber = require('./../plumber-wrapper');
var config = require('./../config');

gulp.task('client.images', function () {
    return gulp.src(config.src.images)
        .pipe(plumber())
        .pipe(gulp.dest(config.dest.public + '/img'));
});
