var CardGen = require('../index')
  , fs = require('fs')
  , path = require("path");


var params = {
    school: '南宫第一小学',
    name: '孙悟空',
    serial: '081233',
}

var image = __dirname + '/imgs/孙悟空.jpg'; 

var dest = __dirname + '/output/';

CardGen.generate(image, params, dest);


