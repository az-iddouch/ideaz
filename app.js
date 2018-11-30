const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const helpers = require('./helpers');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Load models
require('./models/Idea');
const routes = require('./routes/index');

const app = express();
// connect to our mongoDB
mongoose
  .connect(
    'mongodb://localhost/ideaz-dev',
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log('✔✔✔✔ Database Connected ... 💪💪💪'))
  .catch(err => console.log(err));

// handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  next();
});

// Body parser meddleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//static files location
app.use(express.static(path.join(__dirname, 'public')));

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port} 🚀🚀🚀🚀`);
});
