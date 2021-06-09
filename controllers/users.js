//Model
const User = require('../models/user');

const serveRegisterForm = (req, res)=>{
    res.render('users/register');
}

const register = async (req, res)=>{
    try{
        const { cedula, nombre, apellido, username, password, isWaiter } = req.body;
        let isWaiterx = isWaiter == 'True';
        const user = new User({cedula, nombre, apellido, username, isWaiter: isWaiterx});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash('success', 'Usuario Registrado');
            return res.redirect('/');
        });
    } catch (error){
        req.flash('error', error.message);
        res.redirect('/user/registrar');
    }
}

const serveLoginForm = (req, res)=>{
    res.render('users/login');
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
    const user = await User.findOne({username: req.session.passport.user});
    res.render('users/edit', { user: user });
}

const edit = async (req, res)=>{
    const { username, nombre, apellido } = req.body;
    const user = await User.findOne({_id: req.body.id});
    user.nombre = nombre;
    user.apellido = apellido;
    user.username = username;
    await user.save();
    req.flash('success', 'Cambios Guardados');
    res.status(200).redirect('/'); 
}

const deleteAcount = async (req, res)=>{
    const deletedUser = await User.findByIdAndDelete(req.body.id);
    req.flash('success', 'Usuario dado de baja');
    res.status(200).redirect('/');
}

const listUsers = async (req, res)=>{
    const users = await User.find({});
    res.send(users);
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
    listUsers
}