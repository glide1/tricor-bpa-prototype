///<reference path="../typings/tsd.d.ts" />
require('source-map-support').install();

import * as express from 'express';

let app = express()
app.get("/", (req, res) => {
	res.send("hello ch!");
});


let server = app.listen(process.env.PORT || 3000, () => {
	let host = server.address().address;
	let port = server.address().port;
	console.log('App listening at http://%s%s', host, port);
})