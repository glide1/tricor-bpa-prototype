/* jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var ts = require("gulp-typescript");
var sourceMaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var del = require('del');
var nodemon = require('gulp-nodemon')
var watch = require('gulp-watch');

var typescriptGlobs = ['./**/*.ts', '!typings/**/*.ts', '!libs/**/*.ts', '!node_modules/**'];
var typescriptClientLocation = 'build/client/scripts/**/*.js';

gulp.task('styles', function () {
    return gulp.src('client/styles/main.scss')
        .pipe($.debug({ title: 'styles-in:'}))
        .pipe(sass({
            style: 'expanded',
            errLogToConsole: true,
            precision: 10
        }).on('error', sass.logError))
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.debug({ title: 'styles-out:'}));
});

gulp.task('jshint', function () {
    return gulp.src('client/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['styles'], function () {
    var lazypipe = require('lazypipe');
    var cssChannel = lazypipe()
        .pipe($.csso)
        .pipe($.replace, 'libs/bootstrap-sass-official/assets/fonts/bootstrap', 'fonts');
    var assets = $.useref.assets({searchPath: '{.tmp,client,build/client}'});

    return gulp.src('client/*.html')
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', cssChannel()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('client/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
    return gulp.src(require('main-bower-files')().concat('client/fonts/**/*'))
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
    return gulp.src([
        'client/*.*',
        '!client/*.html',
        'node_modules/apache-server-configs/dist/.htaccess'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', 'build/*']));

gulp.task('serve', ['build-typescript', 'watch'], function () {
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

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('client/styles/*.scss')
        .pipe(wiredep())
        .pipe(gulp.dest('client/styles'));

    gulp.src('client/*.html')
        .pipe(wiredep({exclude: ['bootstrap-sass-official']}))
        .pipe(gulp.dest('client'));
});

gulp.task('watch', function () {
    $.livereload.listen();

    // watch for changes
    gulp.watch([
        'client/*.html',
        '.tmp/styles/**/*.css',
        'client/scripts/**/*.js',
        'client/images/**/*',
        typescriptClientLocation
    ]).on('change', $.livereload.changed);

    gulp.watch('client/styles/**/*.scss', ['styles']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['build-typescript', 'html', 'images', 'fonts', 'extras'], function () {
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('lint', ['build', 'jshint']);

gulp.task('default', ['watch-build', 'styles', 'serve']);

var tsProject = ts.createProject('tsconfig.json', { typescript: require('typescript'), sourceMap: true, sortOutput: true });

gulp.task('build-typescript', function() {
  var tsResult = gulp.src(typescriptGlobs)
    .pipe($.debug({ title: 'build-typescript: in' }))
    .pipe(sourceMaps.init())
    .pipe(ts(tsProject));

  return tsResult.js
    .pipe(sourceMaps.write())
    .pipe($.changed('build', {hasChanged: $.changed.compareSha1Digest}))
    .pipe(gulp.dest('build'))
    .pipe($.debug({ title:'build-typescript: out' }));
});

var testTsProject = ts.createProject('tsconfig.json', { typescript: require('typescript'), sourceMap: true, sortOutput: true });

gulp.task('build-tests', ['build-typescript'], function() {

   var tsProject = testTsProject;
   var testGlob = 'test/unit/**/*.ts';

   console.log("building changes on " + testGlob);

   var tsResult = gulp.src(testGlob)
    .pipe($.debug({title:'build-tests'}))
    .pipe(sourceMaps.init())
    .pipe(ts(tsProject));

   return tsResult.js
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('build'));
});

gulp.task('unit-test', ['build-tests'], function() {
   var testGlob = 'build/test/unit/**/*.js';
   return gulp.src([testGlob], {read: false})
    .pipe($.debug({ title: 'unit-test' }))
    .pipe($.mocha({ reporter: 'spec' }))
    .on('error', $.util.log);
});

gulp.task('watch-unit-test', function() {
   var tsTestGlob = 'test/unit/**/*.ts';
   gulp.watch([tsTestGlob], ['unit-test']);
});

gulp.task('watch-build', ['build-typescript'], function() {
  gulp.watch(typescriptGlobs, ['build-typescript']);
});

gulp.task('test', ['unit-test', 'build-tests']);

gulp.task('ctest', ['build-tests', 'unit-test', 'watch-unit-test']);
