

//middleware to check if the user is admin  
const checkAdmin = (req, res, next) => {
    const { isAdmin } = req.user;
    if (isAdmin !== 'true') {
        return res.status(403).json({ message: 'Unauthorized access! Admin role required!' });
    }
    next();
};

module.exports = checkAdmin;
