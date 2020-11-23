var express = require('express');
var reportsRouter = express.Router();
var reportsHandler = require('../handlers/reports')

reportsRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// Usage Example
// reportsRouter.get('/:reportId', reportsHandler.getReport)


module.exports = reportsRouter;