const express = require("express");
const app = express();
const getInfo = require("./utils/getDrugData");
const smartSearch = require("./utils/smartSearch")
const bigSearch = require("./utils/bigSearch")
const finnhub = require('finnhub');
const finnHubKey = 'cb1a35qad3ibk673gkbg'
const axios = require('axios')
const alpha = 'PF7CD6G2MADPLXMH'

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = finnHubKey
const finnhubClient = new finnhub.DefaultApi()


app.get('/drugautocomplete', async (req, res) => {
    const term = req.query.query;
    console.log(term)
    const drugs = await smartSearch(term)
    console.log(drugs)
    res.send(drugs).status(200)

})

app.get('/autocomplete', async (req, res) => {
    const term = req.query.query;
    console.log(term)
    const drugs = await bigSearch(term)
    console.log(drugs)
    res.send(drugs).status(200)

})

app.get('/druginfo', async (req, res) => {
    const term = req.query.query;
    console.log(term)
    const drug = await getInfo(term)
    // console.log(drug)
    res.send(drug).status(200)

})

app.get('/stockinfo', async (req, res) => {
    const companyName = req.query.query;
    console.log(companyName)
    const company = finnhubClient.symbolSearch(companyName, (error, data, response) => {
        return data
      });
    console.log(company)
    res.send(company).status(200)

})

// finnhubClient.symbolSearch('Eisai Inc', (error, data, response) => {
//     console.log(data)
//     return data
//   });

async function searchTicker(companyName){
const  response = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${companyName.split(" ")[0]}&apikey=${alpha}`)
console.log(response.data.bestMatches)
}






app.listen(5500, console.log("app running"));



