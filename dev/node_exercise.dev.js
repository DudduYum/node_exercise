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

      this.lines.filter( // to get all lines that
      function (line) {
        return numOfPoints === line.reduce( // summary of all points
        function (acc, singlePoint) {
          acc += _this.quantity[singlePoint];
        }, 0);
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
      var _this2 = this;

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

        console.log(this.lines.filter(function (item) {
          return _this2.lines[i].addPoint(pIndex);
        }));
        console.log(this.lines.filter(function (item) {
          return _this2.lines[i].addPoint(pIndex);
        }).reduce( // will return an object with unic keys
        function (acc, item) {
          acc.pool.map(function (point) {
            acc[point] = true;
          });
          return acc;
        }, {}));
        Object.keys(this.lines.filter(function (item) {
          return _this2.lines[i].addPoint(pIndex);
        }).reduce( // will return an object with unic keys
        function (acc, item) {
          acc.pool.map(function (point) {
            acc[point] = true;
          });
          return acc;
        }, {})).map(function (point) {
          // I use the code above to get all points that are not connected with line
          // segment to the new point, though the new line segments must be created
          _this2.lines.push(new Line(_this2, pIndex, point));
        });
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
    this.distanceV = MathDS.Vector2(this.vertex, this.center).normalize();
    this.pool = [a, b];
  } // p is an index inside plane.points array, and addPoint return true
  // only if the point belog to the line


  _createClass(Line, [{
    key: "addPoint",
    value: function addPoint(p) {
      var res = this.isOnTheSameAxies(p);

      if (res) {
        this.pool.push(p);
      }

      return res;
    }
  }, {
    key: "isOnTheSameAxis",
    value: function isOnTheSameAxis(p) {
      var point = this.plane.getPoint(p);
      var differenceFromCenter = MathDS.Vector2(point, this.center).normalize();
      var negativeDifferenceFromCenter = differenceFromCenter.negate();
      return this.distanceV.dot(differenceFromCenter) === 1 || this.distanceV.dot(negativeDifferenceFromCenter) === 1;
    }
  }]);

  return Line;
}(); // export default Plane;

/* globals Plane */
// import Plane from './logic';


var express = require('express');

var app = express();

var bParser = require('body-parser'); // var path = require('path');


var pointsForTest = [{
  x: 3,
  y: 5
}, {
  x: 15,
  y: 178
}, {
  x: 3,
  y: 5
}, {
  x: 43,
  y: 0
}];
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

router.route("/point".concat(chars[' '], "with").concat(chars[' '], "body").concat(chars[' ']).concat(chars['{']).concat(chars[' ']).concat(chars['"'], "x").concat(chars['"'], "\\:").concat(chars[' '], ":x,").concat(chars[' ']).concat(chars['"'], "y").concat(chars['"'], "\\:").concat(chars[' '], ":y").concat(chars[' ']).concat(chars['}'])).post(function (req, res, next) {
  var xNumber = Number.parseInt(req.params.x);
  var yNumber = Number.parseInt(req.params.y);

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

router.route("/lines/".concat(chars['{'], ":num").concat(chars['}'])).get(function (req, res) {
  res.json({
    'line': {}
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
