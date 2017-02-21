var express = require('express');
var hbs = require('hbs');
var sassMiddleware = require('node-sass-middleware');
var uglifyMiddleware = require('express-uglify-middleware');

var app = express();

hbs.registerPartials(__dirname + '/layout');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/view');

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

app.get('/', function(req, res){
  res.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
