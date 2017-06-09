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
  res.render('index', { 
    title: "猛男咖啡 Beefcake Coffee Roaster",
    menu_home: true,
    bigimg: true
  });
});

app.get('/home', function(req, res){
  res.render('index', { 
    title: "猛男咖啡 Beefcake Coffee Roaster",
    menu_home: true
  });
});

app.get('/story', function(req, res) {
  res.render('story', {
    title: "品牌故事 - 猛男咖啡 Beefcake Coffee Roaster",
    menu_story: true
  });
});

app.get('/news', function(req, res) {
  res.render('news', {
    title: "最新消息 - 猛男咖啡 Beefcake Coffee Roaster",
    menu_news: true
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

hbs.registerHelper("not", function(obj) {
    return !obj;
});

