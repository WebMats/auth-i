module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const email = authHeader.split(' ')[1];
    if (!email || email === '') {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.email = email;
    next();
}