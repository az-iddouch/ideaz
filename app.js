const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const helpers = require('./helpers');
const mongoose = require('mongoose');
const ideasController = require('./controllers/ideasController');

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

// Load models
require('./models/Idea');

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port} 🚀🚀🚀🚀`);
});

// handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  next();
});

// ROUTES
// index route
app.get('/', (req, res) => {
  res.render('index');
});

// about
app.get('/about', (req, res) => {
  res.render('about');
});

// add idea
app.get('/ideas/add', ideasController.addIdea);

//static files location
app.use(express.static(path.join(__dirname, 'public')));
