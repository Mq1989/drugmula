module.exports = async function companyNameSuggestions(term, list) {
    // console.log(term)
    // console.log(list)

    const allSuggestions = [];
    
    list.forEach(element => {
        let searchWord = term
        // console.log(element)
        let wordList = element.FieldValue.split(" ");
        wordList.forEach(word => {
            let searchie = searchWord.toLowerCase()
            let lowerWord = word.toLowerCase()
            if (lowerWord.startsWith(searchie)) {
                // console.log(`true`)
                allSuggestions.push(element)
            }
            else return
            
        })
        
    });

    const searcho = term.toLowerCase();
    list.forEach(element => {
        // Compare the entire FieldValue, in lowercase, to the search term
        if (element.FieldValue.toLowerCase().includes(searcho) && !allSuggestions.includes(element)) {
            allSuggestions.push(element);
        }
    });
  
    // const suggestions1 = list.filter(text => text.FieldValue.toLowerCase().startsWith(term.toLowerCase()));
    // const suggestions2 = list.filter(text => text.FieldValue.split(" ")[1] && text.FieldValue.split(" ")[1].toLowerCase().startsWith(term.toLowerCase()))
    // if(!suggestions1 && !suggestions2) {
    //     return "No Matches"
    // }
    // if(!suggestions1 && suggestions2) {
    //     return suggestions2
    // }
    // if(!suggestions2 && suggestions1) {
    //     return suggestions1
    // }

    if (allSuggestions.length>0) {
        return allSuggestions
    }

}