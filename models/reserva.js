const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservaSchema = Schema({
    fecha: {
        type: Date,
        required: true
    },
    horas: [
        {
            holaInicio: {
                type: Number,
                required: true
            },
            horaFinal: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Reserva', ReservaSchema);