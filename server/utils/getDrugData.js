const axios = require("axios");
const formatDate = require("./formatDate");
const patentData = require('../patent_data')
const excluData = require('../exclusivity_data')

module.exports = async function getInfo(term) {
  const multiFieldSearchExample =
    "https://api.fda.gov/drug/drugsfda.json?search=submissions.submission_number:41AND+application_number:NDA021395&limit=1";
  const data = await axios.get(
    `https://api.fda.gov/drug/drugsfda.json?search=products.brand_name:${term}&limit=1`
  );
  const label = await axios.get(
    `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${term}`
  );
  const labelResults = label.data.results;
  const dataTrials = await axios.get(
    `https://classic.clinicaltrials.gov/api/query/full_studies?expr=${term}&min_rnk=1&max_rnk=29&fmt=json`
  );
  const drugData = data.data.results[0];
  const studies = dataTrials.data.FullStudiesResponse.FullStudies;
  //   console.log(dataTrials.data);
  const name = drugData.products[0].brand_name;
  const body = drugData.openfda;
  const appNo = drugData.openfda.application_number
  console.log(body)
  const patent_body = patentData.filter(data => data.Appl_No == appNo[0].slice(3).toString())
  const exclu_body = excluData.filter(data => data.Appl_No == appNo[0].slice(3).toString())
  console.log(exclu_body)
  console.log(patent_body)
  let submissions = [];
  // console.log(drugData.submissions);
  drugData.submissions.forEach((element) => {
    // console.log('new submission')
    const docs =
      element.application_docs &&
      element.application_docs.map((doc) => {
        const docDate = formatDate(doc.date);
        // console.log(doc)
        return {
          "doc date": docDate,
          "doc url": doc.url,
          "doc type": doc.type,
        };
        //   doc.forEach((innerDoc) => docHolder.push(innerDoc));
      });
    // console.log(`doc list`)
    // console.log(docs)
    // docFinal.push(docs)

    submissions.push({
      "submission type": element.submission_class_code_description,
      "initial launch": element.submission_type == "ORIG" ? true : false,
      "submission date": formatDate(element.submission_status_date),
      docs: docs && docs.length > 1 && docs.flat()[0],
    });
  });
  //   console.log(submissions);
  const launchDate = submissions.find((sub) => sub["initial launch"] == true)[
    "submission date"
  ];
  const returnData = {
    name: name,
    details: body,
    submissions: submissions,
    launch_date: launchDate,
    new_indications: submissions.filter(
      (sub) => sub["submission type"] == "Efficacy"
    ),
    relatedStudies: studies,
    indications: labelResults[0].indications_and_usage,
    description: labelResults[0].description,
    patent_data: patent_body,
    exclu_data: exclu_body
  };
  //   console.log(returnData)
  console.log(returnData);
  return returnData
};
