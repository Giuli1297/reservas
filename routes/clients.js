const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn } = require('../utils/authMiddlewares');

//Controller
const clients = require('../controllers/clients');

router.route('/')
    .get(catchAsync(clients.listClients));

router.route('/registrar')
    .get(clients.serveRegisterForm)
    .put(catchAsync(clients.register));

router.route('/login')
    .get(clients.serveLoginForm)
    .post(passport.authenticate('local', {failureRedirect: '/cliente/login'}), clients.login);

router.route('/editar')
    .get(isLoggedIn, catchAsync(clients.serveEditForm))
    .post(catchAsync(clients.edit));

router.route('/eliminar')
    .delete(catchAsync(clients.deleteAcount));

router.get('/logout', clients.logout);

module.exports = router;