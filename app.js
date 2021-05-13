//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WiKiDB", {useNewUrlParser : true, useUnifiedTopology: true});

const articleshcema = {
    title : String,
    content : String
}

const Article = mongoose.model("Article", articleshcema);

app.get("/articles", function(req,res){
    Article.find({}, function(err, FoundArticles){
        if(err){
            console.log("Error Found : " + err);
            res.send(err);
        }
        else
        {
            res.send(FoundArticles);
        }
    })
})

app.post("/articles", function(req, res){
  var NewArticle=new Article({
      title : req.body.title,
      content : req.body.content
  } );
NewArticle.save(function(err){
    if(err)
    {
        res.send(err);

    }
    else{
        res.send("New Article is saved");
    }
    
})

})



app.delete("/articles", function(req, res){

    Article.deleteMany({}, function(err){
        if(err){
            res.send("Error Found :" + err);
        }
        else{
            res.send("All the articles are deleted. ");
        }
    })
})

///////////////////App.route method /////// For article/articletitle////

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title : req.params.articleTitle}, function(err, reuslt){
        if(err)
        {
            res.send("Error : " + err);
        }
        else{
            res.send(reuslt);
        }
    })
})

.delete(function(req,res){
    Article.deleteOne({title : req.params.articleTitle}, function(err){
        if(err){
            res.send("Error :" + err);
        }
        else{
            res.send("Artile is Deleted");
        }
    })
})

.put(function(req,res){
    Article.update(
        {title : req.params.articleTitle}, 
        {title : req.params.articleTitle,content : req.body.content}, 
        {overwrite:true}, 
        function(err){
        if(err){
            res.send("Error in Update" + err);

        }
        else{
            res.send("Aricle is updated");
        }
    })
})

.patch(function(req,res){
    Article.update(
        {title : req.params.articleTitle}, 
        {$set : req.body}, 
        {overwrite:true}, 
        function(err){
        if(err){
            res.send("Error in Update" + err);

        }
        else{
            res.send("Aricle is updated");
        }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});