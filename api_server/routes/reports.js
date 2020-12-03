var express = require('express');
var reportsRouter = express.Router();
var reportsHandler = require('../handlers/reports')

// POST (GET not used for uri overlapp)
// body : {
//   spam_domain :  
// }
reportsRouter.post('/check', reportsHandler.getReportsOfDomain)

// POST
// body : {
//  spam_domain : 
//  user_id :
//  title :
//  content :
// }
reportsRouter.post('/', reportsHandler.createReport)

reportsRouter.patch('/:reportId', reportsHandler.updateReport)

reportsRouter.delete('/:reportId', reportsHandler.deleteReport)


module.exports = reportsRouter;