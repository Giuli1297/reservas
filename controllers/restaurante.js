const Restaurante = require('../models/restaurante');

const createRest = async (req, res, next)=>{
    const resta = new Restaurante(req.body);
    await resta.save();
    res.status(201).send(resta);
}

const listRest = async (req, res)=>{
    const restas = await Restaurante.find({});
    res.status(200).send(restas);
}

const updateRest = async(req, res)=>{
    const resta = await Restaurante.findOne({_id: req.body._id});
    const { nombre, direccion } = req.body;
    resta.nombre = nombre;
    resta.direccion = direccion;
    await resta.save();
    res.status(200).send(resta);
}

const deleteRest = async (req, res)=>{
    const deletedRest = await Restaurante.deleteOne({_id: req.body._id});
    res.status(200).send(deletedClient);
}

module.exports = {
    createRest,
    listRest,
    updateRest,
    deleteRest
}