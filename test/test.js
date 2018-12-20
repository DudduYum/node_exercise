var fs = require('fs');

const fList = JSON.parse(
	fs.readFileSync(
		'./function.json',
		{
			flag: 'r'
		}
	)
);

var randomX = [];
var xCount = 50;

for (var i = 0; i < xCount; i++) {
	randomX.push(
		(Math.random() * 1000000) - 500000
	);
}

var plane = randomX.map(
	x => {
		var points = fList.map(
			func => {
				return {
					'x': x,
					'y': func.m * x + func.a
				};
			}
		);

		for (i = 0; i < points; i++) {
			for (var j = 0; j < points; j++) {
				if (i !== j) {
					
				}
			}
		}


	}
);
