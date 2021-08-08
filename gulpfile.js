// Variables
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass')(require("node-sass"));
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');

// Tasks
// Browser reload
gulp.task('browserSync', function () {
    browserSync.init({
      server: {
      baseDir: 'app'
      },
    })
})

// Scss
gulp.task('sass', () => {
    return gulp.src('app/scss/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
            stream: true
      }))
});

// Minfy js
gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});
gulp.task('useref', function(){
    return gulp.src('app/*.html')
      .pipe(useref())
      // Minifies only if it's a JavaScript file
      .pipe(gulpIf('*.js', uglify()))
      .pipe(gulp.dest('dist'))
});

// Minfy css
gulp.task('useref', function(){
    return gulp.src('app/*.html')
      .pipe(useref())
      .pipe(gulpIf('*.js', uglify()))
      // Minifies only if it's a CSS file
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

// Watch processes
gulp.task('watch', gulp.series('browserSync', 'sass'), function (){
    gulp.watch('app/scss/**/*.scss', ['sass']); 
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/*.html', browserSync.reload); 
    gulp.watch('app/js/**/*.js', browserSync.reload); 
});
// gulp.task('default', function (callback) {
//     runSequence(['sass','browserSync', 'watch'],
//       callback
//     )
// });

// Building project
gulp.task('build', function (callback) {
    runSequence('clean:dist', 
      gulp.series('sass', 'useref'),
      callback
    )
});