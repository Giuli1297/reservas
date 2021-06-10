const Reserva = require('../models/reserva');
const User = require('../models/user');
const Mesa = require('../models/mesa');
const Restaurante = require('../models/restaurante');
const reserva = require('../models/reserva');

const serveRestaurantes = async (req, res)=>{
    const restaurantes = await Restaurante.find({});
    res.render('reservas/restaurantes', { restaurantes: restaurantes });
}

const serveReservaForm = async (req, res)=>{
    const { idRestaurante } = req.params;
    const { fecha } = req.query;
    const restaurante = await Restaurante.findById(idRestaurante)
        .populate({
            path: 'mesas',
            populate: {
                path: 'reservas'
            }
        });
    if(!restaurante){
        req.flash('error','id Invalido');
        return res.redirect('/reservas');
    }
    res.render('reservas/reserva', { mesas: restaurante.mesas, fecha: fecha });
}

const setHours = (i12f13, i13f14, i14f15, i19f20, i20f21, i21f22, i22f23)=>{
    let horaInicio = 0;
    let horaFinal = 0;
    if(i12f13){
        horaInicio = 12;
        horaFinal = 13;    
    }
    if(i13f14){
        if(horaInicio!=0){
            horaFinal=14;
        }else{
            horaInicio=13;
            horaFinal=14;
        }
    }
    if(i14f15){
        if(horaInicio!=0){
            if(horaFinal!=14){
                horaInicio = 0;
                horaFinal = 0;
                return {horaInicio, horaFinal};
            }
            horaFinal = 15;
        }else{
            horaInicio=14;
            horaFinal=15;
        }
    }
    if(horaInicio!=0){
        if(!(i19f20) && !(i20f21) && !(i21f22) && !(i22f23)){
            return {horaInicio, horaFinal};
        }else{
            horaInicio = 0;
                horaFinal = 0;
                return {horaInicio, horaFinal};
        }
    }
    if(i19f20){
        horaInicio = 19;
        horaFinal = 20;    
    }
    if(i20f21){
        if(horaInicio!=0){
            horaFinal=21;
        }else{
            horaInicio=20;
            horaFinal=21;
        }
    }
    if(i21f22){
        if(horaInicio!=0){
            if(horaFinal!=21){
                horaInicio = 0;
                horaFinal = 0;
                return {horaInicio, horaFinal};
            }
            horaFinal = 22;
        }else{
            horaInicio=21;
            horaFinal=22;
        }
    }
    if(i22f23){
        if(horaInicio!=0){
            if(horaFinal!=22){
                horaInicio = 0;
                horaFinal = 0;
                return {horaInicio, horaFinal};
            }
            horaFinal = 23;
        }else{
            horaInicio=22;
            horaFinal=23;
        }
    }
    return {horaInicio, horaFinal};
}

const reservar = async (req, res)=>{
    const { idMesa, fecha, i12f13, i13f14, i14f15, i19f20, i20f21, i21f22, i22f23} = req.body;
    const cliente = await User.findOne({username: req.session.passport.user});
    const mesa = await Mesa.findById(idMesa).populate('reservas');
    const { horaInicio, horaFinal} = setHours(i12f13, i13f14, i14f15, i19f20, i20f21, i21f22, i22f23);
    const horaInicioN = parseInt(horaInicio);
    const horaFinalN = parseInt(horaFinal);
    const date = new Date(fecha);
    const currentDate = new Date();
    if(horaInicioN>=horaFinalN){
        req.flash('error', 'Hora invalida');
        return res.redirect('/reservas');
    }else if(date.getTime()+1000*60*60*24<currentDate.getTime()){
        req.flash('error', 'Fecha invalida');
        return res.redirect('/reservas');
    }
    for(let reserva of mesa.reservas){
        if(reserva.fecha.getTime() == date.getTime()){
            if(horaInicioN>=reserva.horaInicio){
                if(!(horaInicioN>=reserva.horaFinal)){
                    req.flash('error', 'Hora Ocupada');
                    return res.redirect('/reservas');
                }
            }else if(horaInicioN<=reserva.horaInicio){
                if(!(horaFinalN<=reserva.horaInicio)){
                    req.flash('error', 'Hora Ocupada');
                    return res.redirect('/reservas');
                }
            }        
        }
    }
    const reserva = new Reserva({fecha: date, horaInicio: horaInicioN, horaFinal: horaFinalN, cliente: cliente});
    mesa.reservas.push(reserva);
    await mesa.save();
    mesa.reservas = [];
    reserva.mesa = mesa;
    await reserva.save();
    cliente.reservas.push(reserva);
    await cliente.save();
    req.flash('success', 'Reserva Registrada');
    res.redirect('/reservas')
}

