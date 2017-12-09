'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

// service para crear un token a cada usuario
exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        rol: user.rol,
        image:user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    //retorna todo codificado junto a su clave secreta que necesitara para
    //desencriptar la informacion luego
    return jwt.encode(payload, secret);
};