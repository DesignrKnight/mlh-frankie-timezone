const express = require('express');
const app = express();
const requestIP = require('request-ip');
const { lookup } = require('geoip-lite');
const puppeteer = require('puppeteer');
const path = require('path');


app.get('/', async (req, res) => {
	const clientIP = requestIP.getClientIp(req);
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1080,
		height: 1080,
		deviceScaleFactor: 1,
	});
	console.log(req.query);
	// { time: '10-12-00', date: '12-12-2021', timezone: 'UTC-0530' }
	// { time: '10-12-00', date: '12-12-2021', timezone: 'UTC 0530' }
	await page.goto(`http://139.162.166.77:3000/`, { waitUntil: 'networkidle0' });
	await page.screenshot({ path: path.join(__dirname, `test.png`) });
	await browser.close();
	res.sendFile(path.join(__dirname, `test.png`));
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
