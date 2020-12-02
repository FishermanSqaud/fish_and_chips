var express = require('express');
var verifyRouter = express.Router();
var verifyHandler = require('../handlers/verify')

verifyRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// POST 
// Header : Content-Type : application/json
// Body : {
//    "uri" : {검사하고 싶은 uri} 
// }
//
verifyRouter.post('/', verifyHandler.verify)

module.exports = verifyRouter;