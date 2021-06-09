const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Producto = require('./producto');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    productos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Producto'
        }
    ]
});

CategoriaSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        const productos = doc.productos;
        await Producto.deleteMany({
            _id: { $in: doc.mesas }
        });
    }
});

module.exports = mongoose.model('Categoria', CategoriaSchema);