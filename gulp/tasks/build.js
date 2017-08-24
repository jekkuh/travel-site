var gulp = require('gulp'),
imagemin = require('gulp-imagemin'),
del = require('del'),
usemin = require('gulp-usemin'),
rev = require('gulp-rev'),
cssnano = require('gulp-cssnano'),
uglify = require('gulp-uglify'),
browserSync = require("browser-sync").create();

// copied browserSync so we can preview dist file to make sure all is good
// in command line use gulp previewDist
gulp.task('previewDist', function() {
    browserSync.init({
        notify: false,
        server: {
            baseDir: "docs"
        }
    });
 
});

// delete dist folder and start fresh when making & saving changes
gulp.task('deleteDistFolder', ['icons'], function(){
   return del("./docs"); 
});


// this is for other files you'd want to move into dist folder from main app folder
// created an array of paths to exclude because they're already taken care of
// & so we could comfortably fit into gulp.src()
gulp.task('copyGeneralFiles', ['deleteDistFolder'], function(){
   var pathsToCopy = [
       './app/**/*',
       '!./app/index.html',
       '!./app/assets/images/**',
       '!./app/assets/styles/**',
       '!./app/assets/scripts/**',
       '!./app/assets/temp',
       '!./app/temp/**'
   ]
    return gulp.src(pathsToCopy)
    .pipe(gulp.dest("./docs"));
});

// copy all image files over to dist folder & compress before reach dest
gulp.task('optimizeImages', ['deleteDistFolder'], function(){
   return gulp.src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
    .pipe(imagemin({
       progressive: true,
       interlaced: true,
       multipass: true
   }))
    .pipe(gulp.dest("./docs/assets/images"));
});

gulp.task('useminTrigger', ['deleteDistFolder'], function() {
   gulp.start("usemin"); 
});

// usemin to copy html to dist folder 
gulp.task('usemin', ['styles', 'scripts'], function(){
   return gulp.src("./app/index.html")
        .pipe(usemin({
       css: [function() {return rev()}, function() {return cssnano()}],
       js: [function() {return rev()}, function() {return uglify()}]
   }))
       .pipe(gulp.dest("./docs"));
});


gulp.task('build', ['deleteDistFolder', 'copyGeneralFiles', 'optimizeImages', 'useminTrigger']);