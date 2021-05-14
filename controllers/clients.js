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
            res.send(registeredClient);
        });
    } catch (error){
        res.redirect('/cliente/registrar');
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
    res.send(client); 
}

const deleteAcount = async (req, res)=>{
    const deletedClient = await Client.deleteOne({_id: req.body.id});
    res.send(deletedClient);
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