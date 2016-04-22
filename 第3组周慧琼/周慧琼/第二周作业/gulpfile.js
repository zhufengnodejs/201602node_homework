var gulp = require('gulp'),
    minCss = require('gulp-minify-css');//压缩css文件
gulp.task('minify-css',function(){
    gulp.src('public/css/*.css')
        .pipe(minCss())
        .pipe(gulp.dest('public/minCss'));
});
gulp.task('watch',function(){
    return gulp.watch('public/css/*.css',['minify-css'])
})