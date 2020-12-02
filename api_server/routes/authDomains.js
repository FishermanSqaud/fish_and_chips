var express = require('express');
var authDomainsRouter = express.Router();
var authDomainsHandler = require('../handlers/authDomains')
  
         
authDomainsRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();

});

authDomainsRouter.post('/', authDomainsHandler.authDomains)

module.exports = authDomainsRouter;
