const Mesa = require('../models/mesa');
const Restaurante = require('../models/restaurante');

const createMesa = async (req, res)=>{
    const restaurant = await Restaurante.findOne({_id: req.body.idRestaurante});
    const mesa = new Mesa(req.body.mesa);
    restaurant.mesas.push(mesa);
    await mesa.save();
    await restaurant.save();
    res.status(201).send(mesa);
}

const listMesa = async (req, res)=>{
    const mesas = await Mesa.find({});
    res.status(200).send(mesas);
}

const updateMesa = async (req, res)=>{
    const mesa = await Mesa.findOne({_id: req.body._id});
    const { nombre, posicion, piso, capacidad } = req.body;
    mesa.nombre = nombre;
    mesa.posicion = posicion;
    mesa.piso = piso;
    mesa.capacidad = capacidad;
    await mesa.save();
    res.status(200).send(mesa);
}

const deleteMesa = async (req, res)=>{
    const deletedMesa = await Mesa.deleteOne({_id: req.body._id});
    res.status(200).send(deletedMesa);
}

module.exports = {
    createMesa,
    listMesa,
    updateMesa,
    deleteMesa
}