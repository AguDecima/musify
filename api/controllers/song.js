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

//metodo para recibir una cancion
function getSong(req,res){
    var songId = req.params.id;

    Song.findById(songId).populate({path:'album'}).exec((err,song)=>{
        if (err) {
            res.status(500).send({message:'Error en la petision'});
        }else{
            if (!song) {
                res.status(404).send({message:'La cancion no existe'});
            }else{
                res.status(200).send({song});
            }
        }
    }); 
}

//metodo para listar las canciones
function getSongs(req,res) {
    var albumId = req.params.album;

    if (!albumId) {
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err,songs)=>{
        if (err) {
            res.status(500).send({message:'Error en la petision'});           
        }else{
            if (!songs) {
                res.status(404).send({message:'No hay canciones'});               
            }else{
                res.status(200).send({songs});               
            }
        }
    });
}

//metodo para crear un artista
function saveSong(req,res){
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err,songStored) =>{
        if (err) {
            res.status(500).send({message: 'Error al guardar la cancion'});
        }else{
            if (!songStored) {
                res.status(400).send({message: 'La cancion no ha sido guardada'});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    });
}

//metodo para actualizar canciones
function updateSong(req,res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId,update,(err,songUpdate)=>{
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if (!songUpdate) {
                res.status(404).send({message: 'Error al guardar la cancion'});
            }else{
                res.status(200).send({song: songUpdate});
            }
        }
    });
}

//metodo para eliminar una cancion
function deleteSong(req,res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId,(err, songRemoved)=>{
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if (!songRemoved) {
                res.status(404).send({message: 'No se ha borrado la cancion'});
            }else{
                res.status(200).send({song: songRemoved});
            }
        }
    });
}

//metodo para subir canciones 
function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        //recibo la ruta de la cancion
        var file_path = req.files.file.path;
        // guardo el nombre del archivo 
        var file_split = file_path.split('\\');
        //ubico el nombre en la segunda posicion
        var file_name = file_split[2];

        // guardo la extension del archivo y la ubico
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdate)=>{
                if (err) {
                    res.status(500).send({message:"Error al subir la cancion"});
                }else{
                    if (!songUpdate) {
                        res.status(404).send({message:"No se ha podido actualizar la cancion "});
                    }else{
                        res.status(200).send({song: songUpdate});
                    }
                }
            });
        }else{
            res.status(200).send({message:"Extension del archivo no valida"});
        }
    }else{
        res.status(200).send({message:"No ha subido ninguna cancion"});
    }
}

//metodo para recuperar una cancion de un album
function getSongFile(req, res){
    
        var songFile = req.params.songFile;
        var path_file = './uploads/songs/'+songFile;
    
        fs.exists(path_file, function(exists){
            if (exists) {
                res.sendFile(path.resolve(path_file));
            }else{
                res.status(200).send({message:"No existe la cancion"});
            }
        });
    }

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};