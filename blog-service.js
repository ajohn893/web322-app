

let posts = []
let categories = []
const { rejects } = require("assert")
const fs = require("fs")
const { resolve } = require("path")
 exports.initialize = () => {
   return new Promise((resolve, reject) => {
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
     fs.readFile("./data/categories.json", "utf8", (err, data) => {
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
/*function getAllPosts() {
	return promise
		.then((result) => {
			return result.posts;
		})
		.catch((error) => {
			console.log(error);
		});*/

// exports.addPost (postData)
function addPost(postData) {
  return new Promise((resolve, rejects) => {
    if (postData.published == 0) {
      reject("Undefined")
      return
    }
    resolve(addPost)
  })
}


 exports.getCategories = () => {
   return new Promise((resolve, reject) => {
     if (categories.length == 0) {
       reject("No results in Categories")
       return
     }
     resolve(categories)
   })
 }
 
 /*module.exports.addPost = function (postData) {
  var promise = new Promise(function (resolve, reject) {
    if (postData) {
      postData.id  = p.length + 1;
      if (postData.published )
        postData.published  = true;
      else
        postData.published  = false;
      p.push(postData);
      resolve(p);
    }
    else {
      errMessage = "Something wrong function";
      reject({ message: errMessage });
    }
  })
  return promise;

  module.exports.getPostsByMinDate = function (minDateStr) {
    var post = [];
  
    var promise = new Promise((resolve, reject) => {
  
      for (var i = 0; i < p.length; i++) {
        if(new Date(p[i].postDate) >= new Date(minDateStr)){
      console.log("The postDate value is greater than minDateStr ")
      post.push(p[i]);
  }
      }
      if (post.length === 0) {
        errMessage = "no results returned";
        reject({ message: errMessage });
      }
      resolve(post);
  
    })
    return promise;
  };

}*/