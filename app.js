//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const { isLoggedIn } = require('./utils/authMiddlewares');

//Database connection
mongoose.connect('mongodb://localhost:27017/reservas-db', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(morgan('dev'));

//Authentication
app.use(passport.initialize());
app.use(passport.session());
const Client = require('./models/client');
passport.use(new LocalStrategy(Client.authenticate()));
passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());

app.use(flash());
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//Routes
const clientRoutes = require('./routes/clients');
const restauranteRoutes = require('./routes/restaurantes');
const mesaRoutes = require('./routes/mesas');
const reservaRoutes = require('./routes/reservas');

app.get('/', isLoggedIn, (req, res)=>{
    res.redirect('/reservas');
});
app.use('/cliente', clientRoutes);
app.use('/restaurante', restauranteRoutes);
app.use('/mesa', mesaRoutes);
app.use('/reservas', reservaRoutes);

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