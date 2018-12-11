var express = require('express');
var app = express();
var bParser = require('body-parser');
var path = require('path');

const errors = [
	'no errors',
	'wrong coordinates'
];

app.use(bParser.urlencoded({ extended: true }));
app.use(bParser.json([]));

var points = [];

// special character managment
var chars = {};
chars['{'] = encodeURIComponent('{');
chars['}'] = encodeURIComponent('}');
chars[','] = encodeURIComponent(',');
chars['"'] = encodeURIComponent('"');
chars[' '] = encodeURIComponent(' ');

console.log('test');
// pattern mana
var pat = {};
pat.wSp = '(' + chars[' '] + ')+';
pat.wSs = '(' + chars[' '] + ')*';

// init router
var router = express.Router();

// jsut for debug
router.use(function (req, res, next) {
	console.log(`/${pat.wSp}point${pat.wSp}with${pat.wSp}body${pat.wSp}${chars['{']}${pat.wSp}x${pat.wSp}\:${pat.wSp}:x${pat.wSp},${pat.wSp}y${pat.wSp}\:${pat.wSp}:y${pat.wSp}${chars['}']}`);
	console.log(`/lines/:num`);
	next();
});

router.get('/', function (req, res) {
	res.json({
		'api/': ''
	});
});

// add a point with body
router.route(`/point${chars[' ']}with${chars[' ']}body${chars[' ']}${chars['{']}${chars[' ']}${chars['"']}x${chars['"']}\\:${chars[' ']}:x,${chars[' ']}${chars['"']}y${chars['"']}\\:${chars[' ']}:y${chars[' ']}${chars['}']}`)
.post(function (req, res, next) {
	const xNumber = Number.parseFloat(req.params.x);
	const yNumber = Number.parseFloat(req.params.y);

	if (Number.isNaN(xNumber) || Number.isNaN(yNumber)) {
		next(new Error(1));
	}

  // so far everything is ok
	
	res.json({
		'msg': 'Point has been added',
		'x': xNumber,
		'y': yNumber
	});
});

router.route(`/test${pat.wSp}${chars['{']}x(abc)+[(:)]:x${chars['}']}`)
.post(function (req, res) {
	console.log(req.params.x);
	res.json({
		'msg': 'demonio'
	});
});

// view & delete all points
router.route('/space')
.get(function (req, res) {
	res.json({
		'points': points
	});
})
.delete(function (req, res) {
	points = [];
	res.json({
		'msg': 'the space is empty now'
	});
});

// line numbers
router.route(`/lines/${chars['{']}:num${chars['}']}`)
.get(function (req, res) {
	res.json({
		'line': {}
	});
});

router.use(errorHandler);

// router.all('/*', function (req, res) {
// 	console.log('specific handler');
// });I
function errorHandler (err, req, res, next) {
	res.status(500);
	res.json(
		{
			'error': err
		}
	);
	console.error(err);
	next();
}

// add routes for space
app.use('/api', router);

// port listening
app.listen(3000);
