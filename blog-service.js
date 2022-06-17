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
exports.addPost = () => (postData)=>{
  var AddPost = new Promise((resolve, reject) => {
    if (postData){
      postData.id = posts.length +1;
      if (postData.published){
        postData.published = true;}
      else {
        postData.published = false; 
          posts.push(postData);
          resolve(posts);}
    }
    else{
      errorReturn = "Error found!";
      reject({ message: errorReturn});
    }
    return(AddPost)
  })
}

exports.getPostsByMinDate = (minDateStr) => {
  var post = [];
  var AddPost = new Promise((resolve,reject) => {
    for(var i =0; i < posts.length; i++) {
      if(new Date(posts[i].postData) >= new Date(minDateStr)){
        console.log("PostDate value is greater than minDateStr")
        post.push(posts[i]);
      }
    }
      if(post.length == 0){
        errorReturn = "no results returned";
        reject({ message: errorReturn});
      }
      resolve(post);
  })
  return AddPost;
};

exports.getPostById = (id) => {
  return new Promise((resolve,reject) => {
    var post = posts.filter(posts => posts.id == id);
    if (post.length == 0) {
      reject("no results returned");
    }
    resolve(post);
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
 
 