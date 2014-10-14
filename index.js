var Canvas = require('canvas')
  , Image = Canvas.Image
  , Font = Canvas.Font
  , gm = require('gm')
  , IM = gm.subClass({ imageMagick: true })
  , fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp');
 
if (!Font) {
	throw new Error('Need to compile with font support');
}

function fontFile(name) {
	return path.join(__dirname, '/fonts/', name);
}

var simheiFont = new Font('simheiFont', fontFile('simhei.ttf'));

const CardWidth		= 1918;
const CardHeight	= 2296;
const TextBoxWidth	= 450;
const TextHeadHeight = 174;
const TextInfoHeight = 125;

var output_dir = __dirname + '/output';

const PhotoWidth	= 990;
const PhotoHeight	= 1368;
const PhotoRatio	= PhotoWidth/PhotoHeight; // 0.7237
// > ratio means width oversize
// < ratio means height oversize 

function resize(file) {
	IM(file)
	.resize(PhotoWidth, PhotoHeight)
	.write(__dirname + '/tmp/resize.jpg', function (err) {
		//
	});
}

exports.resize = function(photo) {
	mkdirp(__dirname + '/tmp', function(err) { 
		if (err) console.error(err);
		else
			console.log('tmp dir created.');
			return resize(photo);
	});	

}

// Generate image
function generate(photo, params, dest) {
	var resizeWidth = null;
	var resizeHeight = null;
	var cropXPos = 0;
	var cropYPos = 0;
	
	var canvas = new Canvas(CardWidth, CardHeight);
	var ctx = canvas.getContext('2d');
	ctx.addFont(simheiFont);
	
	// Set white background
	ctx.fillStyle = '#FFF';
	ctx.fillRect(0, 0, CardWidth, CardHeight);
	ctx.save();
	
	// Text 
	ctx.fillStyle = '#000';
	
	// #1: School name
	ctx.font = 'normal normal 174px simheiFont';
	ctx.fillText(params.school, TextBoxWidth, TextHeadHeight + 135);
	
	// #2: Student Name and serial number
	ctx.font = 'normal normal 125px simheiFont';	
	ctx.fillText('姓名：  ' + params.name , TextBoxWidth, TextInfoHeight + 1837);
	ctx.fillText('序号：  ' + params.serial, TextBoxWidth, TextInfoHeight + 2036);	
	
	// Photo
	var photobuf = fs.readFileSync(photo);
	
	var tmpIM = 
		IM(photobuf).size(function(err, value) {
			var ratio = value.width / value.height;
			if (ratio > PhotoRatio) {
				resizeWidth = null;
				resizeHeight = PhotoHeight;
				cropXPos = ((PhotoHeight/value.height)*value.width - PhotoWidth) / 2;
				cropYPos = 0;
			}
			else {
				resizeWidth = PhotoWidth;
				resizeHeight = null;
				cropXPos = 0;
				cropYPos = ((PhotoWidth/value.width)*value.height - PhotoHeight) / 2;
			}
			console.log('width: ' + resizeWidth + ', height: ' + resizeHeight);		

			tmpIM.resize(resizeWidth, resizeHeight)
			.crop(PhotoWidth, PhotoHeight, cropXPos, cropYPos)
			.write(__dirname + '/tmp/resize' + params.name + '.jpg', function (err) {
				if (err) return handle(err);
				console.log('resize photo completed.');
		
				var photoFile = fs.readFileSync(__dirname + '/tmp/resize' + params.name + '.jpg');
				img = new Image;
				img.src = photoFile;
				ctx.drawImage(img, 464, 389, PhotoWidth, PhotoHeight);
					
				// Write to final file
				var out = fs.createWriteStream( dest + params.serial + '_' + params.name + '.jpg' );
				
				var stream = canvas.createJPEGStream({
					bufsize : 4096,
					quality : 100
				});
		
				stream.on('data', function(chunk) {
					out.write(chunk);
				});
		
				stream.on('end', function() {
				    out.end();
				});
		
		        out.on('finish', function() {
		            IM(dest + params.serial + '_' + params.name + '.jpg')
		            .units('PixelsPerInch')
		            .density(1200,1200)
		            .write(dest + params.serial + '_' + params.name + '.jpg', function (err) {
		                //
		            });
		        }); 
			});
		});
}

exports.generate = function(photo, params, dest) {
	mkdirp(__dirname + dest, function(err) { 
		if (err) console.error(err);
		else {
			console.log('dir created.');
			return generate(photo, params, __dirname + dest);
		}
	});
	

}

exports.convert = function(options) {
	
}

