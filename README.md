# auto-haar
An automated haar classifier wrapper that takes the guess work out of creating a classifier. Why? Well because when I wanted to create my first haar classifier there were scattered terminal commands and things to download in different places to make it work. After I successfully got a working model I automated it.

## Pre-Requisites 

- homebrew
- nodejs
- gulp

## Libraries
- To train a haar classifier you need opencv and to modify images before training you need imagemagick and graphicsmagick

```brew tap homebrew/science```

```brew install --with-tbb opencv```

```brew install imagemagick```

```brew install graphicsmagick```



## Install
- run each command and wait for completion. Some tasks may need additional time due the time it takes to process the images.

```npm install```
- install all the libraries

```gulp prepare```
- create needed directories, download and process negative images

- ADD POSITIVE IMAGES: here you will add you positive images (at least 40)

```gulp process_images```
- process positive images so they are all the same size

```gulp build_image_map```
- create a list of all the negative and positive images

```gulp build_samples```
- build the .vec files

```gulp run```
- start training (this will take awhile)


## Acknowledgements

- Thorsten Ball: https://github.com/mrnugget/opencv-haar-classifier-training
- Naotoshi Seo: `mergevec.cpp` and `createsamples.cpp`
- Computation Vision at CalTech: http://www.vision.caltech.edu/Image_Datasets/

## References & Links:

- [TRAIN YOUR OWN OPENCV HAAR CLASSIFIER](http://coding-robin.de/2013/07/22/train-your-own-opencv-haar-classifier.html)
- [Naotoshi Seo - Tutorial: OpenCV haartraining (Rapid Object Detection With A Cascade of Boosted Classifiers Based on Haar-like Features)](http://note.sonots.com/SciSoftware/haartraining.html)
- [Material for Naotoshi Seo's tutorial](https://code.google.com/p/tutorial-haartraining/)
- [OpenCV Documentation - Cascade Classifier Training](http://docs.opencv.org/doc/user_guide/ug_traincascade.html)
