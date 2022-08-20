// As early as possible in your application, import and configure dotenv:
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
// require('dotenv').config();


const express = require('express');
const app = express();
const Coffeeshop = require('./models/coffeeshop');
const Review = require('./models/review');
var path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');

const MongoStore = require("connect-mongo")(session);

//Express Mongoose Sanitize
const mongoSanitize = require('express-mongo-sanitize');



const axios = require('axios').default;
const methodOverride = require('method-override');

// Error Handling. 
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError'); 
const {coffeeshopSchema, reviewSchema} = require('./schemas'); 

// ROUTES
const coffeeshopRoutes = require('./routes/coffeeshops'); 
const reviewRoutes = require('./routes/reviews'); 
const userRoutes = require('./routes/users');


// PASSPORT VALIDATION FOR USER, PASSPORT PASSPORT-LOCAL PASSPORT-LOCAL-MONGOOSE
const passport = require('passport');
const LocalStrategy = require('passport-local'); 
const User = require('./models/user');


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/coffee-shop';


const mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}



// Use ejs mate, which we could render our template by express. 
const ejsMate = require('ejs-mate');
const { response, urlencoded } = require('express');
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // so you can render('index')

// Helmet && Content security policy. 
// app.use(helmet()); //including this breaks the CSP
 
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dep2h8x8y/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dep2h8x8y/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dep2h8x8y/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dep2h8x8y/" ];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dep2h8x8y/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dep2h8x8y/" ],
            childSrc   : [ "blob:" ]
        }
    })
);



// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// Parse req.body 
app.use(express.urlencoded({extended: true}))

// So We Can Use Public Folder. 
app.use(express.static(path.join(__dirname, 'public')));

const store = new MongoStore({
    url: dbUrl, 
    secret: "thisisgonnabeabigsecret",
    touchAfter: 24*60*60
});

// Express-Session 
const sessionConfig = { 
    store,
    name: 'IAMSESSION', 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
     } 
}
app.use(session(sessionConfig)); 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// FOR Express Mongoose Sanitize
// To remove data using these defaults:
app.use(mongoSanitize());

// Or, to replace these prohibited characters with _, use:
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);




app.use((req, res, next) => {
    res.locals.currentUser = req.user; 
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error');
    next();
})






app.use('/coffeeshops', coffeeshopRoutes);
app.use('/coffeeshops/:id/reviews', reviewRoutes); 

app.use('/', userRoutes); 






app.get('/', async(req, res) => {
    res.render("home")
})









app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})



app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh no, Something went wrong!!!'; 
    res.status(statusCode).render('error', {err});  
})


















const port = process.env.PORT || 3000; 


app.listen(port, () => {
    console.log('It worked!!!')
})