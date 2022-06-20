/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: --Aaron John Bivera-- Student ID: --156486201-- Date: --16/06/2022--
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

cloudinary.config({
  cloud_name: 'dh0vyvebb',
  api_key: '135839217257729',
  api_secret: 'w-OcperQYlP5WQ3_j-KBLHjwpE4',
  secure: true
})
// remove comment after editing about.html file


app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/about")
})
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"))
})

app.get("/blog", (req, res) => {
  blog
    .getPublishedPosts()
    .then((data) => {
      res.json({ data })
    })
    .catch((err) => {
      res.json({ message: err })
    })
})

app.get("/categories", (req, res) => {
  blog
    .getCategories()
    .then((data) => {
      res.json({ data })
    })
    .catch((err) => {
      res.json({ message: err })
    })
})
app.get("/posts", (req, res) => {
  if (req.query.category) {
    blog
      .getPostsByCategory(req.query.category)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        res.json({ message: err })
      })
  } else if (req.query.minDate) {
    blog
      .getPostsByMinDate(req.query.minDate)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        res.json({ message: err })
      })
  } else {
    blog
      .getAllPosts()
      .then((data) => {
        res.json(data)
      })
      .catch((err) => res.json({ message: err }))
  }
})

app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/addPost.html"))
})
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


app.get("*", (req, res) => {
	res.status(404).send(" 404 Page Not Found ⚠️");
});

blog
  .initialize().then(() => {
    app.listen(HTTP_PORT, () => {
      console.log('⚡️⚡️⚡️ '+`Express http server listening on ${HTTP_PORT}` + ' ⚡️⚡️⚡️');
    });
  })
  .catch((error) => {
        console.log(error);
      });
  