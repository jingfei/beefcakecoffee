var md5 = require('md5');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var NEWS_IMAGE_PATH = path.resolve(__dirname, 'writable/');
var upload = multer({dest: NEWS_IMAGE_PATH});
var IMAGE_TYPES = ['image/jpeg', 'image/png'];
var winston = require('winston');

var logger = new winston.Logger({
  level: 'error',
  transports: [
    new (winston.transports.File)({ filename: 'error.log' })
  ]
});

/* define posts model */
var postSchema = mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  hidden: { type: Boolean, default: false },
});
postSchema.index({ title: "text", description: "text" });
var Post = mongoose.model("Post", postSchema);

/* deploy */
const exec = require("child_process").exec;
const async = require("async");

const projectPath = process.argv[2];
const absolutePath = __dirname;
const cmds = ["git status", "git checkout -- public view scss layout js", "git pull"].concat(process.argv.filter((arg, index) => { return index > 2; }));

const execCmds = cmds.map((cmd) => {
  return function(callback) {
    exec(`cd ${absolutePath} && ${cmd}`, {maxBuffer: 1024 * 600}, (err, stdout, stderr) => {
      if(err) return callback(err);
      callback(null, `--- ${cmd} ---:\n stdout: ${stdout} \n stderr: ${stderr}\n`);
    });
  };
});

const updateProject = function(callback) {
  async.series(
    execCmds
    , function(err, results) {
      if(err) return callback(err);
      return callback(null, results.join(""));
    });
};

