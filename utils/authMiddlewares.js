const isLoggedIn = (req, res, next)=>{
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        return res.redirect('cliente/login');
    }
    next();
}

module.exports = {
    isLoggedIn
}