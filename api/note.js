let Note = require("../models").note;
let Status = require("../models").status;
const Sequelize = require('sequelize');
const uuid4=require('uuid4');


const uuid = () => {
    const tokens = uuid4().split('-')
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4]
  }


exports.getNoteList = async (req, res, next) => {
    var query = 'SELECT * FROM note as a, status as b where a.id=b.id and a.folder_id=:id and b.status <> "DELETED"';
    var values = {
      id: req.query.folder_id
    };
    Note.sequelize.query(query, {replacements: values})
    .spread(function (results, metadata) {
       
        res.send({
            result: "success",
            data: results
        });
      }, function (err) {
  
  
      });
};

exports.register = async (req, res, next) => {
    console.log("create");

    //insert query
    const id = await Note.create({
        name: req.body.name,
        folder_id: req.body.folder_id,
        content: uuid()
    }).then(result => {
            return result.dataValues.id;
        })
        .catch(err => {
            console.log("[Note] create err : " + err);
        });

    Status.create({
        id: parseInt(id),
        reg_date: Sequelize.fn('NOW'),
        status_date: Sequelize.fn('NOW'),
        status: "ACTIVED"
    })
        .then(result => {
            res.send({
                result: "success",
                data: result
            });
        })
        .catch(err => {
            console.log("[Note] create err : " + err);
        });
};

exports.updateNoteName = async (req, res, next) => {
  
    Note.update({name: req.params.name},
    {
        where: {id: req.params.id}, returning: true})
        .then(function(result) {
        res.json(result[1][0]);
    }).catch(function(err) {
        console.log("데이터 수정 실패");
    });
};

exports.setStatus=async (req, res, next) => {
    Status.update({status: req.params.status, status_date: Sequelize.fn('NOW')},
    {
        where: {id: req.params.id}, returning: true})
        .then(function(result) {
        res.json(result[1][0]);
    }).catch(function(err) {
        console.log("Note데이터 수정 실패");
    });
}

