//Model
const Client = require('../models/client');

const serveRegisterForm = (req, res)=>{
    res.render('clients/register');
}

const register = async (req, res)=>{
    try{
        const { cedula, nombre, apellido, username, password } = req.body;
        const client = new Client({cedula, nombre, apellido, username});
        const registeredClient = await Client.register(client, password);
        req.login(registeredClient, err=>{
            if(err) return next(err);
            res.redirect('/');
        });
    } catch (error){
        res.redirect('/registrar');
    }
}

const serveLoginForm = (req, res)=>{
    res.render('clients/login');
}

const login = (req, res)=>{
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);    
}

const logout = (req, res)=>{
    req.logout();
    res.redirect('/');
}

module.exports = {
    serveRegisterForm,
    register,
    serveLoginForm,
    login,
    logout
}