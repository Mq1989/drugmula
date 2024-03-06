const express = require('express')
const app = express()
const puppeteer = require('puppeteer')

const getInfo = async () => {
    const browser = await puppeteer.launch();
}




app.listen(5500, 
    console.log('app running'))