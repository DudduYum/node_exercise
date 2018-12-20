"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MathDS = require('math-ds');

var Plane =
/*#__PURE__*/
function () {
  function Plane() {
    _classCallCheck(this, Plane);

    this.initData();
  }

  _createClass(Plane, [{
    key: "initData",
    value: function initData() {
      this.points = [];
      this.quantity = [];
      this.lines = [];
    }
  }, {
    key: "deleteAll",
    value: function deleteAll() {
      this.initData();
    }
  }, {
    key: "getPoint",
    value: function getPoint(index) {
      if (!this.points[index]) {
        throw new Error('missing point');
      }

      return this.points[index];
    }
  }, {
    key: "getPoints",
    value: function getPoints() {
      var pointsArray = [];

      for (var i = 0; i < this.points.length; i++) {
        pointsArray.push({
          x: this.points[i].x,
          y: this.points[i].y,
          quantity: this.quantity[i]
        });
      }

      return pointsArray;
    }
  }, {
    key: "getLinesWithPoints",
    value: function getLinesWithPoints(numOfPoints) {
      var _this = this;

      return this.lines.filter( // to get all lines that
      function (line) {
        return numOfPoints === line.pool.reduce( // summary of all points
        function (acc, singlePoint) {
          acc += _this.quantity[singlePoint];
          return acc;
        }, 0);
      }).map(function (line) {
        return line.pool.map(function (point) {
          return _this.points[point];
        });
      });
    }
  }, {
    key: "test",
    value: function test() {
      console.log('points', this.points);
      console.log('lines', this.lines);
    }
  }, {
    key: "addPoint",
    value: function addPoint(x, y) {
      var p = new MathDS.Vector2(x, y);
      var isDuplicate = false;

      for (var i = 0; i < this.points.length; i++) {
        if (p.equals(this.points[i])) {
          isDuplicate = true;
          this.quantity[i]++;
        }
      }

      if (!isDuplicate) {
        // add the point
        this.quantity.push(1);
        var pIndex = this.points.push(p) - 1; // add lines
        // the point is a new one, so I need to add it
        // if the point is on the same axis the line is, addPoint() method
        // will return true, false otherwise
        // well now let's explain this line of code:
        // Every time I add new point to the plain there are two thing that may
        // happen
        // - the firts is the new point belong to the line
        // - the second is that it doens't
        // so in firts case the point is "connected" to all line's point through
        // the line, this mean I do not need to add new line segment to the plain,
        // because there already is one.
        // In the second case the points of the line may be or may be not connected
        // to the point through some line. So I need to filter all points that are
        // connected to the current point and keep those that are not connected

        var notGood = this.lines.filter(function (item) {
          return item.addPoint(pIndex);
        }) // all points that are olready connected
        // to new point through new point
        .reduce( // will return an object with unic keys
        function (acc, item) {
          item.pool.map(function (point) {
            acc[point] = true;
          });
          return acc;
        }, {}); // console.log('notGood', notGood);

        for (i = 0; i < this.points.length; i++) {
          if (i !== pIndex && !notGood[i]) {
            this.lines.push(new Line(this, pIndex, i));
          }
        } // this.points.map(
        // 	point => {
        // 		// I use the code above to get all points that are not connected with line
        // 		// segment to the new point, though the new line segments must be created
        // 		this.lines.push(
        // 			new Line(this, pIndex, point)
        // 		);
        // 	}
        // );

      }
    }
  }]);

  return Plane;
}();

