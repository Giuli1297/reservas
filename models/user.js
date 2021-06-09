const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Reserva = require('./reserva');

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
    }
});

module.exports = mongoose.model('User', UserSchema);