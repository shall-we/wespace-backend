let User = require("../models").user;
let Folder_List = require("../models").folder_list;
let Folder = require("../models").folder;
let Note = require("../models").note;
let authToken = require("../lib/token");
let upload = require('../lib/upload');
const Sequelize = require("sequelize");

searchOne = data => {
  return User.findOne(data)
    .catch(err => {
      console.log("findOne err : " + err);
    });
};

exports.getUserList = async (req, res, next) => {
  var query =
    "select a.id, a.name,a.email, a.profile, (select permission from folder_list where folder_id=:id and user_id=a.id ) as isShared  from user a";
  var values = {
    id: req.query.folder_id
  };
  User.sequelize.query(query, { replacements: values }).spread(
    function(results, metadata) {
      res.send({
        result: "success",
        data: results
      });
    },
    function(err) {}
  );
};


// 회원가입
// application/json
// name, email, password, profile
exports.register = async (req, res, next) => {

  console.log('join');

  let userData = await upload.uploadAsFile(req , 'user');

  let result = await searchOne({
    where: {
      name: userData.name,
      email: userData.email,
    }
  });

  // auth_already_exists check
  if (result) {
    res.send({
      result: "fail",
      failType: "auth_already_exists"
    });
    return;
  }

  //insert query
  User.create(userData)
    .then(result => {
      res.send({
        result: "success"
      });
    })
    .catch(err => {
      console.log("[JOIN] create err : " + err);
    });
};

// 로그인
// application/json
// email, password
exports.login = async (req, res, next) => {
  console.log("login");

  let fail = null;

  let result = await searchOne({
    where: {
      email: req.body.email,
    }
  });

  // auth_not_exist check
  if (!result) fail = "auth_not_exist";

  // password_mismatch check
  if (result && result.dataValues.password !== req.body.password)
    fail = "password_mismatch";

  if (fail !== null) {
    res.send({
      result: "fail",
      failType: fail
    });

    return;
  }

  let profile = await upload.getbase64Img(result.dataValues.profile)
  .catch(err=>{console.log('[GETBASE64IMG] '+err)});

  // console.log(profile);

  authToken.createToken({
    _id: result.dataValues.id,
    email: result.dataValues.email,
    password : result.dataValues.password,
  }).then((token) => {

    if(req.body.autoLogin){
      res.cookie('token', token,  {
        expires : new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly : true,
      });
      // res.set('x-access-token' , token);
    }

    res.send({
      result: "success",
      token: token,
      data: {
        id: result.dataValues.id,
        name: result.dataValues.name,
        profile: profile,
      }
    });

  }).catch((err) => {
    console.log('createToken error : ' + err);
  });
};

exports.autoLogin = async (req, res, next) => {
  if(req.cookies.token) {
    console.log("autoLogin token : ",req.cookies.token);

    authToken.decodeToken(req.cookies.token)
    .then((data) =>{
      res.send({
        result : "success",
        data: {
          autoLogin : true,
          email : data.email,
          password: data.password
        }
      })
    })
    .catch((err)=>{
      console.log("autoLogin error : "+ err);
    })
  }
}


exports.logout = async (req, res, next) => {
  res.clearCookie('token');
  console.log("cookie 삭제 : ",req.cookies.token);
  return res.status(200).redirect('/');
}

// Get a list of all user in admin page
exports.getAllUserList = async (req, res, next) => {
  User.findAll({
    attributes: {
      include: [ "User.id", [Sequelize.fn('COUNT', Sequelize.col('User.id')), 'folder_count'] ]
    },
    include: [{ model: Folder_List, }],
    group: [ 'User.id' ],
  }).then(result => {
    res.send({
      result: "success",
      data: result
    })
  }).catch(err => {
    console.error("[getAllUserList] : " + err);
  });
}

// Delete user when administrator clicked a row
exports.deleteUser = async (req, res, next) => {
  User.destroy({
    where: { id: req.params.id }
  }).then(result => {
    res.send({
      result: "success",
      data: result
    });
  }).catch(err => {
    console.error("[deleteUser]: ", err);
  });
};

// Get a list of all folder in admin page
exports.getAllFolderList = async (req, res, next) => {
  var query =
    "SELECT c.id, a.profile, a.name AS u_name, c.name AS f_name, b.permission FROM User a, Folder_List b, Folder c WHERE a.id = b.user_id AND b.folder_id = c.id";
  User.sequelize.query(query).spread(
    function(results, metadata) {
      res.send({
        result: "success",
        data: results
      });
    },
    function(err) {
      console.error("[getAllFolderList]: ", err);
    });
};

// Get a list of all note in admin page
exports.getAllNoteList = async (req, res, next) => {
  var query =
    "SELECT c.id, a.profile, a.name AS u_name, c.name AS n_name, b.permission FROM User a, Folder_List b, Note c WHERE a.id = b.user_id AND b.folder_id = c.folder_id";
  User.sequelize.query(query).spread(
    function(results, metadata) {
      res.send({
        result: "success",
        data: results
      });
    },
    function(err) {
      console.error("[getAllNoteList]: ", err);
    });
};
