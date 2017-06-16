var md5 = require('md5');

module.exports = function (app) {

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
  
  app.post('/login', function(req, res) {
    var post = req.body;
    if(post.user === 'beefcakecoffee' && md5(post.password) === '0c52b9aeec07bb216a1c6cf46e33510b') {
      req.session.user = "beefcakecoffee";
      // req.session.destroy();
      res.redirect('/viewposts');
    } else {
      res.redirect('/');
    }
  });

  app.get('/login', function(req, res) {
    res.render('login', {
      title: "登入 - 猛男咖啡 Beefcake Coffee Roaster"
    });
  });
  
  app.get('/logout', function (req, res) {
    delete req.session.user_id;
    res.redirect('/');
  });   
  
  app.get('/my_secret_page', checkAuth, function (req, res) {
    res.send('if you are viewing this page it means you are logged in');
  });

  app.get('/viewposts', checkAuth, function(req, res) {
    res.render('viewposts');
  });
  
};

function checkAuth(req, res, next) {
  if (req.session.user !== "beefcakecoffee") {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

