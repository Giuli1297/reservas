const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    precioDeVenta: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('Producto', ProductoSchema);