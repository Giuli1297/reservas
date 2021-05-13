const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//Model
const ClientSchema = new Schema({
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
    }
});

ClientSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Client', ClientSchema);