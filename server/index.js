const express = require('express');
const app = express();
const requestIP = require('request-ip');
const { lookup } = require('geoip-lite');
const puppeteer = require('puppeteer');
const path = require('path');


const dir = path.join(__dirname, 'images');

app.use('/images',express.static(dir));

app.get('/', async (req, res) => {
	const clientIP = requestIP.getClientIp(req);
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1012,
		height: 506,
		deviceScaleFactor: 1,
	});
	console.log(req.query);
	// { time: '10-12-00', date: '12-12-2021', timezone: 'UTC-0530' }
	// { time: '10-12-00', date: '12-12-2021', timezone: 'UTC 0530' }
	await page.goto(`file:${path.join(__dirname, 'design/index.html')}`, { waitUntil: 'networkidle0' });
	await page.screenshot({ path: path.join(__dirname, `images/test.png`) });
	await browser.close();
	// res.sendFile(path.join(__dirname, `design/index.html`));
	res.sendFile(path.join(__dirname, `images/test.png`));
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
