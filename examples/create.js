var CardGen = require('../index')
  , fs = require('fs')
  , path = require("path");


//var dest = '/output/schoolA/ClassA/';
var dest = '/output/';

var params = {
    school: '南宫第一小学',
    name: '孙悟空',
    serial: '081233',
}

var photo = __dirname + '/imgs/孙悟空.jpg';

//CardGen.resize(photo);
CardGen.generate(photo, params, dest);


params.name = '小白龙';
params.serial =  '110235';
photo = __dirname + '/imgs/lala.jpg'; 

//CardGen.resize(photo);
CardGen.generate(photo, params, dest);
