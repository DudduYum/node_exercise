/* globals Plane */

// import Plane from './logic';

var express = require('express');
var app = express();
var bParser = require('body-parser');
var fs = require('fs');

const dataPath = './data/plane.json';

if (!fs.existsSync(dataPath)) {
	fs.writeFileSync(
		dataPath,
		{}.toString(),
		{
			flag: 'w'
		}
	);
}

var pointsForTest = JSON.parse(
	fs.readFileSync(
		dataPath,
		{
			encoding: 'utf8',
			flag: 'r'
		}
	)
);

app.use(bParser.urlencoded({ extended: true }));
app.use(bParser.json([]));

// special character managment
var chars = {};
chars['{'] = encodeURIComponent('{');
chars['}'] = encodeURIComponent('}');
chars[','] = encodeURIComponent(',');
chars['"'] = encodeURIComponent('"');
chars[' '] = encodeURIComponent(' ');

// pattern mana
var pat = {};
pat.wSp = '(' + chars[' '] + ')+';
pat.wSs = '(' + chars[' '] + ')*';

// logic
var plane = new Plane();
// init palne
pointsForTest.map(
	item => {
		plane.addPoint(item.x, item.y);
	}
);

// init router
var router = express.Router();

// jsut for debug
router.use(function (req, res, next) {
	next();
});

router.get('/', function (req, res) {
	res.json({
		'api/': ''
	});
});

// add a point with body
// router.route(`/point${chars[' ']}with${chars[' ']}body${chars[' ']}${chars['{']}${chars[' ']}${chars['"']}x${chars['"']}\\:${chars[' ']}:x,${chars[' ']}${chars['"']}y${chars['"']}\\:${chars[' ']}:y${chars[' ']}${chars['}']}`)
router.route(`/point${chars[' ']}with${chars[' ']}body${chars[' ']}${chars['{']}${chars[' ']}${chars['"']}x${chars['"']}\\:${chars[' ']}:x,${chars[' ']}${chars['"']}y${chars['"']}\\:${chars[' ']}:y${chars['}']}`)
.post(function (req, res, next) {
	const xNumber = Number.parseFloat(req.params.x);
	const yNumber = Number.parseFloat(req.params.y);

	if (Number.isNaN(xNumber) || Number.isNaN(yNumber)) {
		next(new Error(1));
	}
  // so far everything is ok
	plane.addPoint(xNumber, yNumber);

	res.json({
		'msg': 'Point has been added',
		'x': xNumber,
		'y': yNumber
	});
});

// view & delete all points
router.route('/space')
.get(function (req, res) {
	res.json({
		'points': plane.getPoints()
	});
})
.delete(function (req, res) {
  // delete points from plane
	plane.deleteAll();
	res.json({
		'msg': 'the space is empty now'
	});
});

// line numbers
router.route(`/lines/${chars['{']}:num${chars['}']}`)
.get(
	(req, res, next) => {
		const nNumber = Number.parseInt(req.params.num);

		if (Number.isNaN(nNumber)) {
			next(new Error(1));
		}

		console.log(plane.getLinesWithPoints(nNumber));
		res.json(
			{
				'line': plane.getLinesWithPoints(nNumber)
			}
		);
	}
);

//test
router.route(`/test`)
.get(
	(req, res) => {
		plane.test();
		res.json({
			'test': 'look at terminal'
		});
	}
);

router.use(errorHandler);

// router.all('/*', function (req, res) {
// 	console.log('specific handler');
// });
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
