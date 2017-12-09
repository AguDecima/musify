'use strict'

// para trabajar con sistema de ficheros
var path = require('path');
var fs = require('fs');
//modulo de paginasion
var mongoosePaginate = require('mongoose-pagination');

//importo modelos para luego usarlos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//metodo para sacar un album  de la base de datos
function getAlbum(req, res){

    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err,album)=>{
        if(err){
             res.status(500).send({message: 'Error en el servidor'});
        }else{
            if (!album) {
                res.status(404).send({message: 'El album no existe'});               
            }else{
                res.status(200).send({album});                
            }
        }
    });  
}

//metodo para buscar todos los album
function getAlbums(req,res) {
    var artistId = req.params.artist;

    if (!artistId) {
        //sacar todos los albums de la bbdd
        var find = Album.find({}).sort('title');
    }else{
        //sacar los albums de un artista en concret de la base de datos
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err,albums)=>{
        if (err) {
            res.status(500).send({message: 'Error en la petision'});                          
        }else{
            if (!albums) {
                res.status(404).send({message: 'El album no existe'});                             
            }else{
                res.status(200).send({albums});                               
            }
        }
    });
}

//metodo para crear un album
function saveAlbum(req,res) {
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored)=>{
        if (err) {
            res.status(500).send({message: 'Erro en el servidor'});
        }else{
            if (!albumStored) {
                res.status(404).send({message: 'No se ha guardado el album'});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    });
}

//metodo para actualizar un album
function updateAlbum(req,res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId,update,(err,albumUpdate)=>{
        if (err) {
            res.status(500).send({message: 'Erro en el servidor'});
        }else{
            if (!albumUpdate) {
                res.status(404).send({message: 'No se ha actualizado el album'});
            }else{
                res.status(200).send({album: albumUpdate});
            }
        }
    });
}

//metodo para eliminar un album
function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemove)=>{
        if (err) {
            res.status(500).send({message: 'Error al eliminar el album'});
        }else{
            if (!albumRemove) {
                res.status(404).send({message: 'El album no ha sido eliminado'});
            }else{
                //busco mediante el id del album, las canciones que tenia asociadas para eliminarlas          
                Song.find({album: albumRemove._id}).remove((err, songRemove)=>{
                    if (err) {
                        res.status(500).send({message: 'Error al eliminar la cancion'});
                    }else{
                        if (!songRemove) {
                            res.status(404).send({message: 'La cancion no ha sido eliminada'});
                        }else{
                            res.status(200).send({album: albumRemove});
                        }
                    }
                });
            }
        }
    });
}

//metodo para subir imagenes de los album
function uploadImage(req, res){
    var albumId = req.params.id;
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
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdate)=>{
                if (err) {
                    res.status(500).send({message:"Error al subir la imagen del album"});
                }else{
                    if (!albumUpdate) {
                        res.status(404).send({message:"No se ha podido actualizar el usuario "});
                    }else{
                        res.status(200).send({album: albumUpdate});
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

//metodo para recuperar una imagen de un album
function getImageFile(req, res){
    
        var imageFile = req.params.imageFile;
        var path_file = './uploads/albums/'+imageFile;
    
        fs.exists(path_file, function(exists){
            if (exists) {
                res.sendFile(path.resolve(path_file));
            }else{
                res.status(200).send({message:"No existe la imagen"});
            }
        });
    }


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};