const express = require("express");
const app = express();
const getInfo = require("./utils/getDrugData");
const smartSearch = require("./utils/smartSearch");
const bigSearch = require("./utils/bigSearch");
const companyNameSuggestions = require("./utils/companyNameAutoComplete");
const finnhub = require("finnhub");
const finnHubKey = "cb1a35qad3ibk673gkbg";
const axios = require("axios");
const alpha = "PF7CD6G2MADPLXMH";
const fs = require("fs").promises; // Import fs promises for async operations
const path = require("path");

async function getNames() {
  const data = await fs.readFile(path.join(__dirname, "companyNames"), "utf-8");
  const names = await JSON.parse(data);
  return names;
}

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = finnHubKey;
const finnhubClient = new finnhub.DefaultApi();

app.get("/drugautocomplete", async (req, res) => {
  const term = req.query.query;
  console.log(term);
  const drugs = await smartSearch(term);
  console.log(drugs);
  res.send(drugs).status(200);
});

app.get("/autocomplete", async (req, res) => {
  const term = req.query.query;
  console.log(term);
  const drugs = await bigSearch(term);
  console.log(drugs);
  res.send(drugs).status(200);
});

app.get("/druginfo", async (req, res) => {
  const term = req.query.query;
  console.log(term);
  const drug = await getInfo(term);
  // console.log(drug)
  res.send(drug).status(200);
});

app.get("/stockinfo", async (req, res) => {
  const companyName = req.query.query;
  console.log(companyName);
  const company = finnhubClient.symbolSearch(
    companyName,
    (error, data, response) => {
      return data;
    }
  );
  console.log(company);
  res.send(company).status(200);
});

// finnhubClient.symbolSearch('Eisai Inc', (error, data, response) => {
//     console.log(data)
//     return data
//   });

async function searchTicker(companyName) {
  const response = await axios.get(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${
      companyName.split(" ")[0]
    }&apikey=${alpha}`
  );
  console.log(response.data.bestMatches);
}

async function getOnGoingTrials(companyName) {
  const Phase4Trials = await axios.get(
    "https://classic.clinicaltrials.gov/api/query/study_fields?expr=AREA%5BLocationCountry%5DUnited+States+AND+AREA%5BPhase%5DPhase+4+AND+AREA%5BLeadSponsorClass%5DINDUSTRY+AND+AREA%5BCompletionDateType%5DAnticipated&fields=NCTId%2CBriefTitle%2CCondition%2CLeadSponsorClass%2CCompletionDate%2CInterventionArmGroupLabel%2CPhase%2CLeadSponsorName&min_rnk=1&max_rnk=100&fmt=json"
  );
  const Phase3Trials = await axios.get(
    "https://classic.clinicaltrials.gov/api/query/study_fields?expr=AREA%5BLocationCountry%5DUnited+States+AND+AREA%5BPhase%5DPhase+3+AND+AREA%5BLeadSponsorClass%5DINDUSTRY+AND+AREA%5BCompletionDateType%5DAnticipated&fields=NCTId%2CBriefTitle%2CCondition%2CLeadSponsorClass%2CCompletionDate%2CInterventionArmGroupLabel%2CPhase%2CLeadSponsorName&min_rnk=1&max_rnk=100&fmt=json"
  );
  const fullStudySearch =
    "https://classic.clinicaltrials.gov/api/query/full_studies?expr=AREA%5BLocationCountry%5DUnited+States+AND+AREA%5BPhase%5DPhase+3+OR+PHASE+2+AND+AREA%5BLeadSponsorClass%5DINDUSTRY+AND+AREA%5BCompletionDateType%5DAnticipated%0D%0A&min_rnk=1&max_rnk=100&fmt=json";
  if (companyName) {
    const response = await axios.get(
      `https://classic.clinicaltrials.gov/api/query/study_fields?expr=AREA%5BPhase%5DPhase+3+OR+PHASE+2+AND+AREA%5BLeadSponsorClass%5DINDUSTRY+AND+AREA%5BCompletionDateType%5DAnticipated&fields=NCTId%2CBriefTitle%2CCondition%2CLeadSponsorName%2CCompletionDate%2CInterventionArmGroupLabel&min_rnk=1&max_rnk=100&fmt=json`
    );
    console.log(response.data.bestMatches);
  } else {
    const response = await axios.get(
      `https://classic.clinicaltrials.gov/api/query/study_fields?expr=AREA%5BPhase%5DPhase+3+OR+PHASE+2+AND+AREA%5BLeadSponsorClass%5DINDUSTRY+AND+AREA%5BCompletionDateType%5DAnticipated&fields=NCTId%2CBriefTitle%2CCondition%2CLeadSponsorName%2CCompletionDate%2CInterventionArmGroupLabel%2&min_rnk=1&max_rnk=100&fmt=json`
    );
    const ongoingTrials = response.data.StudyFieldsResponse.StudyFields.filter(
      (res) => new Date(res.CompletionDate[0]) > new Date()
    );
    console.log(
      Phase3Trials.data.StudyFieldsResponse.StudyFields.filter(
        (res) => new Date(res.CompletionDate[0]) > new Date()
      )
    );
  }
}

