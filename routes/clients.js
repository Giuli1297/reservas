const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn } = require('../utils/authMiddlewares');

//Controller
const clients = require('../controllers/clients');

router.route('/registrar')
    .get(clients.serveRegisterForm)
    .post(catchAsync(clients.register));

router.route('/login')
    .get(clients.serveLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), clients.login);

router.get('/logout', clients.logout)

module.exports = router;