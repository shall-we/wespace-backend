const authToken =require('../lib/token');

exports.checkToken= async(req,res,next)=>{
    console.log(req.url);

    const {token} = req.cookies;

     if(!token){
    //     token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    //       if (token.startsWith('Bearer ')) {
    //       // Remove Bearer from string
    //       token = token.slice(7, token.length);
    //     }
        next();
    }else{

    let decodedToken = await authToken.decodeToken(token).catch(err=>{
        console.log(err);
        res.send({result : 'fail', failType : "It's error for decodeToken"});
    });
    req.user=decodedToken;
    next();
}
}