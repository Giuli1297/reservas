const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Reserva = require('./reserva');
const Consumo = require('./consumo');

//Model
const UserSchema = new Schema({
    cedula: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
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
    ],
    isWaiter: {
        type: Boolean,
        required: true
    }
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await Reserva.deleteMany({
            _id: { $in: doc.reservas }
        });
        await Consumo.deleteMany({
            _id: { $in: doc.consumos }
        });
    }
});

module.exports = mongoose.model('User', UserSchema);