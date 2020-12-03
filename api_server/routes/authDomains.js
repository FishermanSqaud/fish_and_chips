var express = require('express');
var authDomainsRouter = express.Router();
var authDomainsHandler = require('../handlers/authDomains')
  
// POST (GET not used for uri overlapp)
// Reqeust Body : 
// {
//   uri :  
// }
//
// Response body :
// {
//    isAuthenticated : boolean
// }
//
authDomainsRouter.post('/check', authDomainsHandler.checkIfAuthDomain)

// POST 
// Reqeust Body : 
// {
//   uri :  
// }
//
// Response body : 성공여부 text
//
authDomainsRouter.post('/', authDomainsHandler.registerAuthDomain)


// PATCH
// Reqeust Body : 
// {
//   uri :  
// }
//
// Response body : 성공여부 text
//
authDomainsRouter.patch('/:authDomainId', authDomainsHandler.updateAuthDomain)


// DELETE
// Response body : 성공여부 text
//
authDomainsRouter.delete('/:authDomainId', authDomainsHandler.deleteReport)

module.exports = authDomainsRouter;
