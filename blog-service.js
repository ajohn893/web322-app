
const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "d2n5q9dbltj7ge",
  "jpmhpyexeefcoe",
  "8713e97ddaf8df26035f5069839a1f317eff710fd059e5d1cdda93e534bd49f4",
  {
    host: "ec2-44-206-197-71.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

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
        console.log("Sync Connection Successfull");
        resolve();
      })
      .catch((err) => {
        console.log("Sync Connection Failed!" + err);
      });
  });
};

exports.getAllPosts = () => {
  return new Promise((resolve, reject) => {
    Post.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(error);
        reject();
      });
  });
};

exports.getPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: { category: category },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(error);
        reject();
      });
  });
};

exports.getPostsByMinDate = (minDateStr) => {
  const { gte } = Sequelize.Op;
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: { postDate: { [gte]: new Date(minDateStr) } },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(error);
        reject();
      });
  });
};

exports.getPostsById = (id) => {
  return new Promise((resolve, reject) => {
    Post.findOne({
      where: { id: id },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(error);
        reject();
      });
  });
};

exports.addPost = (postData) => {
  return new Promise((resolve, reject) => {
    if (postData.published) {
      postData.published = true;
    } else {
      postData.published = false;
    }
    for (var prop in postData) {
      if (postData[prop] == "") postData[prop] = null;
    }
    postData.postDate = new Date();
    Post.create(postData)
      .then(() => {
        console.log("i am here");
        resolve();
      })
      .catch(() => {
        reject("Unable to add post");
      });
  });
};

exports.deletePostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: { id: id },
    })
      .then((data) => {
        resolve();
      })
      .catch(() => {
        reject("Unable to delete post");
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
        reject("No results returned");
      });
  });
};

exports.getPublishedPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
        category: category,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(error);
        reject();
      });
  });
};

exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(error);
        reject();
      });
  });
};

exports.addCategory = (categoryData) => {
  return new Promise((resolve, reject) => {
    for (var prop in categoryData) {
      if (categoryData[prop] == "") categoryData[prop] = null;
    }
    Category.create(categoryData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to add category");
      });
  });
};

exports.deleteCategoryById = (id) => {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: { id: id },
    })
      .then((data) => {
        resolve();
      })
      .catch(() => {
        reject("Unable to delete category");
      });
  });
};
