var express = require('express');
var authDomainsRouter = express.Router();
var authDomainsHandler = require('../handlers/authDomains')

authDomainsRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// Usage Example
// authDomainsRouter.post('/', authDomainsHandler.checkExistence)


module.exports = authDomainsRouter;