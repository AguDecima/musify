'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

//middelware para desencriptar un token y verificar que puede acceder a esa ruta
exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: "La petision no tiene la cabecera de autenticacion"});
    }

    //cuando recibo el token le quito las comillas simples y dobles que pueda tener
    var token = req.headers.authorization.replace(/['"]+/g,'');
    //decodifico el token
    try {
        // decodifico el token junto a la clave secreta
        var payload = jwt.decode(token, secret);
        // verifico si aun no expito el token
        if(payload.exp <= moment().unix()){
            console.log(error);
            return res.status(401).send({message: "El token a expirado"});
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({message: "Token no valido"});
    }

    req.user = payload;

    next();

};