# node_exercise
## Description
It's a very simple exercise that let you manage a 2D space. You can add some point to the space and see how many of them are aligned. As every software that relay on vector operations this program it's not perfect and have some error factor due to some approximation on floating point numbers.  

## How to install

npm install

## How to build

npm run build

## How to interact with software

To run the app use

npm run start

The server run on port 3000 and use api route to manage all for api. In particular you have:

GET 			/api/space																	to get all points present in the space, if there are some duplicate the app will not
return you the same point n time, instead you will see the quantity counter for each point that will indicate you
the number a point has been inserted to the space.


DELETE 		/api/space 																	will delete all points from the space


GET				/api/lines/{n}															n is an integer, use this api to get all lines segments that contain at least n points in it.


PUT				/api/point with body { "x": …, "y" …}				the way to add points to space through api, … stands for floating point number. The format (spaces) of the query must be respected otherwise you will be redirected to error handler
