const express = require("express");
const app = express();
const axios = require("axios");
const formatDate = require("./utils/formatDate");

async function getInfo(term) {
  const data = await axios.get(
    `https://api.fda.gov/drug/drugsfda.json?search=products.brand_name:${term}&limit=1`
  );
  const dataTrials = await axios.get(
    `https://classic.clinicaltrials.gov/api/query/full_studies?expr=${term}&min_rnk=1&max_rnk=29&fmt=json`
  );
  const drugData = data.data.results[0];
  const studies = dataTrials.data.FullStudiesResponse.FullStudies
  console.log(dataTrials.data)
  const name = drugData.products[0].brand_name;
  const body = drugData.openfda;
  let submissions = [];
//   console.log(drugData);
  drugData.submissions.forEach((element) => {
    // console.log('new submission')
    let docHolder = [];
    const docFinal = [];
    const docs = element.application_docs.map((doc) => {
        const docDate = formatDate(doc.date)
        // console.log(doc)
        return {
            "doc date": docDate, 
            "doc url": doc.url,
            "doc type":doc.type
        }
    //   doc.forEach((innerDoc) => docHolder.push(innerDoc));
    });
    // console.log(`doc list`)
    // console.log(docs)
    // docFinal.push(docs)
  
    submissions.push({
      "submission type": element.submission_class_code_description,
      "initial lanch": (element.submission_class_code_description == 'Type 5 - New Formulation or New Manufacturer' || element.submission_class_code_description == 'Type 1 - New Molecular Entity') ? true : false,
      "submission date": formatDate(element.submission_status_date),
      "docs": docs.flat()[0]
    });
  });
  console.log(submissions);
}

app.listen(5500, console.log("app running"));

getInfo(`Dupixent`);
