const express = require('express');
const app = express();
const requestIP = require('request-ip');
const { lookup } = require('geoip-lite');



app.use('/', (req, res) => {
	const clientIP = requestIP.getClientIp(req);

	res.send(lookup(clientIP));
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
