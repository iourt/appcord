var fs      = require('fs'),
    project = require('../tools/getProject.js');

function getAllFiles (type) {

    switch (type) {
        // ./source/*projectname*/js/page/*.js
        case 1: 
            var prj = project(),
                result = {};

            prj.forEach(function(v){
                result[v] = [];

                var path = './source/'+ v +'/js/page',
                    files = fs.readdirSync(path);

                files.forEach(function(file){
                    var pathname = path + '/' + file,
                        stat = fs.lstatSync(pathname);

                    if (stat === undefined) return;

                    if (!stat.isDirectory() && /\.js/.test(file)) {
                        var name = file.replace('\.js', '');

                        result[v].push(name);
                    }
                });
            });
        break;


        // ./source/common/*.js
        case 2:
            var result = [],
                path = './source/common',
                files = fs.readdirSync(path);

            files.forEach(function(file){
                var pathname = path + '/' + file,
                    stat = fs.lstatSync(pathname);

                if (stat === undefined) return;

                if (!stat.isDirectory() && /\.js/.test(file)) {
                    var name = file.replace('\.js', '');

                    result.push(name);
                }
            });
        break;

        // ./source/*projectname*/js/common/*.js
        case 3:
            var prj = project(),
                result = {};

            prj.forEach(function(v){
                result[v] = [];

                var path = './source/'+ v +'/js/common',
                    files = fs.readdirSync(path);

                files.forEach(function(file){
                    var pathname = path + '/' + file,
                        stat = fs.lstatSync(pathname);

                    if (stat === undefined) return;

                    if (!stat.isDirectory() && /\.js/.test(file)) {
                        var name = file.replace('\.js', '');

                        result[v].push(name);
                    }
                });
            });
        break;
    }

    // var root = './source/js/Page',
    // 	result = [],
    // 	files = fs.readdirSync(root);

    // files.forEach(function(file){
    // 	var pathname = root + '/' + file,
    // 		stat = fs.lstatSync(pathname);

    // 	if (stat === undefined) return;

    //    	if (!stat.isDirectory() && /\.js/.test(file)) {
    //    		var name = 'Page/' + file.replace('\.js', '');

    //      		result.push(name);
    //      	}
    // });

	return result;
}

module.exports = getAllFiles;