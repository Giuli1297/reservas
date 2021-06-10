const User = require('../models/user');
const Mesa = require('../models/mesa');
const Restaurante = require('../models/restaurante');
const Consumo = require('../models/consumo');
const Detalle = require('../models/detalle');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const pdf = require('html-pdf');
const ejs = require('ejs');
const fs = require('fs');

const serveMesas = async (req, res)=>{
    const { idRestaurante } = req.params;
    const restaurante = await Restaurante.findById(idRestaurante)
        .populate({
            path: 'mesas',
            populate: {
                path: 'consumos'
            }
        });
    if(!restaurante){
        req.flash('error','id Invalido');
        return res.redirect('/reservas');
    }
    res.render('consumos/mesas', { mesas: restaurante.mesas});
}

const handleTable = async (req, res)=>{
    const { idMesa } = req.query;
    const mesa = await Mesa.findById(idMesa).populate({
        path: 'consumos'        
    });
    const clientes = await User.find({});
    if(!mesa){
        req.flash('error', 'Id invalido');
        return res.redirect('/reservas');
    }
    if(!mesa.ocupado){
        req.flash('success', 'Mesa desocupada');
        return res.render('consumos/detalle', { mesa: mesa, clientes: clientes});
    }else{
        const consumo = await Consumo.findOne({_id: mesa.consumos[mesa.consumos.length-1]._id}).populate('cliente').populate({
            path: 'detalles',
            populate: {
                path: 'producto'
            }
        });
        return res.render('consumos/detalle', { mesa: mesa, clientes: clientes, consumo: consumo});
    }
};

const handleConsumoClient = async (req, res)=>{
    const { idMesa, idCliente, idConsumo } = req.body;
    const mesa = await Mesa.findById(idMesa);
    const cliente = await User.findById(idCliente);
    if(!mesa.ocupado){
        const consumo = new Consumo({mesa, cliente});
        await consumo.save();
        mesa.ocupado = true;
        mesa.consumos.push(consumo);
        await mesa.save();
        cliente.consumos.push(consumo);
        await cliente.save();
    }else{
        const consumo = await Consumo.findById(idConsumo);
        consumo.cliente = cliente;
        await consumo.save();
    }
    return res.redirect('/consumos/detalle?idMesa='+idMesa);
}

const addProductoForm = async (req, res)=>{
    const {idConsumo} = req.query;
    const consumo = await Consumo.findById(idConsumo);
    if(consumo.estado=='cerrado'){
        req.flash('error', 'Mesa Desocupada');
        return res.redirect('/consumos/detalle?idMesa='+consumo.mesa);
    }
    const categorias = await Categoria.find({}).populate('productos');
    res.render('consumos/addProduct', { categorias: categorias, idConsumo: idConsumo});
}

const addProductos = async (req, res)=>{
    const { idConsumo, productos } = req.body;
    const consumo = await Consumo.findById(idConsumo);
    if(consumo.estado=='cerrado'){
        req.flash('error', 'Mesa Desocupada');
        return res.redirect('/consumos/detalle?idMesa='+consumo.mesa);
    }
    if(Array.isArray(productos)){
        for(let idProducto of productos){
            const producto = await Producto.findById(idProducto);
            consumo.total += producto.precioDeVenta;
            const detallex = await Detalle.findOne({producto: producto, consumo: consumo._id});
            if(detallex){
                detallex.cantidad++;
                await detallex.save();
            }else{
                const detalle = new Detalle({producto, consumo});
                detalle.cantidad = 1;
                await detalle.save();
                consumo.detalles.push(detalle);
            }
            await consumo.save();
        }
    }else{
        const producto = await Producto.findById(productos);
        consumo.total += producto.precioDeVenta;
        const detallex = await Detalle.findOne({producto: producto, consumo: consumo._id});
        if(detallex){
            detallex.cantidad++;
            await detallex.save();
        }else{
            const detalle = new Detalle({producto, consumo});
            detalle.cantidad = 1;
            await detalle.save();
            consumo.detalles.push(detalle);
        }
        await consumo.save();
    }
    res.redirect('/consumos/detalle?idMesa='+consumo.mesa);
}

const cerrarConsumo = async (req, res)=>{
    const {idMesa, idConsumo} = req.body;
    const mesa = await Mesa.findById(idMesa);
    const consumo = await Consumo.findById(idConsumo).populate('cliente').populate({
        path: 'detalles',
        populate: {
            path: 'producto'
        }
    });
    if(!mesa.ocupado){
        req.flash('error', 'Mesa Desocupada');
        return res.redirect('/consumos/detalle?idMesa='+consumo.mesa);
    }
    consumo.fechaCierre = Date.now();
    consumo.estado = 'cerrado';
    await consumo.save();
    mesa.ocupado = false;
    await mesa.save();
    ejs.renderFile("C:\\Users\\giuli\\backend\\Reservas\\utils\\ticket\\ticket.ejs", {consumo:consumo}, (err, data)=>{
        if(err){
            res.send(err);
        }else{
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(data, options).toFile("../../report"+consumo._id+".pdf", function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    return res.redirect('/consumos/ticket?id='+consumo._id);
                }
            });
        }
    });
};

const printTicket = async (req, res)=>{
    const {id} = req.query;
    const path = '../../report'+id+'.pdf';
    if (fs.existsSync(path)) {
        res.contentType("application/pdf");
        fs.createReadStream(path).pipe(res)
    } else {
        res.status(500)
        console.log('File not found')
        res.send('File not found')
    }
};

const cancelarConsumo = async (req, res)=>{
    const {idMesa, idConsumo} = req.body;
    const mesa = await Mesa.findById(idMesa);
    if(!mesa.ocupado){
        req.flash('error', 'Mesa Desocupada');
        return res.redirect('/consumos/detalle?idMesa='+consumo.mesa);
    }
    const consumo = await Consumo.findOneAndDelete(idConsumo); 
    mesa.ocupado = false;
    await mesa.save();
    req.flash('error', 'Cuenta Cancelada');
    return res.redirect('/consumos/detalle?idMesa='+consumo.mesa);
};

module.exports = {
    serveMesas,
    handleTable,
    handleConsumoClient,
    addProductoForm,
    addProductos,
    cerrarConsumo,
    printTicket,
    cancelarConsumo
}