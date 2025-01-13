const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    try{
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
            }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

        }catch (err){
            console.error(err);
            res.clearCookie('jwt');
            res.status(500).json({ message: "Invalid or Expired Token" });
        return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
        }
}
module.exports = isAuthenticated;