const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const expressLayouts = require('express-layouts');
const connectDB = require('./server/database/connection');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Password config
require('./server/controller/passport')(passport);

//connect to mongo
connectDB();


app.use(expressLayouts);
app.set('view engine', 'ejs');

//load static assest
app.use('/js', express.static(path.resolve(__dirname, "js")));

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Password middleware
app.use(passport.initialize());
app.use(passport.session());

//express flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//dotenv call
dotenv.config({ path: '.env' });
const PORT = process.env.PORT || 8080

//Routes
app.use('/', require('./server/routes/index'));
app.use('/users', require('./server/routes/user'));

//log requests
app.use(morgan('tiny'));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});