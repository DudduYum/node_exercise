"use strict";

var express = require('express');

var app = express();

var bParser = require('body-parser');

var path = require('path');

app.use(bParser.urlencoded({
  extended: true
}));
app.use(bParser.json([]));
var points = []; // special character managment

var chars = {};
chars['{'] = encodeURIComponent('{');
chars['}'] = encodeURIComponent('}');
chars[':'] = encodeURIComponent(':');
chars[','] = encodeURIComponent(',');
chars[' '] = encodeURIComponent(' '); // pattern mana

var pat = {};
pat.wSp = '(' + chars[' '] + ')+';
pat.wSs = '(' + chars[' '] + ')*'; // init router

var router = express.Router(); // jsut for debug

router.use(function (req, res, next) {
  console.log("/".concat(pat.wSs, "point").concat(pat.wSp, "with").concat(pat.wSp, "body").concat(pat.wSs).concat(chars['{']).concat(pat.wSs, "x").concat(pat.wSs, ":").concat(pat.wSs, ":x").concat(pat.wSs, ",").concat(pat.wSs, "y").concat(pat.wSs, ":").concat(pat.wSs, ":y").concat(pat.wSs).concat(chars['}']));
  console.log("/lines/:num");
  next();
});
router.get('/', function (req, res) {
  res.json({
    'api/': ''
  });
}); // point%20with%20body%20%7B%20x:%204,%20y:%20%205%7D
// add a point with body

router.route("/".concat(pat.wSs, "point").concat(pat.wSp, "with").concat(pat.wSp, "body").concat(pat.wSs).concat(chars['{']).concat(pat.wSs, "x").concat(pat.wSs, ":").concat(pat.wSs, ":x").concat(pat.wSs, ",").concat(pat.wSs, "y").concat(pat.wSs, ":").concat(pat.wSs, ":y").concat(pat.wSs).concat(chars['}'])).post(function (req, res) {
  console.log(req.params.params);
  res.json({
    'msg': 'Point has been added'
  });
});
router.route("/test".concat(pat.wSp).concat(chars['{'], "x(abc)*[(:)]:x").concat(chars['}'])).post(function (req, res) {
  console.log(req.params.x);
  res.json({
    'msg': 'demonio'
  });
}); // view & delete all points

router.route('/space').get(function (req, res) {
  console.log('specific handler');
  res.json({
    'points': points
  });
}).delete(function (req, res) {
  console.log('specific handler');
  points = [];
  res.json({
    'msg': 'the space is empty now'
  });
}); // line numbers

router.route("/lines/".concat(chars['{'], ":num").concat(chars['}'])).get(function (req, res) {
  console.log('lol');
  res.json({
    'line': {}
  });
}); // router.all('/*', function (req, res) {
// 	console.log('specific handler');
// });I
// add routes for space

app.use('/api', router); // port listening

app.listen(3000);
