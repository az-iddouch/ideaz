const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const helpers = require('./helpers');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressValidator = require('express-validator');

// Load models
require('./models/Idea');
require('./models/User');

const routes = require('./routes/index');

// import passport settings
require('./passport');

const app = express();
// connect to our mongoDB
mongoose
  .connect(
    'mongodb://localhost/ideaz-dev',
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => console.log('✔✔✔✔ Database Connected ... 💪💪💪'))
  .catch(err => console.log(err));

// handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body parser meddleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//static files location
app.use(express.static(path.join(__dirname, 'public')));

// express session midleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passwport middleware
app.use(passport.initialize());
app.use(passport.session());

// for flashing users
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  next();
});

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port} 🚀🚀🚀🚀`);
});
