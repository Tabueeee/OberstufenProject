var glob = require('glob');
var del  = require('del');


var deleteFilesByGlob = function () {
    const deleteFiles = function (path, done) {
        glob('src/**/*.js', {}, function (err, files) {
            if (typeof err !== 'undefined') {
                done(err);
            }

            del(files, function () {
                done();
            });
        })
    };

    return {
        'deleteFiles': deleteFiles
    };
};

module.exports = deleteFilesByGlob;
