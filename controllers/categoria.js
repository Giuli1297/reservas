const Categoria = require('../models/categoria');

const createCategoria = async (req, res)=>{
    let { nombre } = req.body;
    nombre = nombre.toLowerCase();
    const categoria = new Categoria({nombre});
    await categoria.save();
    res.status(201).send(categoria);
}

const listCategorias = async (req, res)=>{
    const categorias = await Categoria.find({});
    res.status(200).send(categorias);
}

const updateCategoria = async(req, res)=>{
    const categoria = await Categoria.findOne({_id: req.body._id});
    const { nombre } = req.body;
    categoria.nombre = nombre;
    await categoria.save();
    res.status(200).send(categoria);
}

const deleteCategoria = async (req, res)=>{
    const deletedCategoria = await Categoria.findByIdAndDelete(req.body._id);
    req.flash('success', 'Categoria Eliminada');
    res.status(200).send(deletedCategoria);
}

module.exports = {
    createCategoria,
    listCategorias,
    updateCategoria,
    deleteCategoria
}