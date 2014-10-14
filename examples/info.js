var Canvas = require('canvas')
  , Image = Canvas.Image
  , Font = Canvas.Font
  , gm = require('gm')
  , IM = gm.subClass({ imageMagick: true })
  , fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp');
 
const PhotoWidth	= 990;
const PhotoHeight	= 1368;
const PhotoRatio	= PhotoWidth/PhotoHeight; // 0.7237

function resize(file) {
	
	//output all available image properties
	IM(file).size(function(err, value) {
		// note: value maybe undefined;
//			var ratio = value.width / value.height;

		// Resize and crop
//			if (ratio > PhotoRatio) {
		IM(file)
			.resize(PhotoWidth, PhotoHeight)
			.write(__dirname + '/resize.jpg', function(err) {
				if (err) return console.dir(arguments)
				console.log(this.outname + " created :: " + arguments[3]);
			})
	});
}
	
var image = __dirname + '/imgs/孙悟空.jpg';

resize(image);