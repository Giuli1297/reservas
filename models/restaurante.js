const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mesa = require('./mesa');

const RestauranteSchema = new Schema({
    nombre: {
        type: String, 
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    imagen: String,
    mesas: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Mesa'
        }
    ]
});

RestauranteSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await Mesa.deleteMany({
            _id: { $in: doc.mesas }
        });
    }
});

module.exports = mongoose.model('Restaurante', RestauranteSchema);