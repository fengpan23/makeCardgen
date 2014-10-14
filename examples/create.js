var CardGen = require('../index')
  , fs = require('fs')
  , path = require("path");


var dest = '/output/schoolA/ClassA/';
//var dest = '/output/';

var params = {
    school: '南宫第一小学',
    name: '孙悟空',
    serial: '081233',
}

var photo = __dirname + '/imgs/孙悟空.jpg';

//CardGen.resize(photo);
CardGen.generate(photo, params, dest);


var params2 = {
    school: '南宫第一小学',
    name: '小白龙',
    serial: '110235',
}

photo2 = __dirname + '/imgs/小白龙.jpg'; 

CardGen.generate(photo2, params2, dest);

var params3 = {
	    school: '南宫第一小学',
	    name: '白龙',
	    serial: '110235',
	}

	photo3 = __dirname + '/imgs/小白龙.jpg'; 

CardGen.generate(photo3, params3, dest);
