let posts = []
let categories = []
const fs = require("fs")
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

 exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length == 0) {
      reject("No results in Categories")
      return
    }
    resolve(categories)
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
  let AddPost = new Promise((resolve, reject) => {
    if (postData.published ){
      postData.published = true 
    } else {
      postData.published = false
    }
    postData.id = posts.length + 1 
    posts.push(postData);
    resolve()
    })
  }  
  
  exports.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
      let output = posts.filter((post) => post.category == category)
      if (output.length == 0) {
        reject("No results returned")
        return
      } else {
        resolve(output)
      }
    })
}  
   
exports.getPostsByMinDate = (minDateStr) => {
  return new Promise((resolve,reject) => {
    let output = posts.filter((post) => 
    new Date(post.postData) >= new Date(minDateStr)
    ) 
    if (output.length == 0){
      reject("not vaild")
      return
    } else {
      resolve(output)
    }
    })
}   
    
exports.getPostsById = (id) => {
  return new Promise((resolve, reject) => {
    let output = posts.find((post) => post.id == id)
    if (!output) {
      reject("No results returned")
      return
    } else {
      resolve(output)
    }
  })
}


 