//init app
const express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const logger = require('morgan');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const config = require('./config/database');

//const { MongoClient, ServerApiVersion } = require('mongodb');

//passport config
require('./config/passport')(passport);


mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

mongoose.connection.on('connected', () => {
    console.log('connected to database' + '  ' + config.database);
    mongoose.set('useCreateIndex', true);

});

//on error
mongoose.connection.on('error', (err) => {
    console.log('database error:' + err)
});


/*const client = new MongoClient(config.database, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/


//set port
const port = process.env.PORT || 3000;
//const port =  3000;

//load view engine

//set template engine
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');



//define static path to use css files etc
app.use(logger('dev'));
//body parser and cookie parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
//parse application json
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
//app.use(express.bodyParser({uploadDir:'./uploads'}));


//express session
app.use(session({
    secret: 'secret',
    cookie: { maxAge:	1800000 }, 
    saveUninitialized: true,
    resave: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flass
app.use(flash());


//define static folders u will use
app.use(express.static(path.join(__dirname, 'node_modules')));
//app.use(express.static(path.join(__dirname +'/node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '/public')));

app.use(function(req, res, next) {
    res.locals.message = req.flash('message');
   res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


//call all the routes
let routes = require('./routes/index');
let listing = require('./routes/listing');
let admin = require('./routes/admin');
//let users = require('./routes/users');

//specify route middleware to start
app.use('/', routes);
app.use('/listing', listing);
app.use('/admin', admin);


//start server
server.listen(port, () => {
    console.log('server started on port' + port);
});