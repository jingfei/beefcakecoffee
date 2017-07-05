var md5 = require('md5');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var NEWS_IMAGE_PATH = path.resolve(__dirname, 'writable/');
var upload = multer({dest: NEWS_IMAGE_PATH});
var IMAGE_TYPES = ['image/jpeg', 'image/png'];

/* define posts model */
var postSchema = mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  hidden: { type: Boolean, default: false }
});
var Post = mongoose.model("Post", postSchema);

/* deploy */
const exec = require("child_process").exec;
const async = require("async");

const projectPath = process.argv[2];
const absolutePath = __dirname;
const cmds = ["git pull"].concat(process.argv.filter((arg, index) => { return index > 2; }));

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
  
  app.get('/venue', function(req, res) {
    res.render('venue', {
      title: "場地租借 - 猛男咖啡 Beefcake Coffee Roaster",
      menu_venue: true
    });
  });
  
  app.get('/about', function(req, res) {
    res.render('about', {
      title: "分店資訊 - 猛男咖啡 Beefcake Coffee Roaster",
      menu_about: true
    });
  });
  
  app.get('/news', function(req, res) {
    Post.find({}, null, {sort: {date: -1}}, function(err, resPost) {
      const monthNames = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
      resPost = resPost.map(function(item) { 
        var d = item.date.getDate();
        var m = monthNames[item.date.getMonth()];
        var y = item.date.getFullYear();
        item.dateFormat = m + "月 " + d + ", " + y;
        return item;
      });
      res.render('news', {
        title: "最新消息 - 猛男咖啡 Beefcake Coffee Roaster",
        menu_news: true,
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
      title: "登入 - 猛男咖啡 Beefcake Coffee Roaster"
    });
  });
  
  app.get('/logout', function (req, res) {
    delete req.session.user_id;
    req.session.destroy();
    res.redirect('/');
  });   
  
  app.get('/my_secret_page', checkAuth, function (req, res) {
    res.send('if you are viewing this page it means you are logged in');
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
    Post.findByIdAndUpdate(req.params.id, req.body, function(err, putRes) {
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
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

