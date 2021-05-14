const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const restaurantes = require('../controllers/restaurante');

router.route('/')
    .get(catchAsync(restaurantes.listRest));

router.route('/create')
    .put(catchAsync(restaurantes.createRest));

router.route('/update')
    .post(catchAsync(restaurantes.updateRest));

router.route('/delete')
    .delete(catchAsync(restaurantes.deleteRest));

module.exports = router;