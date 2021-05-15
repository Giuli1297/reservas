const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isAuthor } = require('../utils/authMiddlewares');

const reservas = require('../controllers/reserva');

router.route('/')
    .get(isLoggedIn, catchAsync(reservas.serveRestaurantes))
    .post(isLoggedIn, catchAsync(reservas.reservar));

router.route('/list')
    .get(isLoggedIn, catchAsync(reservas.serveFormListReservas));

router.route('/:idRestaurante')
    .get(isLoggedIn, catchAsync(reservas.serveReservaForm))
    .delete(isLoggedIn, catchAsync(isAuthor), catchAsync(reservas.deleteR));

module.exports = router;