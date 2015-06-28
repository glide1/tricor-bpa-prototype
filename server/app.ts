///<reference path="../typings/tsd.d.ts" />
require('source-map-support').install();

import * as express from 'express';

console.log("Current process directory", process.cwd());

let app = express()

app.use(require('connect-livereload')({
    port: 35729
  }));

app.use(express.static('.tmp'));
app.use(express.static('client'));
app.use('/libs', express.static('libs'));

let server = app.listen(process.env.PORT || 3000, () => {
	let host = server.address().address;
	let port = server.address().port;
	console.log('App listening at http://%s%s', host, port);
});