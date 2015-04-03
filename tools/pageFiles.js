var fs = require('fs');

function getAllFiles () {
	var root = './source/js/Page',
		result = [],
		files = fs.readdirSync(root);

	files.forEach(function(file){
		var pathname = root + '/' + file,
			stat = fs.lstatSync(pathname);

		if (stat === undefined) return;

    	if (!stat.isDirectory() && /\.js/.test(file)) {
    		var name = 'Page/' + file.replace('\.js', '');

      		result.push(name);
      	}
	});

	return result;
}

module.exports = getAllFiles;