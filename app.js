//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');

//Database connection
mongoose.connect('mongodb://localhost:27017/reservas-db', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', ()=>{
    console.log('Database connected');
});

//Express
const app = express();
//Express properties
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware
const sessionConfig = {
    secret: "notagoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24,
        maxAge: 1000*60*60*24
    }
}
app.use(session(sessionConfig));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

//Authentication
app.use(passport.initialize());
app.use(passport.session());
const Client = require('./models/client');
passport.use(new LocalStrategy(Client.authenticate()));
passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});

//Routes
const clientRoutes = require('./routes/clients');
const { isLoggedIn } = require('./utils/authMiddlewares');

app.get('/', isLoggedIn, (req, res)=>{
    res.render('home');
});
app.use('/cliente', clientRoutes);

//Error Handling
app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next)=>{
    const { statusCode=500 } = err;
    if(!err.message) err.message = 'Algo fue mal';
    res.status(statusCode).render('error', {err});
});

//Start server
app.listen(3003, ()=>{
    console.log("Server is up at port 3003");
});