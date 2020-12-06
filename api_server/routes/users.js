var express = require('express');
var usersRouter = express.Router();
var usersHandler = require('../handlers/users')

usersRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

usersRouter.post('/', usersHandler.signUp)

usersRouter.post('/signIn', usersHandler.signIn)

// Admin Function
usersRouter.get('/', usersHandler.getUsersWithReports)

module.exports = usersRouter;