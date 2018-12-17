"use strict";

var _logic = _interopRequireDefault(require("./src/logic"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');

var app = express();

var bParser = require('body-parser');

var path = require('path');

console.log(_logic.default);
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
  var xNumber = Number.parseInt(req.params.x);
  var yNumber = Number.parseInt(req.params.y);

  if (Number.isNaN(xNumber) || Number.isNaN(yNumber)) {
    next(new Error(1));
  } // so far everything is ok


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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MathDS = require('math-ds');

var Plane =
/*#__PURE__*/
function () {
  function Plane() {
    _classCallCheck(this, Plane);

    this.points = [];
    this.quantity = [];
    this.lines = [];
  }

  _createClass(Plane, [{
    key: "addPoint",
    value: function addPoint(x, y) {
      var _this = this;

      var p = new MathDS.Vector2(x, y);
      var isDuplicate = false;

      for (var i = 0; i < this.points.length; i++) {
        if (p.equal(this.points[i])) {
          isDuplicate = true;
          this.quantity[i]++;
        }
      }

      if (!isDuplicate) {
        var pIndex = this.points.push(p) - 1; // add lines

        this.lines.filter(function (item) {
          return !_this.lines[i].addPoint(pIndex);
        }).reduce(function (acc, item) {
          console.log(item);
          acc.push(item);
          return acc;
        }, []);
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
}();

var _default = Plane;
exports.default = _default;
