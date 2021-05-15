const Restaurante = require('../models/restaurante');

const createRest = async (req, res, next)=>{
    let { nombre, direccion, imagen } = req.body;
    nombre = nombre.toLowerCase();
    const resta = new Restaurante({nombre, direccion, imagen});
    await resta.save();
    res.status(201).send(resta);
}

const listRest = async (req, res)=>{
    const restas = await Restaurante.find({});
    res.status(200).send(restas);
}

const updateRest = async(req, res)=>{
    const resta = await Restaurante.findOne({_id: req.body._id});
    const { nombre, direccion, imagen } = req.body;
    resta.nombre = nombre;
    resta.direccion = direccion;
    resta.imagen = imagen;
    await resta.save();
    res.status(200).send(resta);
}

const deleteRest = async (req, res)=>{
    const deletedRest = await Restaurante.findByIdAndDelete(req.body._id);
    req.flash('success', 'Restaurante Eliminado');
    res.status(200).redirect('/');
}

module.exports = {
    createRest,
    listRest,
    updateRest,
    deleteRest
}