var fs = require('fs');

var dir = function() {
    var file = './tools/.build',
        dir = './www/',
        exists = fs.existsSync(file);

    if (exists) {
        dir = fs.readFileSync(file);
    }

    return dir;
};

exports.dir = dir; 