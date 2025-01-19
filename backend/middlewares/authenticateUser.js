const jwt = require('jsonwebtoken');
const Auth = require('../models/authModel');

const isAuthenticated = (req, res, next) => {
    try{
        const token = req.cookies.token;
       if (token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
       }else{
        res.status(401).json({message:  "Unauthorized acces"});
        return res.redirect('/login')
       }
       

        }catch (err){
            console.error(err);
            res.clearCookie('token');
            res.status(500).json({ message: "Invalid or Expired Token", error: err.message });
        return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
        }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.token;

    if (token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await Auth.findById(decodedToken.userId).select("-password");
                if (!user) {
                    return res.status(404).json({ message:"user not found"});
                }
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }

}

module.exports = {isAuthenticated, checkUser};