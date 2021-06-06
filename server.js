const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=>{
	res.render('index', {});
})


app.listen(PORT, ()=>console.log(`The server is started at PORT : ${PORT}`));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MDB_CONNECT,{useNewUrlParser: true, useUnifiedTopology: true}, (err)=> {
    if(err) return console.error(err);
    console.log('Connected to MongoDB');
})


//use Router
app.use('/user/', require('./router/userRouter'));
app.use('/course/', require('./router/courseRouter'));
