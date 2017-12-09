//servicio para interactuar con la api

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
//libreria para mapear objtos
import 'rxjs/add/operator/map';
//obtiene repuestas ajax
import { Observable } from 'rxjs/Observable';
import { GLOBAL} from './global';

@Injectable()
export class UserService{  
    public url: string;
    public identity;
    public token;

    // de esta manera tenermos disponible la url para los demas metodos
    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    //metodo para el login
    singup(user_to_login, gethash = null){

        if(gethash != null){
            user_to_login.gethash = gethash;
        }

        let json = JSON.stringify(user_to_login);
        let params = json;

        let headers = new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url+'login', params, {headers: headers})
                    .map(res => res.json());


    }

    //metodo para registrar un usuario
    register(user_to_register){
        let params = JSON.stringify(user_to_register);
        let headers = new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url+'register', params, {headers: headers})
                    .map(res => res.json());
    }

    // metodo para actualizar el usuario
    updateUser(user_to_update){
        let params = JSON.stringify(user_to_update);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': this.getToken()
        });

        return this._http.put(this.url+'update-user/'+user_to_update._id,
         params, {headers: headers})
                    .map(res => res.json());
    }

    //acceder al local storage y procesarlo
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity != "undefined"){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');

        if(token != "undefined"){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }


}