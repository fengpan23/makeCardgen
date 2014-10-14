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

	// stream output to a ReadableStream
	// (can be piped to a local file or remote server)
	gm(file)
	.resize(PhotoWidth, PhotoHeight)
	.stream(function (err, stdout, stderr) {
	  var writeStream = fs.createWriteStream(__dirname + '/tmp/resize.jpg');
	  stdout.pipe(writeStream);
	});
	
}

exports.resize = function(photo) {
	mkdirp(__dirname + '/tmp', function(err) { 
		if (err) console.error(err);
		else console.log('tmp dir created.');
	});	
	return resize(photo);
}

// Generate image
function generate(photo, params, dest) {
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
	var photoFile = fs.readFileSync(photo);
	img = new Image;
	img.src = photoFile;
//	img.onload = function() { 
		ctx.drawImage(img, 464, 389, PhotoWidth, PhotoHeight);
//	}
	
	// Write to final file
	var out = fs.createWriteStream(dest + params.serial + '_' + params.name + '.jpg');

	var stream = canvas.createJPEGStream({
		bufsize : 4096,
		quality : 100
	});

	stream.on('data', function(chunk) {
		out.write(chunk);
	});
	
	stream.on('end', function() {
		console.log(params.serial + params.name + '.jpg created.')
	});
	
//	IM('/path/to/my/img.jpg')
//	.units('PixelsPerInch')
//	.density(1200,1200)
//	.stream()
//	.pipe(writeStream);
	
	/*
	IM(input_img)
		.units('PixelsPerInch')
		.density(1200,1200)
		.write('resized.jpg', function (error) {
			if (error) return console.dir(arguments);
			console.log(this.outname + "created :: " + arguments[3])
		});
	*/
	
}

exports.generate = function(photo, params, dest) {
	mkdirp(__dirname + dest, function(err) { 
		if (err) console.error(err);
		else console.log('dir created.');
	});
	
	return generate(photo, params, __dirname + dest);
}

exports.convert = function(options) {
	
}

