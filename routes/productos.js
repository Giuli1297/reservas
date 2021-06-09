const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const productos = require('../controllers/producto');

router.route('/')
    .get(catchAsync(productos.listProductos));

router.route('/create')
    .put(catchAsync(productos.createProducto));

router.route('/update')
    .post(catchAsync(productos.updateProducto));

router.route('/delete')
    .delete(catchAsync(productos.deleteProducto));

module.exports = router;