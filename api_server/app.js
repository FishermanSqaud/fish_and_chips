const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const usersRouter = require('./routes/users')
const authDomainsRouter = require('./routes/authDomains')
const reportsRouter = require('./routes/reports')
require('dotenv').config()

const port = process.env.API_SERVER_PORT
const baseAPIPath = process.env.BASE_API_PATH

app.use(bodyParser.json())

app.use(baseAPIPath + '/users', usersRouter)
app.use(baseAPIPath + '/auth_domains', authDomainsRouter)
app.use(baseAPIPath + '/reports', reportsRouter)

app.get('/', (req, res) => {
    res.send('Sorry, Not Supported Path')
})

app.listen(port, () => {
    console.log(
        `Example app listening at ${port}`
    )
})


