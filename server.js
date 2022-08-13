// /*********************************************************************************
// *  WEB322 – Assignment 06
// *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
// *  (including 3rd party web sites) or distributed to other students.
// * 
// *  Name: --Aaron John Bivera-- Student ID: --156486201-- Date: --25/07/2022--
// *
// *  Online (Heroku) URL:  https://afternoon-garden-55497.herokuapp.com
// *
// *  GitHub Repository URL: https://github.com/ajohn893/web322-app.git
// *
// ********************************************************************************/ 

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const multer = require("multer");
const exphbs = require("express-handlebars");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const path = require("path");
const blog = require("./blog-service");
const stripJs = require("strip-js");
const { rejects } = require("assert");
const authData = require("./auth-service.js");
const clientSessions = require("client-sessions");
const app = express();

app.engine(".hbs", exphbs.engine({
     extname: ".hbs",
     defaultLayout: "main",
     helpers: {
       navLink: function (url, options) {
         return (
           "<li" +
           (url == app.locals.activeRoute ? ' class="active" ' : "") +
           '><a href="' +
           url + '">' + options.fn(this) + "</a></li>");
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
       safeHTML: function (context) {
         return stripJs(context);
       },
       formatDate: function (dateObj) {
         let year = dateObj.getFullYear();
         let month = (dateObj.getMonth() + 1).toString();
         let day = dateObj.getDate().toString();
         return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
       },
     },
   })
 );
 
 app.set("view engine", ".hbs");
 app.use(express.static("public"));
 const upload = multer();
 app.use(express.urlencoded({ extended: true }));
 
 //-----------------
 cloudinary.config({
  cloud_name: "dzsbrrzau",
  api_key: "659429114744825",
  api_secret: "zaIs4HB6UB-_AIJhx0Ts5ERurp4",
  secure: true,
})
app.use(function (req, res, next) {
   let route = req.path.substring(1);
   app.locals.activeRoute =
     "/" +
     (isNaN(route.split("/")[1])
       ? route.replace(/\/(?!.*)/, "")
       : route.replace(/\/(.*)/, ""));
   app.locals.viewingCategory = req.query.category;
   next();
 });
 //------------
// client session
 app.use(clientSessions({
  cookieName: "session", 
  secret: "week10example_web322", 
  duration: 2 * 60 * 1000, 
  activeDuration: 1000 * 60
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})

function ensureLogin(req, res, next) {
    if(!req.session.user) {
        res.redirect("/login");
    }
    else{
      next();
    }
}
 
 app.get("/", (req, res) => {
   res.redirect("blog");
 });
 app.get("/about", (req, res) => {
   res.render("about");
});
 
app.get("/blog", async (req, res) => {
   // Declare an object to store properties for the view
   let viewData = {};
 
   try {
     // declare empty array to hold "post" objects
     let posts = [];
 
     // if there's a "category" query, filter the returned posts by category
     if (req.query.category) {
       // Obtain the published "posts" by category
       posts = await blog.getPublishedPostsByCategory(req.query.category);
     } else {
       // Obtain the published "posts"
       posts = await blog.getPublishedPosts();
     }
 
     // sort the published posts by postDate
     posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
 
     // get the latest post from the front of the list (element 0)
     let post = posts[0];
 
     // store the "posts" and "post" data in the viewData object (to be passed to the view)
     viewData.posts = posts;
     viewData.post = post;
   } catch (err) {
     viewData.message = "no results";
   }
 
   try {
     // Obtain the full list of "categories"
     let categories = await blog.getCategories();
 
     // store the "categories" data in the viewData object (to be passed to the view)
     viewData.categories = categories;
   } catch (err) {
     viewData.categoriesMessage = "no results";
   }
 
   // render the "blog" view with all of the data (viewData)
   res.render("blog", { data: viewData });
 });
 
 app.get("/blog/:id", async (req, res) => {
   // Declare an object to store properties for the view
   let viewData = {};
 
   try {
     // declare empty array to hold "post" objects
     let posts = [];
 
     // if there's a "category" query, filter the returned posts by category
     if (req.query.category) {
       // Obtain the published "posts" by category
       posts = await blog.getPublishedPostsByCategory(req.query.category);
     } else {
       // Obtain the published "posts"
       posts = await blog.getPublishedPosts();
     }
 
     // sort the published posts by postDate
     posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
 
     // store the "posts" and "post" data in the viewData object (to be passed to the view)
     viewData.posts = posts;
   } catch (err) {
     viewData.message = "no results";
   }
 
   try {
     // Obtain the post by "id"
     viewData.post = await blog.getPostsById(req.params.id);
   } catch (err) {
     viewData.message = "no results";
   }
 
   try {
     // Obtain the full list of "categories"
     let categories = await blog.getCategories();
 
     // store the "categories" data in the viewData object (to be passed to the view)
     viewData.categories = categories;
   } catch (err) {
     viewData.categoriesMessage = "no results";
   }
 
   // render the "blog" view with all of the data (viewData)
   res.render("blog", { data: viewData });
});
 
app.get("/posts", ensureLogin, (req, res) => {
   if (req.query.category) {
     blog
       .getPostsByCategory(req.query.category)
       .then((data) => {
         if (data.length == 0) {
           res.render("posts", { message: "no results" });
           return;
         }
         res.render("posts", { posts: data });
       })
       .catch(() => {
         res.render("posts", { message: "no results" });
       });
   } else if (req.query.minDate) {
     blog
       .getPostsByMinDate(req.query.minDate)
       .then((data) => {
         if (data.length == 0) {
           res.render("posts", { message: "no results" });
           return;
         }
         res.render("posts", { posts: data });
       })
       .catch(() => {
         res.render("posts", { message: "no results" });
       });
   } else {
     blog
       .getAllPosts()
       .then((data) => {
         if (data.length == 0) {
           res.render("posts", { message: "no results" });
           return;
         }
         res.render("posts", { posts: data });
       })
       .catch(() => res.render("posts", { message: "no results" }));
   }
});
 
app.get("/posts/add", ensureLogin, (req, res) => {
   blog
     .getCategories()
     .then((data) => {
       res.render("addPost", {
         categories: data,
       });
     })
     .catch(() => {
       res.render("addPost", {
         categories: [],
       });
     });
});
app.post("/posts/add", ensureLogin, upload.single("featureImage"), (req, res) => {
   let streamUpload = (req) => {
     return new Promise((resolve, reject) => {
       let stream = cloudinary.uploader.upload_stream((error, result) => {
         if (result) {
           resolve(result);
         } else {
           reject(error);
         }
       });
       streamifier.createReadStream(req.file.buffer).pipe(stream);
     });
   };
   async function upload(req) {
     let result =  streamUpload(req);
     console.log(await result);
     return result;
   }
   upload(req).then((uploaded) => {
     req.body.featureImage = uploaded.url;
     blog
       .addPost(req.body)
       .then(() => {
         res.redirect("/posts");
       });
     
   });
});
 
app.get("/post/:id", ensureLogin, (req, res) => {
   blog
     .getPostsById(req.params.id)
     .then((data) => {
       res.json(data);
     })
     .catch((err) => {
       res.json({
         message: "no results",
       });
     });
});
 
app.get("/posts/delete/:id", ensureLogin, (req, res) => {
   blog
     .deletePostById(req.params.id)
     .then(() => {
       res.redirect("/posts");
     })
     .catch(() => {
       res.render("404", { message: "Unable to delete the specified post.." });
     });
});
 
app.get("/categories", ensureLogin, (req, res) => {
   blog
     .getCategories()
     .then((data) => {
       if (data.length == 0) {
         res.render("categories", { message: "no results" });
         return;
       }
       res.render("categories", { categories: data });
     })
     .catch(() => {
       res.render("categories", { message: "no results" });
     });
});
 
app.get("/categories/add", ensureLogin, (req, res) => {
   res.render("addCategory");
});
 
app.post("/categories/add", ensureLogin, (req, res) => {
   blog
     .addCategory(req.body)
     .then(() => {
       res.redirect("/categories");
     })
     .catch(() => {
       res.render("404", { message: "Unable to add category.." });
           });
});
 
app.get("/categories/delete/:id", ensureLogin, (req, res) => {
   blog
     .deleteCategoryById(req.params.id)
     .then(() => {
       res.redirect("/categories");
     })
     .catch(() => res.render("404", { message: "Unable to delete category.." }));
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", (req, res) => {
    req.body.userAgent = req.get("User-Agent");
    authData.checkUser(req.body)
    .then((user) => {
      req.session.user = { 
        userName: user.userName, 
        email: user.email,
        loginHistory: user.loginHistory }
      res.redirect("/posts")  
    }).catch((err) => {
        res.render("login", {errorMessage: err, userName: req.body.userName})
    })
})

app.get("/register", (req, res) => {
    res.render("Register");
})

app.post("/register", (req, res) => {
    authData.registerUser(req.body)
    .then(() => {
      res.render("Register", { successMessage: "User Created" })
    })
    .catch((err) => {
       res.render("register", { 
        errorMessage: err,
        userName: req.body.userName
       })
    })
})

app.get("/logout", (req, res) => {
    req.session.reset()
    res.redirect("/login")
})

app.get("/userHistory", (req, res) => {
  res.render("userHistory")
})

app.use((req, res) => {
  res.status(404).render("404");
})

blog.initialize()
    .then(authData.initialize)
    .then(() => {
     app.listen(HTTP_PORT, () => {
       console.log('⚡️⚡️⚡️ '+`Express http server listening on ${HTTP_PORT}` + ' ⚡️⚡️⚡️');
     });
    }).catch(() => {
     console.log("Failed promises");
});
 


