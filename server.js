/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: --Aaron John Bivera-- Student ID: --156486201-- Date: --06/06/2022--
*
*  Online (Heroku) URL: ___https://frozen-temple-45666.herokuapp.com____
*
*  GitHub Repository URL: ______https://github.com/ajohn893/web322-app.git________________________________________________
*
********************************************************************************/ 

const express = require("express");
const app = express();
const path = require("path");
const blog = require("./blog-service")
const multer = require("multer");

const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const HTTP_PORT = process.env.PORT || 8080;

cloudinary.config({
  cloud_name: 'dh0vyvebb',
  api_key: '135839217257729',
  api_secret: 'w-OcperQYlP5WQ3_j-KBLHjwpE4',
  secure: true
});

const upload = multer(); 


// remove comment after editing about.html file 
app.use(express.static("public"));

app.get("/", (req,res) => {
  res.redirect("/about");
});

app.get("/about", (req,res) => {
  res.sendFile(path.join(__dirname, "./views/about.html"));
});

app.get("/posts/add", (req,res) => {
  res.sendFile(path.join(__dirname, "./views/addPost.html"));
});


app.get("/blog", (req,res) => {
  blog
    .getPublishedPosts().then((data) => {
      res.json({data})
    })
    .catch((err) => {
      res.json({message: err})
    })
})
app.get("/posts", (req,res) => {
  blog
    .getAllPosts().then((data) => {
      res.json({data})
    })
    .catch((err) => {
      res.json({message: err})
    })
  })
app.get("/categories", (req,res) => {
    blog
      .getCategories().then((data) => {
        res.json({data})
      })
      .catch((err) => {
        res.json({message: err})
      })
})

app.post("/register-user", 
upload.single("feautureimage"), (req, res) => {
  res.send("register");
  if(req.file){
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }

    upload(req).then((uploaded)=>{
        processPost(uploaded.url);
    });
}else{
    processPost("");
}
 
function processPost(imageUrl){
    req.body.featureImage = imageUrl;
}
});

app.get("*", (req, res) => {
	res.status(404).send(" 404 Page Not Found ⚠️");
});

blog
  .initialize().then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on ${HTTP_PORT}`);
    });
  })
  .catch((error) => {
        console.log(error);
      });
  