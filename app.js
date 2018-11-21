const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

// handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// index route
app.get('/', (req, res) => {
  res.render('index');
});

// about
app.get('/about', (req, res) => {
  res.render('about');
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port} 🚀🚀🚀🚀`);
});

//static files location
app.use(express.static(path.join(__dirname, 'public')));
