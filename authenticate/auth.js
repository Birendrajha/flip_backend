const jwt =require('jsonwebtoken')


const auth =async(req,res,next)=>{
    try{
    const token = req.headers.authorization.split(" ")[1];
    //jwt.verify return the payload i.e the id in this case;
    const decoded =jwt.verify(token,'thisismyfinalproject');
    req.userData=decoded;
    next();
}catch(e){
    return res.status(400).json({
        message:'Auth failed'
    })
}

}

module.exports =  auth;