const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');
const Mesa = require('./mesa');

const ConsumoSchema = Schema({
    fechaCreacion: {
        type: Date,
        default: Date.now,
        required: true
    },
    mesa:{
        type: Schema.Types.ObjectId,
        ref: 'Mesa',
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    estado: {
        type: String,
        enum: ['abierto', 'cerrado'],
        default: 'abierto',
        required: true
    },
    total: {
        type: Number,
        default: 0
    },
    fechaCierre: {
        type: Date
    },
    detalles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Detalle'
        }
    ]
});

ConsumoSchema.post('remove', async function (doc){
    if(doc){
        await User.findOneAndUpdate({_id: doc.cliente}, {$pull: {consumos: doc._id}});
        await Mesa.findOneAndUpdate({_id: doc.mesa}, {$pull: {consumos: doc._id}});
    }
});

ConsumoSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await Detalle.deleteMany({
            _id: { $in: doc.detalles }
        });
    }
});

module.exports = mongoose.model('Consumo', ConsumoSchema);