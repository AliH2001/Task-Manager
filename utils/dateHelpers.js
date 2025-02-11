function formatDate(string){
    const date = new Date(string)
    return date.toDateString();
}

module.exports = formatDate