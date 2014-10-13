

# cardgen

Requirements：

* CentOS 7
* Node.js >= 0.10.0

支持Canvas需要

    yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel liberation-sans-fonts 

支持GM需要

    yum install ImageMagick

编译Canvas需要

    npm install -g node-gyp

## Usage

    var CardGen = require('cardgen');
    
    var params = {
        school: '北京市第一小学',
        name: '孙悟空',
        serial: '101022'
    }
    
    var photo = __dirname + '/imgs/孙悟空.jpg';
    var dest = __dirname + '/output/';
    
    Cardgen.generate(photo, params, dest);

## Developing



### Tools
