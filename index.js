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

var CardWidth	= 1918;
var CardHeight	= 2296;
var TextBoxWidth = 450;
var TextHeadHeight = 174;
var TextInfoHeight = 125;

var output_dir = __dirname + '/output';

function getImageInfo(file) {
	//output all available image properties
	IM(file).size(function(err, value) {
		// note: value maybe undefined;
		
		
	});
	
	IM(file).identify(function (err, data) {
			if (!err) 
				console.log(data);
			else
				console.log(err);
		});	
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
	ctx.drawImage(img, 464, 389, img.width *4 , img.height*4 );	
	
	var out = fs.createWriteStream(dest + params.serial + '_' + params.name + '.jpg');

	var stream = canvas.createJPEGStream({
		bufsize : 4096,
		quality : 95
	});

	stream.on('data', function(chunk) {
		out.write(chunk);
	});
	
	stream.on('end', function() {
		out.end();	
	});	
}

exports.generate = function(photo, params, dest) {
	mkdirp(dest, function(err) { 
//		console.log(err);
	});
	
	return generate(photo, params, dest);
}

exports.convert = function(options) {
	
}


exports.resize = function(options) {
	
}

exports.crop = function(options) {
	
}
