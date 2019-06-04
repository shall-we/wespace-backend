const authToken =require('../lib/token');

exports.checkToken= async(req,res,next)=>{
    console.log(req.url);

    const {token} = req.cookies;

    if(!token){
        if(req.url!=="/login"&&req.url!=="/join"){
        console.log('this error');
        res.send("It's not have token!!!");
        }else{
            next();
        }
    }else{

    authToken.decodeToken(token)
    .then(decodedToken => {
        req.user=decodedToken;
        next();
    })
    .catch(err=>{
        console.log(err);
        res.send("It's error for decodeToken");
    });
}
}