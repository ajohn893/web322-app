

let posts = []
let categories = []
 const fs = require("fs")
 exports.initialize = function() {
   return new Promise(function(resolve, reject) {
     fs.readFile("./data/posts.json", "utf8", function (err, data) {
       if (err) {
         reject("Unable to read the posts file!")
         return
       }
       try {
         posts = JSON.parse(data)
       } catch (err) {
         console.log("Unparsable data, posts.json invalid or empty")
       }
     })
     fs.readFile("./data/categories.json", "utf8", function(err, data) {
       if (err) {
         reject("Unable to read the categories file!")
         return
       }
       try {
         categories = JSON.parse(data)
       } catch (err) {
         console.log("Unparsable data, categories.json invalid or empty")
       }
     })
     resolve()
   })
 }
 
 exports.getAllPosts = function() {
   return new Promise(function(resolve, reject) {
     if (posts.length == 0) {
       reject("No results in posts")
       return
     }
     resolve(posts)
   })
 }
 exports.getPublishedPosts = function() {
   return new Promise(function(resolve, reject) {
     var published = posts.filter((post) => post.published == true)
     if (published.length == 0) {
       reject("No results in published posts")
       return
     }
     resolve(published)
   })
 }
 
 exports.getCategories = function() {
   return new Promise(function(resolve, reject) {
     if (categories.length == 0) {
       reject("No results in Categories")
       return
     }
     resolve(categories)
   })
 }
 