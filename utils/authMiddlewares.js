const Reserva = require('../models/reserva');

const isLoggedIn = (req, res, next)=>{
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        return res.redirect('/user/login');
    }
    next();
}

const isAuthor = async(req, res, next)=>{
    const id = req.params.idRestaurante;
    const reserva = await Reserva.findOne({_id: id});
    if(!(reserva.clienteCI == req.user.cedula)){
        req.flash('error', "You don't haver permission to do that!");
        return res.redirect('/reservas');
    }
    next();
}

module.exports = {
    isLoggedIn,
    isAuthor
}