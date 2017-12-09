'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

//linea para quitar el aviso de mongoose promise
mongoose.Promise = global.Promise;
//conecto a la base de datos
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err,res)=> {
    if(err){
        throw err;
    }else{
        console.log("Database Conected");
        app.listen(port, function(){
            console.log("Server of the api music listen in http://localhost:"+port);
        });
    }
});