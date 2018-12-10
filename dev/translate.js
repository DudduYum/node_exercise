const fs = require('fs');
const options = require('../babel.config.js')();
const babel = require('@babel/core');
console.log(__dirname);
console.log(options);
var code = fs.readFileSync('./src/app.js', 'utf8');
// console.log(code);
var res = babel.transformSync(
	code,
	options
);

console.log(res);
