const jwt = require('jsonwebtoken');
const router = require('./auth');


const verifyToken = (req,res,next)=>{
    const token = req.cookies.token;
  if (!token)
    return res.status(401).send("Access denied...No token provided...");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    req.user = decoded;
    next();
  } catch (err) {
    // console.log("err", er);
    //Incase of expired jwt or invalid token kill the token and clear the cookie
    res.clearCookie("token");
    return res.status(400).send(er.message);
  }
};

const verifyTokenandAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            return res.status(403).json('you are not allowed')
        } 
    });
};
const verifyTokenandAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            return res.status(403).json('you are not allowed')
        } 
    });
};

module.exports = { verifyToken, verifyTokenandAuthorization, verifyTokenandAdmin };