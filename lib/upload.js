
let base64Img=require('base64-img');
var dateFormat = require('dateformat');
let formidable = require('formidable');
let path = require('path');
// [ way to upload image in request ]
// server : base64 dataUrl -> upload to server directory as image file

generateImgName=()=>{
  let date=new Date();
  return dateFormat(date, "yyyymmdhMMss");
}

module.exports.uploadAsFile=async(req)=>{
 let form = new formidable.IncomingForm();
 form.uploadDir=path.join(__dirname, '..','uploads');
 form.encoding='utf8';
 form.keepExtensions =true;
 form.multiples=true;

 return new Promise((resolve, reject)=>{
 let uploadList=[];
 const note_id = req.params.note_id;

 form.on('file', function(field, file) {
   console.log('test file uplaod');
   console.log('file'+ file);
   file.path=file.path.split(path.join(__dirname, '..'))[1];
   console.log(file.path);
   const fileInfo=file.name.split('.');
   const type=fileInfo[fileInfo.length-1];
   console.log('type :' + type);
   const title = file.name.split('.'+type)[0];
   console.log('title : '+ title);

   let info = {
     note_id: note_id,
     title : title,
     type : type.toLowerCase(),
     url : file.path,
   };
   
   uploadList.push(info);
})
.on('fileBegin', function(name, file) {
  console.log('fileBegin');
})
.on('field', function(field, value){
  console.log('field');
})
.on('error', function(err){
  console.log('[uploadAsFile] '+ err);
})
.on('progress', function(bytesReceived, bytesExpected){
  var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
});

  form.parse(req,function(err, fields, files){
    console.log('parse');
    if(files){
     console.log(uploadList.length);
      resolve(uploadList);
    }
    if(err){
      reject(err);
    }
  });
})

}

module.exports.uploadAsbase64=(dataUrl) =>{

  return new Promise((resolve, reject)=>{

    base64Img.img(dataUrl, '../uploads', generateImgName(), async (err, filepath)=>{
      if(err){
      reject(err);
      }

      if(filepath){
        resolve(filepath);
      }
    });
  })
};

module.exports.getDataUrl =(path)=>{
  return new Promise((resolve, reject)=>{
  base64Img.base64(path ,async(err, data)=>{
    if(err){
      reject(err);
    }

    if(data){
      resolve(data);
    }
  });
  })
}
