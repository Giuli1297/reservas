const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const createProducto = async (req, res)=>{
    const categoria = await Categoria.findOne({_id: req.body.idCategoria});
    const {nombre, precioDeVenta} = req.body.producto;
    const producto = new Producto({nombre, precioDeVenta});
    producto.categoria = categoria._id;
    categoria.productos.push(producto);
    await producto.save();
    await categoria.save();
    return res.status(201).send(producto);
}

const listProductos = async (req, res)=>{
    const productos = await Producto.find({});
    res.status(200).send(productos);
}

const updateProducto = async (req, res)=>{
    const producto = await Producto.findOne({_id: req.body._id});
    const { nombre, precioDeVenta } = req.body;
    producto.nombre = nombre;
    producto.precioDeVenta = precioDeVenta;
    await producto.save();
    return res.status(200).send(producto);
}

const deleteProducto = async (req, res)=>{
    const id = req.body._id; 
    const deletedProducto = await Producto.findByIdAndDelete(id);
    await Categoria.findOneAndUpdate({productos: id}, {$pull: {productos: id}});
    return res.status(200).send(deletedProducto);
}

module.exports = {
    createProducto,
    listProductos,
    updateProducto,
    deleteProducto
}