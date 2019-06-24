const MONGO_URL = 'mongodb://wespace:wespace@15.164.154.155:27983/wespace';
exports.mongoose = require('mongoose');
exports.initMongo = () =>{
    exports.mongoose.connect(MONGO_URL, {
        useNewUrlParser:true,
        autoReconnect : true
    }, 60000)
        .then((msg) => {
            console.log("mongodb 접속 성공!");
        })
        .catch((err) => {
            console.log("mongodb 접속 실패..");
            console.log(err);
        });
}
