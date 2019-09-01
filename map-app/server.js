const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const port = 3001
const path = require('path');


app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => res.send('Hello World!'))
