var express = require('express');
var authDomainsRouter = express.Router();
var authDomainsHandler = require('../handlers/authDomains')

/*

CREATE DATABASE IF NOT EXISTS fish_and_chips;

USE fish_and_chips;

CREATE TABLE IF NOT EXISTS authenticated_domains (  
    id INTEGER AUTO_INCREMENT NOT NULL,
    domain TEXT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);


var mysql = require('mysql');
var db = mysql.createConnection({
  host : 'root',
  user : 'root',
  password : 'root',
  database : '' 
})
db.connect();


*/


authDomainsRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});






// Usage Example
// authDomainsRouter.post('/', authDomainsHandler.checkExistence)


module.exports = authDomainsRouter;
