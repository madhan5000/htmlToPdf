const express = require('express')
const app = express()
const puppeteer = require('puppeteer');
const contentDisposition = require('content-disposition');

app.get('/pdf', function (req, res) {
	(async()=>{
		let { url, type, ...options } = req.query;
		console.log(url);
		if (!url) {
    	return res.status(400).send('url parameter needed');
  	}
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(req.query.url, {waitUntil: 'networkidle0'});
		
		let height = await page.evaluate(() => document.documentElement.offsetHeight);
		await page.emulateMedia('screen');
		let pdf = await page.pdf({
		      width : '1200px',
		      height: height + 'px',
		      printBackground: true,
		      margin: {
		        top: 0,
		        bottom: 0,
		        left: 0,
		        right: 0
		      }
		});
		await browser.close();

	  res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.length,
            'Content-Disposition': contentDisposition(filename + '.pdf'),
          }).send(pdf);
	})();


})

app.listen(5000, function () {
    console.log("server started");
})
