const express = require("express");
const app = express();
const axios = require("axios");
const getInfo = require("./utils/getDrugData");
const smartSearch = require("./utils/smartSearch")

app.get('/autocomplete', async (req, res) => {
    const term = req.query.query;
    console.log(term)
    const drugs = await smartSearch(term)
    console.log(drugs)
    res.send(drugs).status(200)

})

app.listen(5500, console.log("app running"));



