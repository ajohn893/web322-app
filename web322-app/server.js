/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: --Aaron John Bivera-- Student ID: --156486201-- Date: --06/06/2022--
*
*  Online (Heroku) URL: ________________________________________________________
*
*  GitHub Repository URL: ______________________________________________________
*
********************************************************************************/ 

const express = require("express");
const app = express();
const path = require("path");
const blog = require("./blog-service")
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.get("/", function(req,res){
  res.redirect("/about");
});

app.get("/about", function(req,res){
  res.sendFile(path.join(__dirname, "./views/about.html"));
});

app.get("/blog", function(req,res){
  blog
    .getPublishedPosts().then((data) => {
      res.json({data})
    })
    .catch((err) => {
      res.json({message: err})
    })
})
app.get("/posts", function(req,res){
  blog
    .getAllPosts().then((data) => {
      res.json({data})
    })
    .catch((err) => {
      res.json({message: err})
    })
  })
app.get("/categories", function(req,res){
    blog
      .getCategories().then((data) => {
        res.json({data})
      })
      .catch((err) => {
        res.json({message: err})
      })
})

app.get("*", (req, res) => {
	res.status(404).send(" 404 Page Not Found ⚠️");
});

blog
  .initialize().then(function() {
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on ${HTTP_PORT}`);
    });
  })
  .catch((error) => {
        console.log(error);
      });
  