var express = require('express');
var verifyRouter = express.Router();
var verifyHandler = require('../handlers/verify')

verifyRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


verifyRouter.use('/', verifyHandler.verify)

module.exports = verifyRouter;