var fs = require('fs');

function getProject () {
	var root    = './source/',
        exclude = ['common', 'library', 'themes'],
		result  = [],
		files   = fs.readdirSync(root);

	files.forEach(function(file){
		var pathname = root + '/' + file,
			stat = fs.lstatSync(pathname);

		if (stat === undefined) return;

        // if (stat.isDirectory() && /\.js/.test(file)) {
        //     var name = 'Page/' + file.replace('\.js', '');

        //     result.push(name);
        // }

        if (stat.isDirectory() && !/common/.test(file) && !/library/.test(file) && !/themes/.test(file)) {
            result.push(file);
        }
	});

	return result;
}

module.exports = getProject;