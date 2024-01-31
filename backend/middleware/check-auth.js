const jwt = require("jsonwebtoken");



module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1]; // "Bearer token"
        console.log("token this is >>>", token);
        if(!token){
            throw new Error("Authentication failed!");
        }
        const decodedToken = jwt.verify(token, "secretion");
        console.log("decodedToken >>>> ", decodedToken);
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    }catch(error){
        res.status(401).json({message: "You are not authenticated!"});
    }
}