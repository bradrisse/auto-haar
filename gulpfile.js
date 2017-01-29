var gulp = require('gulp');
var run = require('gulp-run');
var runSequence = require('run-sequence');
var imageResize = require('gulp-image-resize');
var rename = require("gulp-rename");
var request = require('request');
var source = require('vinyl-source-stream');
var gunzip = require('gulp-gunzip');
var untar = require('gulp-untar');
var flatten = require('gulp-flatten');
var del = require('del');

gulp.task('extract_negatives', function() {
    return request('http://www.vision.caltech.edu/Image_Datasets/Caltech101/101_ObjectCategories.tar.gz')
        .pipe(source('101_ObjectCategories.tar.gz'))
        .pipe(gunzip())
        .pipe(untar())
        .pipe(gulp.dest('output'))
});

gulp.task('clean_image_directories', function() {
    setTimeout(function() {
        var counter = 0;
        gulp.src(['output/101_ObjectCategories/**/*.jpg'])
            .pipe(rename(function(path) {
                path.basename = counter;
                counter++;
            }))
            .pipe(flatten())
            .pipe(gulp.dest('negative_images/'));
    }, 20000);

});

gulp.task('clean', function() {
    return del('output', { force: true });
});

gulp.task('create_directories', function() {
    return run('mkdir positive_images && mkdir negative_images && mkdir samples').exec();
});

gulp.task("resize_positive", function() {
    var counter = 0;
    gulp.src("positive_images/*.{jpg,png}")
        .pipe(imageResize({
            width: 100,
            height: 100,
            crop: true,
            upscale: true
        }))
        .pipe(rename(function(path) {
            path.basename = counter;
            counter++;
        }))
        .pipe(gulp.dest("resized_positive"));
});

//find all the .jpg images in the positive_images folder and create a list of all the image paths into positives.txt
gulp.task('positive_images', function() {
    return run('find ./resized_positive -iname "*.jpg" > positives.txt').exec();
});

//find all the .jpg images in the negative_images folder and create a list of all the image paths into negatives.txt
gulp.task('negative_images', function() {
    return run('find ./negative_images -iname "*.jpg" > negatives.txt').exec();
});

//take the small amount of positive images and create different variations
gulp.task('create_samples', function() {
    return run('perl bin/createsamples.pl positives.txt negatives.txt samples 1500 "opencv_createsamples -bgcolor 0 -bgthresh 0 -maxxangle 1.1 -maxyangle 1.1 maxzangle 0.5 -maxidev 40 -w 20 -h 20"', {silent: true}).exec();
});

//combine the samples into a single .vec file
gulp.task('combine_samples', function() {
    //wait 10s for the create_samples command to finish loading files into folder
    return run('python tools/mergevec.py -v samples/ -o samples.vec').exec();
});

//begin the training after all the required pieces are created and in place
gulp.task('start_training', function() {
    return run('opencv_traincascade -data classifier -vec samples.vec -bg negatives.txt -numStages 12 -minHitRate 0.999 -maxFalseAlarmRate 0.5 -numPos 1000 -numNeg 2000 -w 20 -h 20 -mode ALL -precalcValBufSize 1024 -precalcIdxBufSize 1024', {silent: false, verbosity: 3}).exec();
});




//get negative image dataset only once
gulp.task('prepare', function() {
    runSequence(['create_directories', 'extract_negatives', 'clean_image_directories'], function() {
        console.log('Preparation complete. Now process the images with `gulp process_images`');
    });
});

//build all the required pieces
gulp.task('process_images', function() {
    runSequence(['clean', 'resize_positive'], function() {
        console.log('Images Processed. Now build image map with `gulp build_image_map`');
    });
});

gulp.task('build_image_map', function() {
    runSequence(['positive_images', 'negative_images'], function() {
        console.log('Image map built. Now build samples with `gulp build_samples`');
    });
});

gulp.task('build_samples', function() {
    runSequence(['create_samples', 'combine_samples'], function() {
        console.log('Samples created. Now start training with `gulp run`');
    });
});

gulp.task('run', ['start_training'], function() {
    console.log('Training Complete.');
});
