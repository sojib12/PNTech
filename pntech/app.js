const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// jquery = require('jquery');

mongoose.connect('mongodb://localhost/pntech');
let db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('Connected to Mongodb');
});

//check for db errors
db.on('error', function(err){
  console.log(err);
});




//init app
var app = express();

//bring in models
let Article = require('./models/article');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname, 'public')));


//home route
app.get('/',function(req, res) {
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index',{
        title:'Articles',
        articles: articles
      });
    }
    });
  });
/*  let article = [
    {
      id:1,
      title:'article one',
      author:'Sojib',
      body:'this is article one'
    },
    {
      id:2,
      title:'article two',
      author:'Sojib',
      body:'this is article two'
    },
    {
      id:3,
      title:'article three',
      author:'Sojib',
      body:'this is article three'
    }
  ];*/

//get single articles
app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article',{
      article:article
    });
  });
});


//add route
app.get('/articles/add', function(req, res){
  res.render('add_article',{
    title:'Add Article'
  });
});

//add submit post route
app.post('/articles/add', function(req, res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

//load update form
app.get('/article/update/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('update_article',{
      title:'Update Article',
      article:article
    });
  });
});

//update submit post route
app.post('/articles/update/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

//delete article
app.delete('/article/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

//start server
app.listen(3000, function(){
  console.log('server started on port 3000.....');
});
