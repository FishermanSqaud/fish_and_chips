var express = require('express');
var reportsRouter = express.Router();
var reportsHandler = require('../handlers/reports')

// POST (GET not used for uri overlapp)
// Request body : 
// {
//   spam_domain :  string
// }
//
// Response body :
// {
//    id : int,
//    spam_domain : string,
//    user_id : int,
//    title : string,
//    content : string,
//    created_time : timestamp,
// }
//
reportsRouter.post('/check', reportsHandler.getReportsOfDomain)

// GET
//
// Response body : {
//   reports : []   
// }
//
reportsRouter.get('/', reportsHandler.getReports)

// POST
// Request body : 
// {
//  spam_domain : string,
//  user_id : int, --------> TODO : Removed (Use Login Token in Header)
//  title : string,
//  content : string
// }
//
// Response body : 성공여부 text
//
reportsRouter.post('/', reportsHandler.createReport)


// PATCH
// Request body : 
// {
//  title : string,
//  content : string
// }
//
// Response body : 성공여부 text
//
reportsRouter.patch('/:reportId', reportsHandler.updateReport)

// DELETE
// Response body : 성공여부 text
//
reportsRouter.delete('/:reportId', reportsHandler.deleteReport)


module.exports = reportsRouter;