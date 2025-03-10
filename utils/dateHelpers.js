function formatDate(string) {
    if (!string) return ""; // Return an empty string if there is no date//
    const date = new Date(string);
    return date.toISOString().split('T')[0];
}

module.exports = formatDate;
