const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn } = require('../utils/authMiddlewares');

//Controller
const users = require('../controllers/users');

router.route('/')
    .get(catchAsync(users.listUsers));

router.route('/registrar')
    .get(users.serveRegisterForm)
    .put(catchAsync(users.register));

router.route('/login')
    .get(users.serveLoginForm)
    .post(passport.authenticate('local', {failureRedirect: '/user/login'}), users.login);

router.route('/editar')
    .get(isLoggedIn, catchAsync(users.serveEditForm))
    .post(catchAsync(users.edit));

router.route('/eliminar')
    .delete(catchAsync(users.deleteAcount));

router.get('/logout', users.logout);

module.exports = router;