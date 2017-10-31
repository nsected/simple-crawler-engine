var gulp = require('gulp');
var config = require('./config');

gulp.task('watches', function()
{
    gulp.watch(config.src.bower + 'bower_components/**/*.*', ['bower']);

    gulp.watch('src/client/styles/bootstrap/variables.less', ['bower.styles']);

    gulp.watch(config.src.scripts[0], ['client.ts']);

    gulp.watch(['src/client/styles/**/*.less'], ['client.less']);

    gulp.watch(config.src.images, ['client.images']);

    gulp.watch(config.src.fonts, ['client.fonts']);

    gulp.watch(config.src.server, ['server.ts']);

    gulp.watch(config.src.views, ['server.views']);
});