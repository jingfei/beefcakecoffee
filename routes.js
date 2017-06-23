var md5 = require('md5');
var mongoose = require('mongoose');
var mime = require('mime');
var path = require('path');
var NEWS_IMAGE_PATH = path.resolve(__dirname, '../writable/');
var IMAGE_TYPES = ['images/jpeg', 'image/png'];

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
/*
  app.post('/admin/upload', checkAuth, function(req, res) {
    var is;
    var os;
    var targetPath;
    var targetName;
    var tempPath = req.files.file.path;
    //get the mime type of the file
    var type = mime.lookup(req.files.file.path);
    //get the extension of the file
    var extension = req.files.file.path.split(/[. ]+/).pop();

    //check to see if we support the file type
    if (IMAGE_TYPES.indexOf(type) == -1) {
    return res.send(415, 'Supported image formats: jpeg, jpg, jpe, png.');
    }

    //create a new name for the image
    targetName = uid(22) + '.' + extension;

    //determine the new path to save the image
    targetPath = path.join(TARGET_PATH, targetName);

    //create a read stream in order to read the file
    is = fs.createReadStream(tempPath);

    //create a write stream in order to write the a new file
    os = fs.createWriteStream(targetPath);

    is.pipe(os);

    //handle error
    is.on('error', function() {
        if (err) {
        return res.send(500, 'Something went wrong');
        }
        });

    //if we are done moving the file
    is.on('end', function() {

        //delete file from temp folder
        fs.unlink(tempPath, function(err) {
            if (err) {
            return res.send(500, 'Something went wrong');
            }

            //send something nice to user
            res.render('image', {
nametargetName,
typetype,
exteion: extension
});

            });//#end - unlink
        });//#end - on.end
  });
  */

  app.get('/deploy', function(req, res) {
    console.log("deploy");
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

