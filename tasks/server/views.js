var gulp = require('gulp');
var plumber = require('./../plumber-wrapper');
var config = require('./../config');

gulp.task('server.views', function () {
    return gulp.src(config.src.views)
        .pipe(plumber())
        .pipe(gulp.dest(config.dest.bin));
});
