const axios = require('axios')

module.exports = async function bigSearch(term) {
    const searhResults = await axios.get(`https://rxnav.nlm.nih.gov/REST/displaynames.json`);
    const list = searhResults.data.displayTermsList;
    const suggestions1 = list.term.filter(text => text.toLowerCase().startsWith(term.toLowerCase()));
    const suggestions2 = list.term.filter(text => text.split(" ")[1] && text.split(" ")[1].toLowerCase().startsWith(term.toLowerCase()))
    if(!suggestions1 && !suggestions2) {
        return "No Matches"
    }
    if(!suggestions1 && suggestions2) {
        return suggestions2
    }
    if(!suggestions2 && suggestions1) {
        return suggestions1
    }

    return suggestions1.concat(suggestions2)
}