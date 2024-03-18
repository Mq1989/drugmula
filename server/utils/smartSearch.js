const fs = require('fs').promises;

module.exports = async function smartSearch(term) {
    const data = await fs.readFile('scrapedData.json', 'utf-8');
    const list = JSON.parse(data)
    // console.log(list)
    const finalSuggestions = []
    const suggestions1 = list.filter(drug => drug.brandName.toLowerCase().startsWith(term.toLowerCase())).flat()
    // console.log(`suggestions1`)
    // console.log(suggestions1)
    const suggestions3 = list.filter(drug => drug.genericName.toLowerCase().startsWith(term.toLowerCase())).flat();
    // console.log(`suggestions3`)
    // console.log(suggestions3)
    const suggestions2 = list.filter(drug => drug.brandName.split(" ")[1] && drug.brandName.split(" ")[1].toLowerCase().startsWith(term.toLowerCase())).flat()
    // console.log(`suggestions2`)
    // console.log(suggestions2)
    const suggestions4 = list.filter(drug => drug.genericName.split(" ")[1] && drug.genericName.split(" ")[1].toLowerCase().startsWith(term.toLowerCase())).flat()
    // console.log(`suggestions4`)
    // console.log(suggestions4)
    if(suggestions1.length > 0 ) {
        finalSuggestions.push(...suggestions1)
    }
    if(suggestions2.length > 0) {
        finalSuggestions.push(...suggestions2)
    }
    if(suggestions3.length > 0) {
        finalSuggestions.push(...suggestions3)
    }
    if(suggestions4.length > 0) {
        finalSuggestions.push(...suggestions4)
    }
    if(!finalSuggestions) {
        return "No Data"
    }
    console.log(finalSuggestions.flat())

    return finalSuggestions
}