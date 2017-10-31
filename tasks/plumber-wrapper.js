var plumber = require('gulp-plumber');

module.exports = function () {

    return plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    });

};