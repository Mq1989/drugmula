const express = require('express')
const app = express()
const puppeteer = require('puppeteer')

async function getInfo() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.drugs.com/history/fasenra.html');
    // const body = await page.evaluate(() => 
    //     document.body
    // )
    // console.log(body)
    const content = await page.content()
    const text = await page.evaluate(() => document.body.innerText)
    console.log(text)


}





app.listen(5500, 
    console.log('app running'))


getInfo()