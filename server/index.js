const express = require('express');
const app = express();
const requestIP = require('request-ip');
const { lookup } = require('geoip-lite');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('moment-timezone');

moment().format(); 



const dir = path.join(__dirname, 'images');

app.use('/images',express.static(dir));

app.get('/', async(req,res) =>{
	const timeMap={
		"-0700":"-0700",
		"-0500":"-0500",
		"-0400":"-0400",
		"+0000":"+0000",
		"+0100":"+0100",
		"+0200":"+0200",
		"+0300":"+0300",
		"+0400":"+0400",
		"+0530":"+0530",
		"+0700":"+0700",
		"+0800":"+0800",
		"+0900":"+0900",
	}
	let contentHtml = fs.readFileSync('design/discord.html', 'utf-8');
	const {time, timezone}=req.query
	let offset;
	if(timezone.includes('-')){
		offset=`-${timezone.split('-')[1]}`
	}
	else if(timezone.includes(' ')){
		offset=`+${timezone.split(' ')[1]}`
	}
	else{
		offset=`+00`
	}
	contentHtml = contentHtml.replace('INPUT', `${time}`);
	contentHtml = contentHtml.replace('TIMEZONE', `UTC ${offset}`);
	const inputTime=moment(`2021-07-25 ${time}${offset}`)
	Object.keys(timeMap).forEach(function(value, index){
	contentHtml = contentHtml.replace(`discord${index+1}`, inputTime.clone().utcOffset(timeMap[value]).format('HH:mm'));
	});
	fs.writeFileSync('design/discordOut.html', contentHtml);
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1080,
		height: 500,
		deviceScaleFactor: 1,
	});
	await page.goto(`file:${path.join(__dirname, 'design/discordOut.html')}`, { waitUntil: 'networkidle0' });
	await page.screenshot({ path: path.join(__dirname, `images/discord.png`) });
	await browser.close();
	// res.sendFile(path.join(__dirname, `design/index.html`));
	res.sendFile(path.join(__dirname, `images/discord.png`));

})

app.get('/get', async (req, res) => {
	const clientIP = requestIP.getClientIp(req);
	let contentHtml = fs.readFileSync('design/index.html', 'utf-8');
	// console.log(req.query);
	const {time,date,timezone}=req.query
	let offset;
	if(timezone.includes('-')){
		offset=`-${timezone.split('-')[1]}`
	}
	else if(timezone.includes(' ')){
		offset=`+${timezone.split(' ')[1]}`
	}
	else{
		offset=`+00`
	}
	const convertedTime=moment(`${date} ${time}${offset}`)
		// { time: '10-12-00', date: '12-12-2021', timezone: 'UTC-0530' }
	// { time: '10-12-00', date: '12-12-2021', timezone: 'UTC 0530' }
	contentHtml = contentHtml.replace('DATEA', date);
	contentHtml = contentHtml.replace('TIMEA', `${time} UTC${offset}`);
	contentHtml = contentHtml.replace('DATEB', convertedTime.tz(lookup(clientIP).timezone).format('YYYY-MM-DD'));
	contentHtml = contentHtml.replace('TIMEB', convertedTime.tz(lookup(clientIP).timezone).format('HH:mm'));
	contentHtml = contentHtml.replace('TIMEZONE', lookup(clientIP).timezone);
	fs.writeFileSync('design/sampleOut.html', contentHtml);
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1012,
		height: 506,
		deviceScaleFactor: 1,
	});
	await page.goto(`file:${path.join(__dirname, 'design/sampleOut.html')}`, { waitUntil: 'networkidle0' });
	await page.screenshot({ path: path.join(__dirname, `images/time.png`) });
	await browser.close();
	// res.sendFile(path.join(__dirname, `design/index.html`));
	res.sendFile(path.join(__dirname, `images/time.png`));
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