const serveFormListReservas = async (req, res)=>{
    let { clear, restaurante, fecha, cliente } = req.query;
    if(clear=="true"){
        return res.render('reservas/listReservas', {reservaRest: []});
    }
    let restau;
    let reservaRest = [];
    if(restaurante){
        restaurante = restaurante.toLowerCase();
        restau = await Restaurante.findOne({nombre: restaurante})
            .populate({
                path: 'mesas',
                populate: {
                    path: 'reservas'
                }
            });
        if(!restau){
            req.flash('error', 'Nombre de Restaurante Inexistente');
            return res.redirect('/reservas/list?clear=true');
        }
        for(let mesa of restau.mesas){
            for(let reserva of mesa.reservas){
                reservaRest.push(reserva);
            }
        }
    }
    let cliente1;
    let reservaRest2 = [];
    if(cliente){
        cliente1 = await User.findOne({cedula: cliente}).populate('reservas');
        if(!cliente1){
            req.flash('error', 'Cliente No Existe');
            return res.redirect('/reservas/list?clear=true');
        }
        if(reservaRest.length > 0){
            for(let reservaR of reservaRest){
                for(let reservaC of cliente1.reservas){
                    if(reservaC._id.equals(reservaR._id)){
                        reservaRest2.push(reservaC);
                    }
                }    
            }
        }else{
            for(let reservaC of cliente1.reservas){
                reservaRest2.push(reservaC);
            } 
        }
        if(reservaRest2.length==0){
            req.flash('error', 'No existen reservas de ese cliente');       
            return res.redirect('/reservas/list?clear=true');
        }
    }
    if(reservaRest2.length > 0){
        reservaRest = reservaRest2;
    }
    reservaRest2 = [];
    if(fecha){
        const date = new Date(fecha);
        if(reservaRest.length > 0){
            for(let reserva of reservaRest){
                if(reserva.fecha.getTime()==date.getTime()){
                    reservaRest2.push(reserva);
                }
            }
        }else{
            reservaRest2 = await Reserva.find({fecha: date});
            if(reservaRest2.length==0){
                req.flash('error', 'No existen reservas en esa fecha');       
                return res.redirect('/reservas/list?clear=true');
            }
        }
    }
    if(reservaRest2.length > 0){
        reservaRest = reservaRest2;
    }
    if(reservaRest.length==0){
        reservaRest = await Reserva.find({});
    }
    for(var i=0;i<reservaRest.length;i++){
        reservaRest[i] = await Reserva.findById(reservaRest[i]._id).populate('mesa');
    }
    reservaRest.sort(compare);
    req.flash('success', 'Filtros Aplicados');
    res.render('reservas/listReservas', { reservaRest: reservaRest });
}

const compare = (res1, res2)=>{
    if(res1.fecha.getTime()>res2.fecha.getTime()){
        return 1;
    }else if(res1.fecha.getTime()<res2.fecha.getTime()){
        return -1;
    }else{
        if(res1.horaInicio>res2.horaInicio){
            return 1;
        }else if(res1.horaInicio<res2.horaInicio){
            return -1;
        }else{
            if(res1.mesa.nombre>res2.mesa.nombre){
                return 1;
            }else{
                return -1;
            }
        }
    }
    return 0;
}

const deleteR = async (req, res)=>{
    const id = req.params.idRestaurante;
    const reserva = await Reserva.findOne({_id: id});
    await User.findOneAndUpdate({_id: reserva.cliente}, {$pull: {reservas: id}});
    await Mesa.findOneAndUpdate({_id: reserva.mesa}, {$pull: {reservas: id}});
    await Reserva.findByIdAndDelete(id);
    req.flash('success', 'Reserva Cancelada');
    res.redirect('/reservas');
}

module.exports = {
    serveRestaurantes,
    serveReservaForm,
    reservar,
    serveFormListReservas,
    deleteR
}