/* esversion: 6 */
const grunt = require('grunt');
require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	concat: {
		options: {
			sourceMap: true
		},
		js: {
			src: ['src/logic.js', 'src/app.js'],
			dest: 'dev/<%= pkg.name %>.js'
		}
	},
	babel: {
		options: {
			sourceMap: true,
			inputSourceMap: true// it's default
		},
		dist: {
			files: {
				'dev/<%= pkg.name %>.dev.js': '<%= concat.js.dest %>'
			}
		}
	},
	uglify: {
		options: {
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
			sourceMap: true,
			sourceMapIn: 'dev/<%= pkg.name %>.dev.js.map'
		},
		dist: {
			files: {
				'dist/<%= pkg.name %>.min.js': 'dev/<%= pkg.name %>.dev.js'
			}
		}
	},
	jshint: {
		files: ['Gruntfile.js', 'src/**/*.js'],
		options: {
			// options here to override JSHint defaults
			globals: {
				jQuery: true,
				console: true,
				module: true,
				grunt: true,
				document: true
			},
			esversion: 6
		}
	},
	watch: {
		files: ['<%= jshint.files %>'],
		tasks: ['jshint', 'babel']
	}
});

grunt.registerTask('default', ['jshint', 'concat', 'babel', 'uglify']);

grunt.registerTask('watch', ['jshint', 'babel']);
