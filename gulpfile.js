var fs           = require('fs'),
	argv         = require('yargs').argv,
	os           = require('os'),
	build        = require('./tools/build.js'),
	movefiles    = require('./tools/move-files.js'),
	pagename  = require('./tools/page-files.js'),

	gulp 		 = require('gulp'),
	shell        = require('gulp-shell'),
	rjs          = require('gulp-requirejs'),
	uglify       = require('gulp-uglify'),
	rename       = require('gulp-rename'),
	handlebars   = require('gulp-handlebars'),
	wrap         = require('gulp-wrap'),
	clean 		 = require('gulp-clean'),
	sass         = require('gulp-sass'),
	concat       = require('gulp-concat'),
	connect 	 = require('gulp-connect'),
	replace      = require('gulp-replace'),
	minifycss    = require('gulp-minify-css'),
	declare      = require('gulp-declare'),
	minifyHTML   = require('gulp-minify-html'),
	defineModule = require('gulp-define-module');

var dev = argv.dev,
	buildpath = './build/';

var d = new Date(),
    version = d.getTime();

if (dev == 'cp') {
	buildpath = build.dir().toString();
}

var task = {
	concat: function() {
		gulp.src('./lib/**/*.js')
			.pipe(concat('lib.pred.js'))
			.pipe(gulp.dest('./source/js/lib'))
	},


	rjs: function() {
	    rjs({
	        baseUrl: './lib',
	        out: 'js/lib.code.js',
	        include: [
	        	'jquery', 
	        	'underscore', 
	        	'backbone',
	        	'handlebars',
	        	'requirejs',
	        	'router',
	        	'lib.config',
	        	'Common'
	        ],
		    paths: {
		        'jquery':     'code/jquery-2.1.3.min',
		        'underscore': 'code/underscore-min-1.7.0',
		        'backbone':   'code/backbone-min-1.1.2',
		        'handlebars': 'code/handlebars-v2.0.0',
		        'requirejs':  'code/require-2.1.15',
		        'router':     '../source/js/Common/Router',
		        'Common':     '../source/js/Common/Common'
		    },
	        shim: {
		    	backbone: {
		    		'deps': ['jquery', 'underscore'],
		    		'exports': 'Backbone'
		    	},
		    	underscore: {
		    		'exports': '_'
		    	},
		        handlebars: {
		            exports: 'Handlebars',

		            init: function() {

		                this.Handlebars = Handlebars;

		                return this.Handlebars;
		                
		            }
		        }
	        }
	        // ... more require.js options 
	    })
		.pipe(uglify({outSourceMap: false}))
		.pipe(gulp.dest('./source/')); // pipe it to the output DIR 
	},
	move: function() {

		gulp.src('source/**/*.html')
			.pipe(replace(/\.css/g, '.css?v='+version))
			.pipe(replace(/\.js/g, '.js?v='+version))
			.pipe(gulp.dest(buildpath));

		gulp.src([
				'source/**/*.js',
				'!source/js/App.js',
				'!source/js/Config.js',
				'!source/js/Page/*.js',
				'!source/js/Common/Router.js',
				'!source/js/Common/Common.js',
				'!source/js/View/*.js',
				'!source/js/Layout/*.js',
				'!source/js/Model/*.js'
			])
			.pipe(uglify({outSourceMap: false}))
			.pipe(gulp.dest(buildpath));

		gulp.src('source/**/*.css')
			.pipe(minifycss())
			.pipe(gulp.dest(buildpath));
		
		gulp.src([
				'source/**/*.jpg',
				'source/**/*.png'
			])
			.pipe(gulp.dest(buildpath));
	},

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
	},

	sass: function(type) {
		var filePath = './source/';

		if (type == 'build') {

			filePath = buildpath;
			gulp.src('./source/themes/all.scss')
				.pipe(sass())
				.pipe(minifycss())
				.pipe(gulp.dest(filePath + 'themes'));

		} else {

			gulp.src('./source/themes/all.scss')
				.pipe(sass())
				.pipe(gulp.dest(filePath + 'themes'));

		}
	},


	/*
	* 框架内容生成
	* lib.frame.js
	*/ 
	createFrame: function(type) {
		var filePath = './source/',
			fileName = 'js/Frame.js',
			isBuild = 0;

		if (type == 'build') {
			filePath = buildpath;
			isBuild = version;
			fileName = 'js/lib.frame.js';
		}

	    rjs({
	        baseUrl: './lib',
	        out: fileName,
	        include: [
	        	'zepto', 
	        	'underscore', 
	        	'backbone',
	        	'handlebars',
	        	'requirejs',
	        	'lib.config'
	        ],
		    paths: {
		        'zepto':      'code/zepto.min-1.1.6',
		        'underscore': 'code/underscore-min-1.7.0',
		        'backbone':   'code/backbone-min-1.1.2',
		        'handlebars': 'code/handlebars-v2.0.0',
		        'requirejs':  'code/require-2.1.15'
		    },
	        shim: {
	        	zepto: {
	        		'exports': '$'
	        	},
		    	backbone: {
		    		'deps': ['zepto', 'underscore'],
		    		'exports': 'Backbone'
		    	},
		    	underscore: {
		    		'exports': '_'
		    	},
		        handlebars: {
		            exports: 'Handlebars',

		            init: function() {

		                this.Handlebars = Handlebars;

		                return this.Handlebars;
		                
		            }
		        }
	        }
	        // ... more require.js options 
	    })
		.pipe(uglify({outSourceMap: false}))
		.pipe(replace(/createMinFileVersion=0/g, 'createMinFileVersion='+ isBuild))
		.pipe(gulp.dest(filePath)); // pipe it to the output DIR 
	},


	/*
	* router文件对应 和 requirejs.config 生成
	* lib.config.js
	*/
	createConfig: function() {
		gulp.src([
				'source/js/App.js',
				'source/js/Config.js'
			])
			.pipe(uglify({outSourceMap: false}))
			.pipe(concat('lib.config.js'))
			.pipe(gulp.dest(buildpath + 'js/'))
	},

	/*
	* router 定义 和 common 函数生成
	* lib.common.js
	*/
	createRouter: function() {
		var strpath = {
	        'zepto':      'empty:',
	        'underscore': 'empty:',
	        'backbone':   'empty:',
	        'handlebars': 'empty:',
	        'require':    'empty:',

	        'router': 'js/Common/Router',
	        'Common': 'js/Common/Common'
		};

	    rjs({
	        baseUrl: './source/',
	        out: 'js/lib.common.js',
	        include: [
	        	'router', 
	        	'Common'
	        ],
		    paths: strpath
	    })
		.pipe(uglify({outSourceMap: false}))
		.pipe(gulp.dest(buildpath));
	},

	minrjs: function() {
		var strpath = {
	        'zepto':      'empty:',
	        'underscore': 'empty:',
	        'backbone':   'empty:',
	        'handlebars': 'empty:',
	        'require':    'empty:',

	        'router':     'empty:',
	        'Common':     'empty:'
		};

		// var files = [
		// 	'Page/List',
		// 	'Page/Add',
		// 	'Page/Comment',
		// 	'Page/Detail',
		// 	'Page/Login'
		// ];

		var files = pagename();

		files.forEach(function(name) {
		    rjs({
		        baseUrl: './source/js',
		        out: name + '.js',
		        include: [name],
			    paths: strpath
		    })
			.pipe(uglify({outSourceMap: false}))
			.pipe(gulp.dest(buildpath + 'js'));
		});
	},

	moveFile: function() {
		var opts = {comments:true,spare:true};

		// 移动HTML文件
		gulp.src('source/**/*.html')
			.pipe(replace(/\.css/g, '.css?v='+ version))
			.pipe(replace(/Frame\.js/g, 'lib.frame.js?v='+ version))
			.pipe(replace(/Config\.js/g, 'lib.config.js?v='+ version))
			.pipe(replace(/App\.js/g, 'lib.common.js?v='+ version))
			.pipe(minifyHTML(opts))
			.pipe(gulp.dest(buildpath));
		
		// 移动图片文件
		gulp.src([
				'source/**/*.jpg',
				'source/**/*.png'
			])
			.pipe(gulp.dest(buildpath));

	},

	connect: function(type) {

        var version = os.platform(),
        	url = '';

        connect.server({
            root: type,
            port: "9999",
            livereload: true
        });

        switch (version) {
            case 'win32':
                url = 'start http://localhost:9999';
                break;
            case 'darwin':
                url = 'open http://localhost:9999';
                break;
        }

        gulp.src('')
            .pipe(shell(url));
            
    },

    watch: function() {
    	var self = this;

    	gulp.watch([
    		'./source/**/*.hbs',
    		'./source/**/*.scss'
    	], function(obj) {
    		self.reload(obj);
    	})
    },

    reload: function(obj) {
    	var self = this;

    	console.log('\033[0;31m'+ obj.path +' \033[0;32mis changed!');

    	if (/\.scss/.test(obj.path)) {
			gulp.src('./source/themes/all.scss')
				.pipe(sass())
				.pipe(gulp.dest('./source/themes'));
    	}

    	if (/\.hbs/.test(obj.path)) {
			gulp.src(obj.path)
				.pipe(handlebars())
				.pipe(defineModule('amd'))
				.pipe(movefiles(function(path){
					// path.dirname = strpath;
					path.basename += '.hbs';
					path.extname = '.js'
				}))
				.pipe(gulp.dest(''));
    	}
    }
};


gulp.task('templates', function() {
	task.templates();
});

gulp.task('frame', function(){
	task.createFrame();
});


gulp.task('clean', function() {
	var strpath = [
			'./build/'
			// './source/**/*.hbs.js'
			// './source/js/lib.code.js',
			// './source/js/lib.config.js',
			// './source/**/*.min.js'
		];

	return gulp.src(strpath, {read: false})
		.pipe(clean());

});


gulp.task('run', ['clean'], function() {
	task.templates();
	task.createFrame();
	task.sass();
	task.connect('source');
	task.watch();
});

gulp.task('build', ['clean', 'templates'], function(){
	task.createFrame('build');
	task.createConfig();
	task.createRouter();
	task.sass('build');
	task.minrjs();
	task.moveFile();

	if (dev != 'cp') task.connect('build');
});
