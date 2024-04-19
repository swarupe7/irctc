

const jwt = require('jsonwebtoken');

//middleware to check if  user is logged in
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token is missing!' });
    }
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token is invalid!' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = authenticate;
