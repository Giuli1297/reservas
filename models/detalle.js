const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetalleSchema = Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    cantidad: {
        type: Number,
        default: 0,
        required: true
    },
    consumo: {
        type: Schema.Types.ObjectId,
        ref: 'Consumo',
        required: true
    }
});

module.exports = mongoose.model('Detalle', DetalleSchema);