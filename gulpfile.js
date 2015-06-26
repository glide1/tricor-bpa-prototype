"use strict";

var gulp = require("gulp");
var ts = require("gulp-typescript");
var sourceMaps = require('gulp-sourcemaps');
var del = require('del');
var gls = require('gulp-live-server');
var nodemon = require('gulp-nodemon');

gulp.task('serve', ['build-server'], function() {
	nodemon({
		script: 'build/server/app.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'development' },
		execMap: {
			"js": "node"
		},
		watch: [
			'build/server/'
		]
	});
});

gulp.task('build-server', function() {
	var tsProject = ts.createProject('tsconfig.json', { typescript: require('typescript'), sourceMap: true, sortOutput: true });
	
	var tsResult = tsProject.src() 
		.pipe(sourceMaps.init())
        .pipe(ts(tsProject));
    
    return tsResult.js
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('build'));
});

gulp.task('watch-build', ['build-server'], function() {
	gulp.watch('server/**/*.ts', ['build-server']);
});

gulp.task('clean', function() {
	del(['build/*'], function(err, paths) {
		console.log('Deleted files/folders:\n', paths.join('\n'));
	});
});

gulp.task('test', ['build-server']);

gulp.task('build', ['build-server']);

gulp.task('default', ['watch-build', 'serve']);