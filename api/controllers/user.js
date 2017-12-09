'use strict'
// declaramos bcrypt para encriptar las contraseñas de los usuarios
var bcrypt = require('bcrypt-nodejs');
// importamos el modelo para poder instanciar el objeto
var User = require('../models/user');
//cargamos el servicio de jwt
var jwt = require('../services/jwt');
// para trabajar con ficheros y las rutas
var fs = require('fs');
var path = require('path');

function pruebas(req,res){
    res.status(200).send({message:"ingresaste con el token correcto"});
};

//metodo para registrar un usuario
function saveUser(req,res){
    // creando un nuevo usuario tenemos una nueva instancia, podiendo acceder 
    // a los atributos de los usuarios
    var user = new User();

    // recogemos todos los datos que nos llegan por post
    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.rol = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        //encriptar contraseña y guardar dato
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                // guarde el usuario
                user.save((err, userStored)=>{
                    if(err){
                        res.status(500).send({message:"Error al guardar el usuario"});
                    }else{
                        if(!userStored){
                            res.status(404).send({message:"No se ha registrado el usuario"});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({message:"Introduce todos los campos"});
            }
        });
    }else{
        res.status(200).send({message:"Introduce la contraseña"});
    }

}

// metodo para el login
function loginUser(req,res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err,user) => {
        if (err) {
            res.status(500).send({message:"Error en la petision"});
        }else{
            if(!user){
                res.status(404).send({message:"El usuario no existe"});
            }else{
                // comprobar la contraseña
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //devolver los datos del usuario logueado
                        if(params.gethash){
                            //devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message:"Usuario no han podido loguearse"});     
                    }
                });
            }
        }
    });
}

//metodo para actualizar un usuario
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
       return res.status(500).send({message:"No tienes permiso para actualizar este usuario"});        
    }

    // pasamos el id del usuario a modificar , luego
    // le pasamos el body de lo que deseamos actualizar
    User.findByIdAndUpdate(userId, update, (err, userUpdate)=>{
        if (err) {
            res.status(500).send({message:"Error al actualizar el usuario"});
        }else{
            if (!userUpdate) {
                res.status(404).send({message:"No se ha podido actualizar el usuario"});
            }else{
                res.status(200).send({user: userUpdate});
            }
        }
    });
}

//metodo para subir un avatar para cada usuario
function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        //recibo la ruta de la imagen
        var file_path = req.files.image.path;
        // guardo el nombre del archivo 
        var file_split = file_path.split('\\');
        //ubico el nombre en la segunda posicion
        var file_name = file_split[2];

        // guardo la extension del archivo y la ubico
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdate)=>{
                if (err) {
                    res.status(500).send({message:"Error al actualizar el usuario"});
                }else{
                    if (!userUpdate) {
                        res.status(404).send({message:"No se ha podido actualizar el usuario"});
                    }else{
                        res.status(200).send({image: file_name, user: userUpdate});
                    }
                }
            });
        }else{
            res.status(200).send({message:"Extension del archivo no valida"});
        }
    }else{
        res.status(200).send({message:"No ha subido ninguna imagen"});
    }

}

//metodo para recuperar una imagen de un usuario

function getImageFile(req, res){

    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file, function(exists){
        if (exists) {
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:"No existe la imagen"});
        }
    });
}



module.exports = {
    saveUser,
    loginUser,
    pruebas,
    updateUser,
    uploadImage,
    getImageFile
}