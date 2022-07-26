/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: --Aaron John Bivera-- Student ID: --156486201-- Date: --25/07/2022--
*
*  Online (Heroku) URL: ___https://frozen-temple-45666.herokuapp.com____
*
*  GitHub Repository URL: ______https://github.com/ajohn893/web322-app.git________________________________________________
*
********************************************************************************/ 
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const blog = require("./blog-service")
const multer = require("multer");

const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer(); 
const exphbs = require("express-handlebars");
const stripJs = require('strip-js');
const Sequelize = require('sequelize');
const { data } = require("jquery");


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
})
// remove comment after editing about.html file
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: { 
        navLink: function(url,options){
           return 'li' +
               ((url == app.locals.activeRoute) ? 'class = "active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
              return options.fn(this);
            }
        },
        safeHTML: function(context){
            return stripJS(context);
        },
        formatDate: function(dateObj){
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
        }
    }    
}));

app.set('view engine', '.hbs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/blog")
})
app.get("/about", (req, res) => {
  res.render("about");
});

app.get('/blog', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blog.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blog.getPublishedPosts();
      }

      // sort the published posts by postDate
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // get the latest post from the front of the list (element 0)
      let post = posts[0]; 

      // store the "posts" and "post" data in the viewData object (to be passed to the view)
      viewData.posts = posts;
      viewData.post = post;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the full list of "categories"
      let categories = await blog.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", {data: viewData})

});

app.get("/posts", (req, res) => {
  
  let queryPromise = null;

  if (req.query.category) {
      queryPromise = blog.getPostsByCategory(req.query.category);
  } else if (req.query.minDate) {
      queryPromise = blog.getPostsByMinDate(req.query.minDate);
  } else {
      queryPromise = blog.getAllPosts()
  }

  queryPromise.then(data => {
      (data.length > 0 ) ? res.render("posts", {posts: data}) : res.render("posts", {message: "no results"});
  }).catch(err => {
      res.render("posts", {message: "no results"});
  })

}); 

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result)
        } else {
          reject(error)
        }
      })
      streamifier.createReadStream(req.file.buffer).pipe(stream)
    })
  }
  async function upload(req) {
    let result = await streamUpload(req)
    console.log(result)
    return result
  }
  upload(req).then((uploaded) => {
    req.body.featureImage = uploaded.url
    blog
      .addPost(req.body)
      .then(() => {
        res.redirect("/posts")
      })
      .catch((err) => {
        res.send()
      })
  })
})

app.get('/posts/add', (req, res) => {
    blog
    .getCategories()
    .then((data) => {
        res.render("addPost", {categories: data});  
    }).catch((err) => {
        res.render("addPost", {categories: [] });  
    })
})

app.get("/posts/delete/:id", (req, res) => {
    blog
    .deletePostById(req.params.id)
    .then(() => {
        res.redirect("/posts");
    }).catch((err) => {
        res.status(500).send("Unable to remove Post / Invaild Request"); 
    })
})

app.get("/posts/:id", (req, res) => {
  blog
    .getPostsById(req.params.id)
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      res.json({
        message: "no results",
      })
    })
})

app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

      // declare empty array to hold "post" objects
        let posts = [];

      // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
          // Obtain the published "posts" by category
           posts = await blog.getPublishedPostsByCategory(req.query.category);
        }else{
          // Obtain the published "posts"
            posts = await blog.getPublishedPosts();
        }

      // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
      // Obtain the post by "id"
        viewData.post = await blog.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
      // Obtain the full list of "categories"
        let categories = await blog.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

  // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

app.get("/categories", (req, res) => {
  blog.getCategories()
  .then((data) => {
      (data.length > 0) ? res.render("categories", {categories: data}):
      res.render("categories",{ message: "no results"});
  });
});

app.get('/categories/add', (req, res) => {
  res.render("addCategory");
});

app.post('/categories/add', (req, res) => {
  blog.addCategory(req.body)
  .then(category => {
      res.redirect("/categories");
  }).catch(err => {
      res.status(500).send(err.message);
  })
})

app.get("/categories/delete/:id", (req, res) => {
    blog.deleteCategoryById(req.params.id)
    .then(() => {
      res.redirect("/categories");
    }).catch((err) => {
      res.status(500).send("Unable to remove Category / Invaild Request");
    })
})

app.use((req, res) => {
    res.status(404).render("404");
})

blog
  .initialize().then(() => {
    app.listen(HTTP_PORT, () => {
      console.log('⚡️⚡️⚡️ '+`Express http server listening on ${HTTP_PORT}` + ' ⚡️⚡️⚡️');
    });
  }).catch((error) => {
        console.log(error);
})
  
