// const Sequelize = require("sequelize");
// const env = require("dotenv");
// const { post, data, error } = require("jquery");
// env.config();

// var sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     port: 5432,
//     dialectOptions: {
//       ssl: { rejectUnauthorized: false },
//     },
//     query: { raw: true },
//   }
// );

// var Post = sequelize.define("Post", {
//   body: Sequelize.TEXT,
//   title: Sequelize.STRING,
//   postDate: Sequelize.DATE,
//   featureImage: Sequelize.STRING,
//   published: Sequelize.BOOLEAN,
// });

// var Category = sequelize.define("Category", {
//   category: Sequelize.STRING,
// });

// Post.belongsTo(Category, { foreignKey: "category" });

// exports.initialize = () => {
//   return new Promise((resolve, reject) => {
//     sequelize
//       .sync()
//       .then(() => {
//         console.log("Sync Connection Successfull");
//         resolve();
//       })
//       .catch((err) => {
//         console.log("Sync Connection Failed!" + err);
//       });
//   });
// };

// exports.getAllPosts = () => {
//   return new Promise((resolve, reject) => {
//     Post.findAll()
//       .then((data) => {
//         resolve(data);
//       })
//       .catch((err) => {
//         console.log(error);
//         reject();
//       });
//   });
// };

// exports.getPostsByCategory = (category) => {
//   return new Promise((resolve, reject) => {
//     Post.findAll({
//       where: { category: category },
//     })
//       .then((data) => {
//         resolve(data);
//       })
//       .catch((err) => {
//         console.log(error);
//         reject();
//       });
//   });
// };

// exports.getPostsByMinDate = (minDateStr) => {
//   const { gte } = Sequelize.Op;
//   return new Promise((resolve, reject) => {
//     Post.findAll({
//       where: { postDate: { [gte]: new Date(minDateStr) } },
//     })
//       .then((data) => {
//         resolve(data);
//       })
//       .catch((err) => {
//         console.log(error);
//         reject();
//       });
//   });
// };

// exports.getPostsById = (id) => {
//   return new Promise((resolve, reject) => {
//     Post.findOne({
//       where: { id: id },
//     })
//       .then((data) => {
//         resolve(data);
//       })
//       .catch((err) => {
//         console.log(error);
//         reject();
//       });
//   });
// };

// exports.addPost = (postData) => {
//   return new Promise((resolve, reject) => {
//     if (postData.published) {
//       postData.published = true;
//     } else {
//       postData.published = false;
//     }
//     for (var prop in postData) {
//       if (postData[prop] == "") postData[prop] = null;
//     }
//     postData.postDate = new Date();
//     Post.create(postData)
//       .then(() => {
//         console.log("i am here");
//         resolve();
//       })
//       .catch(() => {
//         reject("Unable to add post");
//       });
      
//   });
// };

// exports.deletePostById = (id) => {
//   return new Promise((resolve, reject) => {
//     Post.destroy({
//       where: { id: id },
//     })
//       .then((data) => {
//         resolve();
//       })
//       .catch(() => {
//         reject("Unable to delete post");
//       });
//   });
// };

// exports.getPublishedPosts = () => {
//   return new Promise((resolve, reject) => {
//     Post.findAll({
//       where: { published: true },
//     })
//       .then((data) => {
//         resolve(data);
//       })
//       .catch(() => {
//         reject("No results returned");
//       });
//   });
// };

// exports.getPublishedPostsByCategory = (category) => {
//   return new Promise((resolve, reject) => {
//     Post.findAll({
//       where: {
//         published: true,
//         category: category,
//       },
//     })
//       .then((data) => {
//         resolve(data);
//       })
//       .catch((err) => {
//         console.log(error);
//         reject();
//       });
//   });
// };

// exports.getCategories = () => {
//   return new Promise((resolve, reject) => {
//     Category.findAll()
//       .then((data) => {
//         resolve(data);
//       })
//       .catch((err) => {
//         console.log(error);
//         reject();
//       });
//   });
// };

// exports.addCategory = (categoryData) => {
//   return new Promise((resolve, reject) => {
//     for (var prop in categoryData) {
//       if (categoryData[prop] == "") categoryData[prop] = null;
//     }
//     Category.create(categoryData)
//       .then(() => {
//         resolve();
//       })
//       .catch((err) => {
//         reject("Unable to add category");
//       });
//   });
// };

// exports.deleteCategoryById = (id) => {
//   return new Promise((resolve, reject) => {
//     Category.destroy({
//       where: { id: id },
//     })
//       .then((data) => {
//         resolve();
//       })
//       .catch(() => {
//         reject("Unable to delete category");
//       });
//   });
// };


////---------------

