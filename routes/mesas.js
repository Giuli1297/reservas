const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const mesas = require('../controllers/mesa');

router.route('/')
    .get(catchAsync(mesas.listMesa));

router.route('/create')
    .put(catchAsync(mesas.createMesa));

router.route('/update')
    .post(catchAsync(mesas.updateMesa));

router.route('/delete')
    .delete(catchAsync(mesas.deleteMesa));

module.exports = router;