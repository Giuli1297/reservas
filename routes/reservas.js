const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const reservas = require('../controllers/reserva');

router.route('/')
    .get(catchAsync(reservas.listReserva));

router.route('/create')
    .put(catchAsync(reservas.createReserva));

router.route('/update')
    .post(catchAsync(reservas.updateReserva));

router.route('/delete')
    .delete(catchAsync(reservas.deleteReserva));

module.exports = router;