/*********************************************************************************
 * WEB322 – Assignment 5
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Abhijit Deepa Pramod Student ID: 102907219 Date: July 22 2022
 *
 * Online (Heroku) URL: https://fast-earth-88526.herokuapp.com/
 *
 ********************************************************************************/
 const Sequelize = require("sequelize");
 var sequelize = new Sequelize(
   "d91vanse664b3n",
   "yjjkqvgciqebyb",
   "7b92381af64f7d7e12d235984b4398d7392ca1900d3aeffce458ac3ea40f4f26",
   {
     host: "ec2-54-152-28-9.compute-1.amazonaws.com",
     dialect: "postgres",
     port: 5432,
     dialectOptions: {
       ssl: { rejectUnauthorized: false },
     },
     query: { raw: true },
   }
 );
 
 var Post = sequelize.define("Post", {
   body: Sequelize.TEXT,
   title: Sequelize.STRING,
   postDate: Sequelize.DATE,
   featureImage: Sequelize.STRING,
   published: Sequelize.BOOLEAN,
 });
 var Category = sequelize.define("Category", {
   category: Sequelize.STRING,
 });
 Post.belongsTo(Category, { foreignKey: "category" });
 
 exports.initialize = () => {
   return new Promise((resolve, reject) => {
     sequelize
       .sync()
       .then(() => {
         resolve("DB SYNCED");
       })
       .catch(() => {
         reject("DB SYNC FAILED ! :(");
       });
   });
 };
 
 exports.getAllPosts = () => {
   return new Promise((resolve, reject) => {
     Post.findAll()
       .then((data) => {
         resolve(data);
       })
       .catch(() => {
         reject("no results returned");
       });
   });
 };
 
 exports.getPublishedPosts = () => {
   return new Promise((resolve, reject) => {
     Post.findAll({
       where: { published: true },
     })
       .then((data) => {
         resolve(data);
       })
       .catch(() => {
         reject("no results returned");
       });
   });
 };
 
 exports.getCategories = () => {
   return new Promise((resolve, reject) => {
     Category.findAll()
       .then((data) => {
         resolve(data);
       })
       .catch(() => {
         reject("no results returned");
       });
   });
 };
 
 exports.getPostsByCategory = (category_) => {
   return new Promise((resolve, reject) => {
     Post.findAll({
       where: { category: category_ },
     })
       .then((data) => {
         resolve(data);
       })
       .catch(() => {
         reject("no results returned");
       });
   });
 };
 
 exports.getPostsById = (id_) => {
   return new Promise((resolve, reject) => {
     Post.findOne({
       where: { id: id_ },
     })
       .then((data) => {
         resolve(data);
       })
       .catch(() => {
         reject("no results returned");
       });
   });
 };
 
 exports.getPublishedPostsByCategory = (category_) => {
   return new Promise((resolve, reject) => {
     Post.findAll({
       where: { category: category_, published: true },
     })
       .then((data) => {
         resolve(data);
       })
       .catch(() => {
         reject("no results returned");
       });
   });
 };
 
 exports.addPost = (postData) => {
   return new Promise((resolve, reject) => {
     postData.published = postData.published ? true : false;
     for (let item in postData) {
       if (postData[item] == "") {
         postData[item] = null;
       }
     }
     postData.postDate = new Date();
     Post.create(postData)
       .then((data) => {
         resolve(data);
       })
       .catch(() => {
         reject("No record Found");
       });
   });
 };
 
 exports.getPostsByMinDate = (minDateStr) => {
   return new Promise((resolve, reject) => {
     const { gte } = Sequelize.Op;
     Post.findAll({
       where: {
         postDate: {
           [gte]: new Date(minDateStr),
         },
       },
     })
       .then((data) => {
         resolve(data);
       })
       .catch(() => {
         reject("No record Found");
       });
   });
 };
 
 exports.addCategory = (categoryData) => {
   return new Promise((resolve, reject) => {
     for (let item in categoryData) {
       if (categoryData[item] == "") {
         categoryData[item] = null;
       }
     }
     Category.create(categoryData)
       .then((data) => {
         resolve(data);
       })
       .catch(() => {
         reject("Unable to create category");
       });
   });
 };
 
 exports.deleteCategoryById = (id_) => {
   return new Promise((resolve, reject) => {
     Category.destroy({
       where: {
         id: id_,
       },
     })
       .then(() => {
         resolve();
       })
       .catch(() => {
         reject("Unable to delete category");
       });
   });
 };
 
 exports.deletePostById = (id_) => {
   return new Promise((resolve, reject) => {
     Post.destroy({
       where: {
         id: id_,
       },
     })
       .then(() => {
         resolve();
       })
       .catch(() => {
         reject("Unable to delete post");
       });
   });
 };