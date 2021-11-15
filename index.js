const express= require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
var { establishConnection } = require('./connect-database');
establishConnection();
const app=express();
const users = require('./controllers/users');
const applyPassportStrategy = require('./passport');

// Set up CORS
app.use(cors());

applyPassportStrategy(passport);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use("/users",users)

const port=9000;
app.listen(port, () =>{
    console.log('Server started', port);
})