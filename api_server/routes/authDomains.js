var express = require('express');
var authDomainsRouter = express.Router();
var authDomainsHandler = require('../handlers/authDomains')

var mysql = require('mysql');
var db = mysql.createConnection({
  host : 'database',
  user : 'root',
  password : 'root',
  database : 'fish_and_chips' 
})
db.connect();








authDomainsRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});






// Usage Example
// authDomainsRouter.post('/', authDomainsHandler.checkExistence)


module.exports = authDomainsRouter;
