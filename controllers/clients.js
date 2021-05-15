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
            req.flash('success', 'Cliente Registrado');
            return res.redirect('/reservas');
        });
    } catch (error){
        req.flash('error', error.message);
        res.redirect('/cliente/registrar');
    }
}

const serveLoginForm = (req, res)=>{
    res.render('clients/login');
}

const login = (req, res)=>{
    req.flash('success', 'Bienvenido de Vuelta!')
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);    
}

const logout = (req, res)=>{
    req.logout();
    req.flash('success', 'Hasta Luego')
    res.redirect('/');
}

const serveEditForm = async (req, res)=>{
    const client = await Client.findOne({username: req.session.passport.user});
    res.render('clients/edit', { cliente: client });
}

const edit = async (req, res)=>{
    const { username, nombre, apellido } = req.body;
    const client = await Client.findOne({_id: req.body.id});
    client.nombre = nombre;
    client.apellido = apellido;
    client.username = username;
    await client.save();
    req.flash('success', 'Cambios Guardados');
    res.status(200).redirect('/'); 
}

const deleteAcount = async (req, res)=>{
    const deletedClient = await Client.findByIdAndDelete(req.body.id);
    req.flash('success', 'Cliente dado de baja');
    res.status(200).redirect('/');
}

const listClients = async (req, res)=>{
    const clients = await Client.find({});
    res.send(clients);
}

module.exports = {
    serveRegisterForm,
    register,
    serveLoginForm,
    login,
    logout,
    serveEditForm,
    edit,
    deleteAcount,
    listClients
}