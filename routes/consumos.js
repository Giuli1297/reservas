const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isAuthor, isWaiter } = require('../utils/authMiddlewares');

const consumo = require('../controllers/consumos');

router.route('/detalle/cerrar').
    post(isLoggedIn, catchAsync(isWaiter), catchAsync(consumo.cerrarConsumo));

router.route('/detalle/addProduct')
    .get(isLoggedIn, catchAsync(isWaiter), catchAsync(consumo.addProductoForm))
    .post(isLoggedIn, catchAsync(isWaiter), catchAsync(consumo.addProductos));

router.route('/ticket')
    .get(isLoggedIn, catchAsync(isWaiter), catchAsync(consumo.printTicket));

router.route('/detalle')
    .get(isLoggedIn, catchAsync(isWaiter), catchAsync(consumo.handleTable))
    .post(isLoggedIn, catchAsync(isWaiter), catchAsync(consumo.handleConsumoClient));

router.route('/:idRestaurante')
    .get(isLoggedIn, catchAsync(isWaiter), catchAsync(consumo.serveMesas));

module.exports = router;