const formatDate = require('../utils/dateHelpers')

const addFormatDateToViews = (req, res, next) => {
    res.locals.formatDate = formatDate
    next()
}


module.exports = addFormatDateToViews