module.exports = function (app) {

  app.get('/', function(req, res){
    res.render('index', { 
      title: "猛男咖啡 Beefcake Coffee Roaster",
      description: "home - 猛男咖啡 beefcake coffee - Enjoy everything about Coffee",
      menu_home: true,
      bigimg: true,
      url: req.protocol + '://' + req.get('host') + req.originalUrl
    });
  });

  app.get('/sitemap', function(req, res){
    res.sendfile(__dirname+'/view/sitemap.xml');
  });
  
  app.get('/home', function(req, res){
    res.render('index', { 
      title: "猛男咖啡 Beefcake Coffee Roaster",
      description: "home - 猛男咖啡 beefcake coffee - Enjoy everything about Coffee",
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      menu_home: true
    });
  });
  
  app.get('/story', function(req, res) {
    res.render('story', {
      title: "品牌故事 - 猛男咖啡 Beefcake Coffee Roaster",
      description: "story - 猛男咖啡 beefcake coffee - Enjoy everything about Coffee",
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      menu_story: true
    });
  });
  
  app.get('/venue', function(req, res) {
    res.render('venue', {
      title: "場地租借 - 猛男咖啡 Beefcake Coffee Roaster",
      description: "venue - 猛男咖啡 beefcake coffee - Enjoy everything about Coffee",
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      menu_venue: true
    });
  });
  
  app.get('/about', function(req, res) {
    res.render('about', {
      title: "分店資訊 - 猛男咖啡 Beefcake Coffee Roaster",
      description: "about - 猛男咖啡 beefcake coffee - Enjoy everything about Coffee",
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      menu_about: true
    });
  });

  app.get('/menu', function(req, res) {
    res.render('menu', {
      title: "猛男大成店菜單 - 猛男咖啡 Beefcake Coffee Roaster",
      description: "menu - 猛男咖啡 beefcake coffee - Enjoy everything about Coffee",
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      menu_menu: true
    });
  });

  app.get('/menu2', function(req, res) {
    res.render('menu2', {
      title: "猛男安平店菜單 - 猛男咖啡 Beefcake Coffee Roaster",
      description: "menu 2.0 - 猛男咖啡 beefcake coffee - Enjoy everything about Coffee",
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      menu_menu2: true
    });
  });
  
  app.get('/joinus', function(req, res) {
    res.render('joinus', {
      title: "加入我們 - 猛男咖啡 Beefcake Coffee Roaster",
      description: "join us - 猛男咖啡 beefcake coffee - Enjoy everything about Coffee",
      url: req.protocol + '://' + req.get('host') + req.originalUrl
    });
  });
  
  app.get('/prof', function (req, res) {
    res.render('prof', {
      title: "專業證照/器材 - 猛男咖啡 Beefcake Coffee Roaster",
      description: "cert/mech - 猛男咖啡 beefcake coffee - Enjoy everything about Coffee",
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      menu_prof: true
    });
  });   

  app.get('/news', function(req, res) {
    var key = req.query.key;
    var searchKey = {};
    if(key)  {
      try {
        searchKey = { $or: [ {
          title: new RegExp(RegExp.escape(key), "gi")}, 
          {content: new RegExp(RegExp.escape(key), "gi")} ] };
      } catch(err) {
        key = '';
        logger.log('error', 'Regular Expression: %s',err);
      }
    }
    Post.find(searchKey, null, {sort: {date: -1}}, function(err, resPost) {
      if(err) logger.log('error', 'news page error message: %s', err);
      const monthNames = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
      if(resPost)
        resPost = resPost.map(function(item) { 
          var d = item.date.getDate();
          var m = monthNames[item.date.getMonth()];
          var y = item.date.getFullYear();
          item.dateFormat = m + "月 " + d + ", " + y;
          return item;
        });
      res.render('news', {
        title: "最新消息 - 猛男咖啡 Beefcake Coffee Roaster",
        description: "news - 猛男咖啡 beefcake coffee - Enjoy everything about Coffee",
        menu_news: true,
        key: key,
        url: req.protocol + '://' + req.get('host') + req.originalUrl,
        resPost: resPost
      });
    });
  });

  app.post('/login', function(req, res) {
    var post = req.body;
    if(post.user === 'beefcakecoffee' && md5(post.password) === '0c52b9aeec07bb216a1c6cf46e33510b') {
      req.session.user = "beefcakecoffee";
      res.redirect('/viewposts');
    } else {
      res.redirect('/');
    }
  });

  app.get('/login', function(req, res) {
    res.render('login', {
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      title: "登入 - 猛男咖啡 Beefcake Coffee Roaster"
    });
  });
  
  app.get('/logout', function (req, res) {
    delete req.session.user_id;
    req.session.destroy();
    res.redirect('/');
  });   
  
  app.get('/viewposts', checkAuth, function(req, res) {
    Post.find({}, null, {sort: {date: -1}}, function(err, resPost) {
      const monthNames = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
      resPost = resPost.map(function(item) { 
        var d = item.date.getDate();
        var m = monthNames[item.date.getMonth()];
        var y = item.date.getFullYear();
        item.dateFormat = m + "月 " + d + ", " + y;
        return item;
      });
      res.render('viewposts', {resPost: resPost});
    });
  });

  app.post('/newpost', checkAuth, function(req, res) {
    var postInfo = req.body;
    postInfo.title = unescape(postInfo.title);
    postInfo.content = unescape(postInfo.content);
    if( !postInfo.title || !postInfo.content) {
      postInfo.type = "error";
      postInfo.message = "Please fill in both title and content.";
      res.json(postInfo);
    } else {
      var newPost = new Post({
        title: postInfo.title,
        content: postInfo.content
      });

      newPost.save(function(err, Post){
        if(err) {
          postInfo.type = "error";
          postInfo.message = "Database error.";
          res.json(postInfo);
        } else {
          res.send("success");
        }
      });
    }
  });

  app.put('/updatepost/:id', checkAuth, function(req, res) {
    var postInfo = req.body;
    postInfo.title = unescape(postInfo.title);
    postInfo.content = unescape(postInfo.content);
    Post.findByIdAndUpdate(req.params.id, postInfo, function(err, putRes) {
      if(err) {
        postInfo.type = "error";
        postInfo.message = "Error in updating person with id "+req.params.id;
        res.json(postInfo);
      } else {
        res.send("success");
      }
    });
  });

  app.delete('/deletepost/:id', checkAuth, function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err, deleteRes){
      if(err) {
        postInfo.type = "error";
        postInfo.message = "Error in deleting record id "+req.params.id;
        res.json(postInfo);
      } else {
        if(deleteRes.content) {
          var regex = /src="\/images\/news\/([\w-]{32})"/g;
          var regResult = (deleteRes.content).match(regex);
          if(regResult) {
            regResult = new Set(regResult);
            for(var i=0; i<regResult.length; ++i) {
              regResult[i] = regResult[i].slice(18,-1);
              fs.unlink(__dirname+"/writable/"+regResult[i]);
            }
          }
        }
        res.send("success");
      }
    });
  });

  app.post('/admin/upload', checkAuth, upload.any(), function(req, res) {
    var file = req.files[0];

    res.json({
      "data": {
        "width": "500",
        "link": "/images/news/"+file.filename,
        "total": file.size
      }
    });
  });

  app.post('/deploy', function(req, res) {
    updateProject((e, result) => {
      var response = "";
      if(e) {
        console.error(`exec error: ${e}`);
        response += `exec error: ${e}`;
      }
      if(result) {
        console.log(result);
        response += `\n ${result}`;
      }
      res.end(response);
    });
  });
  
};

function checkAuth(req, res, next) {
  if (req.session.user !== "beefcakecoffee") {
    res.redirect('/');
  } else {
    next();
  }
}

RegExp.escape= function(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

