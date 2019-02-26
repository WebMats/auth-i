module.exports = (req, res, next) => {
    const session = req.session;
    if (!session) {
        req.isAuth = false;
        return next();
    }
    const user = req.session.user;
    if (!user || user === '' || user == 'null') {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.user = user;
    next();
}