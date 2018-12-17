const MathDS = require('math-ds');

class Plane {
	constructor () {
		this.initData();
	}

	initData () {
		this.points = [];
		this.quantity = [];
		this.lines = [];
	}

	deleteAll () {
		this.initData();
	}

	getPoints () {
		var pointsArray = [];

		for (var i = 0; i < this.points.length; i++) {
			pointsArray.push(
				{
					x: this.points[i].x,
					y: this.points[i].y,
					quantity: this.quantity[i]
				}
			);
		}
		return pointsArray;
	}

	getLinesWithPoints (numOfPoints) {
		this.lines.filter( // to get all lines that
			line => {
				return numOfPoints === line.reduce( // summary of all points
					(acc, singlePoint) => {
						acc += this.quantity[singlePoint];
					},
					0
				);
			}
		);
	}

	test () {
		console.log('points', this.points);
		console.log('lines', this.lines);
	}

	addPoint (x, y) {
		const p = new MathDS.Vector2(x, y);
		var isDuplicate = false;

		for (var i = 0; i < this.points.length; i++) {
			if (p.equals(this.points[i])) {
				isDuplicate = true;
				this.quantity[i] ++;
			}
		}

		if (!isDuplicate) {
      // add the point
			this.quantity.push(1);
			const pIndex = this.points.push(p) - 1;
      // add lines

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
			console.log(this.lines.filter(item => this.lines[i].addPoint(pIndex)));
			console.log(this.lines.filter(item => this.lines[i].addPoint(pIndex))
			.reduce( // will return an object with unic keys
				(acc, item) => {
					acc.pool.map(point => {
						acc[point] = true;
					});
					return acc;
				},
				{}
			));

			const notGood = Object.keys( // all points that are olready connected
        // to new point through new point
				this.lines.filter(item => this.lines[i].addPoint(pIndex))
				.reduce( // will return an object with unic keys
					(acc, item) => {
						acc.pool.map(point => {
							acc[point] = true;
						});
						return acc;
					},
					{}
				)
			)

			.map(point => {
				// I use the code above to get all points that are not connected with line
				// segment to the new point, though the new line segments must be created
				this.lines.push(
					new Line(this, pIndex, point)
				);
			});

      // magic

		}
	}
}

class Line {
	constructor (plane, a, b) {
		this.plane = plane;

		this.center = this.plane.getPoint(a);
		this.vertex = this.plane.getPoint(b);

		this.distanceV = MathDS.Vector2(
			this.vertex,
			this.center
		).normalize();

		this.pool = [a, b];
	}

  // p is an index inside plane.points array, and addPoint return true
  // only if the point belog to the line
	addPoint (p) {
		var res = this.isOnTheSameAxies(p);
		if (res) {
			this.pool.push(p);
		}

		return res;
	}

	isOnTheSameAxis (p) {
		var point = this.plane.getPoint(p);

		const differenceFromCenter = MathDS.Vector2(
			point,
			this.center
		).normalize();

		const negativeDifferenceFromCenter = differenceFromCenter.negate();

		return this.distanceV.dot(differenceFromCenter) === 1 || this.distanceV.dot(negativeDifferenceFromCenter) === 1;
	}
}

// export default Plane;