app.get("/companyNameAutoComplete", async (req, res) => {
  //   console.log(req.query.query);
  const term = req.query.query;
  const list = await getNames();
  const response = await companyNameSuggestions(term, list);
  if (!response) {
    res.status(200).send(["No Results"]);
  } else {
    // console.log(response);
    response.sort((a, b) => {
      return b.NStudiesWithValue - a.NStudiesWithValue;
    });
    res.send(response).status(200);
  }
});

app.get("/getCompanyStudies", async (req, res) => {
    const term = req.query.query.trim();
    const searchURL = `https://clinicaltrials.gov/api/query/study_fields?expr=${term}+AND+AREA%5BCompletionDate%5DRANGE%5B01%2F01%2F2021%2C+01%2F01%2F2050+%5D+AND+AREA%5BLeadSponsorClass%5DINDUSTRY&fields=NCTId%2CBriefTitle%2CCondition%2CLeadSponsorName%2CCompletionDate&min_rnk=1&max_rnk=1000&fmt=json`
  
  const studies = await axios.get(
    `https://clinicaltrials.gov/api/query/study_fields?expr=${term}+AND+AREA%5BCompletionDate%5DRANGE%5B01%2F01%2F2020%2C+01%2F01%2F2050+%5D+AND+AREA%5BLeadSponsorClass%5DINDUSTRY&fields=NCTId%2CBriefTitle%2CCondition%2CLeadSponsorName%2CCompletionDate%2CInterventionArmGroupLabel%2CCompletionDateType%2CPhase&min_rnk=1&max_rnk=1000&fmt=json`
  );

  const studyGroup = [];

  if (studies.data.StudyFieldsResponse.StudyFields) {
    console.log("Studies");
    console.log(studies.data.StudyFieldsResponse.NStudiesReturned);
    studyGroup.push(...studies.data.StudyFieldsResponse.StudyFields);
    console.log(studyGroup.length)

    
  }

  if (studyGroup.length == 0) {
    console.log('no info')
    res.send("No Results").status(200);
  }

  if (studyGroup.length == 1) {
    res.send(studyGroup).status(200);
  }

//   console.log(studyGroup);

  if (studyGroup.length > 1) {
    studyGroup.sort((a, b) => {
      const dateA = new Date(a.CompletionDate);
      const dateB = new Date(b.CompletionDate);

      // Compare the Date objects
      return dateB - dateA;
    });

    res.send(studyGroup).status(200);
  }
});

async function scrapeNames() {
  const response = await axios.get(
    `https://classic.clinicaltrials.gov/api/query/field_values?expr=AREA%5BLeadSponsorClass%5DINDUSTRY&field=LeadSponsorName&fmt=json`
  );
  const names = response.data.FieldValuesResponse.FieldValues;

  const JSONNames = JSON.stringify(names, null, 2);
  await fs.writeFile(path.join(__dirname, "companyNames"), JSONNames);
}

scrapeNames();

app.listen(5500, console.log("app running"));
