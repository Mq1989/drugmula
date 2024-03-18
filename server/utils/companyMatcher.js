module.exports = function companyMatch(companyName) {
    if (companyName == "UCB, Inc.") {
        return "UCBJY"
    }
    if (companyName == "Janssen Biotech, Inc") {
        return "JNJ"
    }
    if (companyName == "Allergan, Inc") {
        return "ABBV"
    }
    if (companyName == "Janssen Biotech, Inc") {
        return "JNJ"
    }
    if (companyName == "Wallace Pharmaceuticals Inc.Meda Pharmaceuticals Inc.") {
        return "Private Company"
    }
    if (companyName == "TOLMAR Inc.") {
        return "Private Company"
    }
    if (companyName == "Chiesi USA, Inc.") {
        return "Private Company"
    }
    if (companyName == "AMAG Pharmaceuticals, Inc.") {
        return "Acquired by Covis Pharma (private company)"
    }
}