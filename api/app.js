'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// carga de rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// configura cabeceras http
app.use((req,res,next)=>{
    //permitimos el acceso a todos los dominios
    res.header('Acces-Controll-Allow-Origin','*');
    res.header('Acces-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Acces-Control-Allow-Request-Method');
    res.header('Acces-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');    
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');    
    
    next();
});
// rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

module.exports = app;