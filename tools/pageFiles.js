var fs      = require('fs'),
    project = require('../tools/project.js');

function getAllFiles () {
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