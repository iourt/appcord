var fs   = require('fs'),
	argv = require('yargs').argv,
	os   = require('os');

var projectType = require('./tools/projectType.js'),
	build       = require('./tools/build.js'),
	movefiles   = require('./tools/moveFiles.js'),
	pagename    = require('./tools/pageFiles.js');

var gulp 		 = require('gulp');

var dev = argv.dev,
	buildPath = build().toString();

var d = new Date(),
    version = d.getTime();


var task = {
	templates: function() {
		gulp.src('./source/**/*.hbs')
			.pipe(handlebars())
			.pipe(defineModule('amd'))
			.pipe(movefiles(function(path){
				// path.dirname = strpath;
				path.basename += '.hbs';
				path.extname = '.js'
			}))
			.pipe(gulp.dest(''))
	}
}

gulp.task('default', function(){
	console.log(buildPath);
});