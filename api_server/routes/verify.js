var express = require('express');
var verifyRouter = express.Router();
var verifyHandler = require('../handlers/verify')

verifyRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// POST 
// Request Body : {
//    "uri" : string
// }
//
// Response body :
// {
//    result : boolean
// }
//
verifyRouter.post('/', verifyHandler.verify)

module.exports = verifyRouter;