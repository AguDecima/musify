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

//metodo para sacar un artista de la base de datos
function getArtist(req, res){

    var artistId = req.params.id;

    Artist.findById(artistId,(err,artist)=>{
        if (err) {
            res.status(500).send({message: 'Error en la petision'});
        }else{
            if(!artist){
                res.status(404).send({message: 'No existe el artista'});
            }else{
                res.status(200).send({artist});
            }
        }
    });  
}

//metodo para mostrar muchos artistas, paginacion
function getArtists(req, res){
    //en caso de no venir el parametro page le damos un valor
    if (req.params.page) {
        var page = req.params.page;    
    }else{
        var page = 1;
    }
    
    var itemPerPage = 4;

    Artist.find().sort('name').paginate(page,itemPerPage,function(err, artists, total) {
        if (err) {
            res.status(500).send({message: 'Error en la petision'});
        }else{
            if (!artists) {
                res.status(404).send({message: 'No hay artistas'});
            }else{
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });

}

//metodo para crear un artista
function saveArtist(req,res){
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err,artistStored) =>{
        if (err) {
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if (!artistStored) {
                res.status(400).send({message: 'El artista no ha sido guardado'});
            }else{
                res.status(200).send({artist: artistStored });
            }
        }
    });
}

//metodo para actualizar un artista
function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err,artistUpdated)=>{
        if (err) {
            res.status(500).send({message: 'Error al actualizar el artista'});
        }else{
            if (!artistUpdated) {
                res.status(404).send({message: 'El artista no ha sido actualizado'});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

//metodo para borrar un artista con todos sus albums y canciones
function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err,artistRemoved)=>{
        if (err) {
            res.status(500).send({message: 'Error al eliminar el artista'});
        }else{
            if (!artistRemoved) {
                res.status(500).send({message: 'El artista no ha sido eliminado'});
            }else{
                //busco mediante el id del artista, los album que tenia asociados para eliminarlos
                Album.find({artist: artistRemoved._id}).remove((err, albumRemove)=>{
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
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

//metodo para subir imagenes de los artistas
function uploadImage(req, res){
    var artistId = req.params.id;
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
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdate)=>{
                if (err) {
                    res.status(500).send({message:"Error al subir la imagen del album"});
                }else{
                    if (!artistUpdate) {
                        res.status(404).send({message:"No se ha podido actualizar el usuario "});
                    }else{
                        res.status(200).send({artist: artistUpdate});
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

//metodo para recuperar una imagen de un artista
function getImageFile(req, res){
    
        var imageFile = req.params.imageFile;
        var path_file = './uploads/artists/'+imageFile;
    
        fs.exists(path_file, function(exists){
            if (exists) {
                res.sendFile(path.resolve(path_file));
            }else{
                res.status(200).send({message:"No existe la imagen"});
            }
        });
    }
    



module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}



