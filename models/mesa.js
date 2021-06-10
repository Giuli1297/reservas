const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reserva = require('./reserva');
const Consumo = require('./consumo');

const MesaSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    posicion: {
        type: String,
        required: true
    },
    piso: {
        type: Number,
        required: true
    },
    capacidad: {
        type: Number,
        required: true
    },
    ocupado: {
        type: Boolean,
        default: false
    },
    restaurante: {
        _id: {id:false},
        type: String,
        required: true
    },
    reservas: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reserva'
        }
    ],
    consumos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Consumo'
        }
    ]
});

MesaSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await Reserva.deleteMany({
            _id: { $in: doc.reservas }
        });
        await Consumo.deleteMany({
            _id: { $in: doc.consumos }
        });
    }
});

module.exports = mongoose.model('Mesa', MesaSchema);