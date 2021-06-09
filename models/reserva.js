const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');
const Mesa = require('./mesa');

const ReservaSchema = Schema({
    fecha: {
        type: Date,
        required: true
    },
    horaInicio: {
        type: Number,
        required: true
    },
    horaFinal: {
        type: Number,
        required: true
    },
    mesa:{
        type: Schema.Types.ObjectId,
        ref: 'Mesa',
        required: true
    },
    clienteCI: {
        _id: {id: false},
        type: Number,
        required: true
    }
});

ReservaSchema.post('remove', async function (doc){
    if(doc){
        await User.findOneAndUpdate({cedula: doc.clienteCI}, {$pull: {reservas: doc._id}});
        await Mesa.findOneAndUpdate({_id: doc.mesa}, {$pull: {reservas: doc._id}});
    }
});

module.exports = mongoose.model('Reserva', ReservaSchema);