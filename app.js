"use strict";

var express = require('express');

var app = express();

var bParser = require('body-parser');

var path = require('path');

var errors = ['no errors', 'wrong coordinates'];
app.use(bParser.urlencoded({
  extended: true
}));
app.use(bParser.json([]));
var points = []; // special character managment

var chars = {};
chars['{'] = encodeURIComponent('{');
chars['}'] = encodeURIComponent('}');
chars[','] = encodeURIComponent(',');
chars['"'] = encodeURIComponent('"');
chars[' '] = encodeURIComponent(' ');
console.log('test'); // pattern mana

var pat = {};
pat.wSp = '(' + chars[' '] + ')+';
pat.wSs = '(' + chars[' '] + ')*'; // init router

var router = express.Router(); // jsut for debug

router.use(function (req, res, next) {
  console.log("/".concat(pat.wSp, "point").concat(pat.wSp, "with").concat(pat.wSp, "body").concat(pat.wSp).concat(chars['{']).concat(pat.wSp, "x").concat(pat.wSp, ":").concat(pat.wSp, ":x").concat(pat.wSp, ",").concat(pat.wSp, "y").concat(pat.wSp, ":").concat(pat.wSp, ":y").concat(pat.wSp).concat(chars['}']));
  console.log("/lines/:num");
  next();
});
router.get('/', function (req, res) {
  res.json({
    'api/': ''
  });
}); // add a point with body

router.route("/point".concat(chars[' '], "with").concat(chars[' '], "body").concat(chars[' ']).concat(chars['{']).concat(chars[' ']).concat(chars['"'], "x").concat(chars['"'], "\\:").concat(chars[' '], ":x,").concat(chars[' ']).concat(chars['"'], "y").concat(chars['"'], "\\:").concat(chars[' '], ":y").concat(chars[' ']).concat(chars['}'])).post(function (req, res, next) {
  var xNumber = Number.parseFloat(req.params.x);
  var yNumber = Number.parseFloat(req.params.y);

  if (Number.isNaN(xNumber) || Number.isNaN(yNumber)) {
    next(new Error(1));
  }

  res.json({
    'msg': 'Point has been added',
    'x': xNumber,
    'y': yNumber
  });
});
router.route("/test".concat(pat.wSp).concat(chars['{'], "x(abc)+[(:)]:x").concat(chars['}'])).post(function (req, res) {
  console.log(req.params.x);
  res.json({
    'msg': 'demonio'
  });
}); // view & delete all points

router.route('/space').get(function (req, res) {
  res.json({
    'points': points
  });
}).delete(function (req, res) {
  points = [];
  res.json({
    'msg': 'the space is empty now'
  });
}); // line numbers

router.route("/lines/".concat(chars['{'], ":num").concat(chars['}'])).get(function (req, res) {
  res.json({
    'line': {}
  });
});
router.use(errorHandler); // router.all('/*', function (req, res) {
// 	console.log('specific handler');
// });I

function errorHandler(err, req, res, next) {
  res.status(500);
  res.json({
    'error': err
  });
  console.error(err);
  next();
} // add routes for space


app.use('/api', router); // port listening

app.listen(3000);
