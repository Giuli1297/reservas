const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const categorias = require('../controllers/categoria');

router.route('/')
    .get(catchAsync(categorias.listCategorias));

router.route('/create')
    .put(catchAsync(categorias.createCategoria));

router.route('/update')
    .post(catchAsync(categorias.updateCategoria));

router.route('/delete')
    .delete(catchAsync(categorias.deleteCategoria));

module.exports = router;