let posts = []
let categories = []

const Sequelize = require('sequelize');
const env = require("dotenv");
const { post, data, error } = require('jquery');
env.config();
	
var sequelize = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('Post', {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN
});

var Category = sequelize.define('Category', {
  category: Sequelize.STRING
});
    // sequelize.sync().then (() => {
    //   console.log("Sync Connection Successfull")
    //   resolve()
    // }).catch((err) => {
    //   console.log("Sync Connection Failed!" + err)
    // })

Post.belongsTo(Category, {foreignKey: 'category'})    

module.exports.initialize = (() => {
    return sequelize.sync()
})    
   
exports.getAllPosts =  () => {
    return new Promise ((resolve, reject) => {
        Post.findAll().then(data => {
          resolve(data);
        })
        .catch((err) => {
          console.log(error)
          reject()
        })
    })
}

exports.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: { category: category}
        }).then(data => {
            resolve(data);
        }).catch(err => {
            console.log(error)
            reject()
        })
    })
}

exports.getPostsByMinDate = (minDateStr) => {
    const { gte } = Sequelize.Op;
    return new Promise ((resolve, reject) => {
        Post.findAll({
            where: { postDate: { [gte]: new Date(minDateStr)
            }}
        }).then(data => {
            resolve(data);
        }).catch(err => {
            console.log(error)
            reject()
        })
    })
}

exports.getPostsById = (id) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: { id: id}
        }).then(data => {
            resolve(data[0]);
        }).catch(err => {
            console.log(error)
            reject()
        })
    })
}

exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        if (postData.published ){
          postData.published = true 
        } else {
          postData.published = false
        }
        for (var prop in postData) {
            if( postData[prop] == '')
            postData[prop] = null;
        }
        postData.postDate = new Date();
        Post.create(postData).then(() => {
            resolve();
        }).catch(() => {
            reject("Unable to add post")
        })
    })    
}

exports.deletePostById = (id) => {
    return new Promise((resolve, reject) => {
        Post.destroy({
            where: { id: id }
        }).then(data => {
            resolve();
        }).catch(() => {
            reject("Unable to delete post");
        })
    })
}

exports.getPublishedPosts = () => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: { published: true }
        }).then(data => {
            resolve(data);
        }).catch(() => {
            reject("No results returned");
        })
    })    
} 

exports.getPublishedPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
          where: { 
            published: true,
            category: category}
        }).then(data => {
              resolve(data)
        }).catch(err => {
              console.log(error)
              reject()
        })
    })
}

exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        Category.findAll().then(data => {
            resolve(data);
        }).catch(err => {
            console.log(error)
            reject()
        })
    })  
}

exports.addCategory = (categoryData) => {
    return new Promise((resolve, reject) => {
        for(var prop in categoryData){
            if(categoryData[prop] == '')
            categoryData[prop] = null;
        }
        Category.create(categoryData).then(() => {
            resolve();
        }).catch((err) => {
            reject("Unable to add category");
        })
    })
}

exports.deleteCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: { id: id }
        }).then(data => {
            resolve();
        }).catch(() => {
            reject("Unable to delete category");
        })
    })
}

 









 