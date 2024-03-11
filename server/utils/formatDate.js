module.exports = function formatDate(dateString) {
    // Parse the string
    let year = dateString.substring(0, 4);
    let month = dateString.substring(4, 6);
    let day = dateString.substring(6, 8);
  
    // JavaScript months are 0-indexed (0 for January, 1 for February, etc.), so subtract 1
    let date = new Date(year, month - 1, day);
  
    // Options for the toLocaleDateString method
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
  
    // Format the date
    return date.toLocaleDateString('en-US', options);
  }