var Line =
/*#__PURE__*/
function () {
  function Line(plane, a, b) {
    _classCallCheck(this, Line);

    this.plane = plane;
    this.center = this.plane.getPoint(a);
    this.vertex = this.plane.getPoint(b);
    this.distanceV = new MathDS.Vector2().subVectors(this.vertex, this.center).normalize();
    this.pool = [a, b];
  } // p is an index inside plane.points array, and addPoint return true
  // only if the point belog to the line


  _createClass(Line, [{
    key: "addPoint",
    value: function addPoint(p) {
      var res = this.isOnTheSameAxis(p);

      if (res) {
        this.pool.push(p);
      }

      return res;
    }
  }, {
    key: "isOnTheSameAxis",
    value: function isOnTheSameAxis(p) {
      var point = this.plane.getPoint(p);
      console.log("confronto (x,".concat(this.center.x, " y,").concat(this.center.y, "====x:").concat(this.vertex.x, ",y:").concat(this.vertex.y, ") +++++ (x:").concat(point.x, ", y:").concat(point.y, ")"));
      var differenceFromCenter = new MathDS.Vector2().subVectors(point, this.center).normalize();
      var negativeDifferenceFromCenter = differenceFromCenter.negate();
      console.log('this.distanceV.dot(differenceFromCenter)', this.distanceV.dot(differenceFromCenter));
      console.log('this.distanceV.dot(negativeDifferenceFromCenter)', this.distanceV.dot(negativeDifferenceFromCenter));
      return Math.abs(this.distanceV.dot(differenceFromCenter)) >= 0.995 || Math.abs(this.distanceV.dot(negativeDifferenceFromCenter)) >= 0.995;
    }
  }]);

  return Line;
}(); // export default Plane;

/* globals Plane */
// import Plane from './logic';


var express = require('express');

var app = express();

var bParser = require('body-parser');

var fs = require('fs');

var dataPath = './data/plane.json';

if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, {}.toString(), {
    flag: 'w'
  });
}

var pointsForTest = JSON.parse(fs.readFileSync(dataPath, {
  encoding: 'utf8',
  flag: 'r'
}));
app.use(bParser.urlencoded({
  extended: true
}));
app.use(bParser.json([])); // special character managment

var chars = {};
chars['{'] = encodeURIComponent('{');
chars['}'] = encodeURIComponent('}');
chars[','] = encodeURIComponent(',');
chars['"'] = encodeURIComponent('"');
chars[' '] = encodeURIComponent(' '); // pattern mana

var pat = {};
pat.wSp = '(' + chars[' '] + ')+';
pat.wSs = '(' + chars[' '] + ')*'; // logic

var plane = new Plane(); // init palne

pointsForTest.map(function (item) {
  plane.addPoint(item.x, item.y);
}); // init router

var router = express.Router(); // jsut for debug

router.use(function (req, res, next) {
  next();
});
router.get('/', function (req, res) {
  res.json({
    'api/': ''
  });
}); // add a point with body
// router.route(`/point${chars[' ']}with${chars[' ']}body${chars[' ']}${chars['{']}${chars[' ']}${chars['"']}x${chars['"']}\\:${chars[' ']}:x,${chars[' ']}${chars['"']}y${chars['"']}\\:${chars[' ']}:y${chars[' ']}${chars['}']}`)

router.route("/point".concat(chars[' '], "with").concat(chars[' '], "body").concat(chars[' ']).concat(chars['{']).concat(chars[' ']).concat(chars['"'], "x").concat(chars['"'], "\\:").concat(chars[' '], ":x,").concat(chars[' ']).concat(chars['"'], "y").concat(chars['"'], "\\:").concat(chars[' '], ":y").concat(chars['}'])).post(function (req, res, next) {
  var xNumber = Number.parseFloat(req.params.x);
  var yNumber = Number.parseFloat(req.params.y);

  if (Number.isNaN(xNumber) || Number.isNaN(yNumber)) {
    next(new Error(1));
  } // so far everything is ok


  plane.addPoint(xNumber, yNumber);
  res.json({
    'msg': 'Point has been added',
    'x': xNumber,
    'y': yNumber
  });
}); // view & delete all points

router.route('/space').get(function (req, res) {
  res.json({
    'points': plane.getPoints()
  });
}).delete(function (req, res) {
  // delete points from plane
  plane.deleteAll();
  res.json({
    'msg': 'the space is empty now'
  });
}); // line numbers

router.route("/lines/".concat(chars['{'], ":num").concat(chars['}'])).get(function (req, res, next) {
  var nNumber = Number.parseInt(req.params.num);

  if (Number.isNaN(nNumber)) {
    next(new Error(1));
  }

  console.log(plane.getLinesWithPoints(nNumber));
  res.json({
    'line': plane.getLinesWithPoints(nNumber)
  });
}); //test

router.route("/test").get(function (req, res) {
  plane.test();
  res.json({
    'test': 'look at terminal'
  });
});
router.use(errorHandler); // router.all('/*', function (req, res) {
// 	console.log('specific handler');
// });

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
//# sourceMappingURL=node_exercise.dev.js.map
