var compression = require('compression');
var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var uglifyMiddleware = require('express-uglify-middleware');
var mongoose = require('mongoose');
var session = require('express-session');

var app = express();
app.use(compression());

hbs.registerPartials(__dirname + '/layout');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/beefcakecoffee');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/view');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// session
app.use(session({secret: "bcc"}));

app.use(sassMiddleware({
    src: __dirname + '/scss',
    dest: __dirname + '/public/css',
    debug: true,
    outputStyle: 'compressed',
    prefix: '/css'
}));
app.use(uglifyMiddleware({
  src: __dirname + '/js',
  dest: __dirname + '/public/js',
  compress: true,
  debug: true,
  prefix: '/js'
}));
app.use(express.static(__dirname + '/public'));
app.use('/images/news', express.static(__dirname + '/writable'));

require('./routes.js')(app);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

hbs.registerHelper("not", function(obj) {
    return !obj;
});

