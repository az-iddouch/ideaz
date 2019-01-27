const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const helpers = require('./helpers');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// HandlebarsIntl.registerWith(exphbs);

// Load models
require('./models/Idea');
require('./models/User');
require('./models/Categorie');

const Categorie = mongoose.model('Categorie');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

const routes = require('./routes/index');

// import passport settings
require('./passport');

const app = express();

// connect to our mongoDB
mongoose
  .connect(
    process.env.DATABASE,
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => console.log('✔✔✔✔ Database Connected ... 💪💪💪'))
  .catch(err => console.log(err));

const hbs = exphbs.create({
  defaultLayout: 'main',
  // Creating handlebars custom helpers
  helpers: {
    checkEquals: function(a, b, options) {
      return a.equals(b) ? options.fn(this) : options.inverse(this);
    },
    checkIfSup: function(a, b, options) {
      if (a > b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    checkIfInf: function(a, b, options) {
      if (a < b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    prevPage: function(page) {
      return page - 1;
    },
    nextPage: function(page) {
      return page + 1;
    }
  }
});

// handlebars middleware
app.engine('handlebars', hbs.engine);
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
app.use(async (req, res, next) => {
  try {
    // to have categories available all through our application
    const categories = req.user && (await Categorie.find({ owner: req.user._id }));
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.categories = categories || null;
    next();
  } catch (err) {
    console.log(err);
  }
});

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port} 🚀🚀🚀🚀`);
});
