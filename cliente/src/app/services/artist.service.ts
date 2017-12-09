//servicio para interactuar con la api

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
//libreria para mapear objtos
import 'rxjs/add/operator/map';
//obtiene repuestas ajax
import { Observable } from 'rxjs/Observable';
import { GLOBAL} from './global';
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService{  
    public url: string;

    // de esta manera tenermos disponible la url para los demas metodos
    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    // metodo para recuperar la imagen de todos los artistas
    getArtists(token, page){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers:headers});
        return this._http.get(this.url+'artists/'+page,options)
                .map(res => res.json() );

    }

    // metodo para recuperar un artista segun su id
    getArtist(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers:headers});
        return this._http.get(this.url+'artist/'+id, options)
                .map(res => res.json() );

    }

    // metodo para agregar un artista
    addArtist(token, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.post(this.url+'artist', params, {headers: headers})
                    .map(res => res.json());
    }

    //metodo para editar un artista
    editArtist(token, id:string ,artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.put(this.url+'artist/'+id, params, {headers: headers})
                    .map(res => res.json());
    }

    // metodo para elimiar un artista
    deleteArtist(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers:headers});
        return this._http.delete(this.url+'artist/'+id, options)
                .map(res => res.json() );

    }

}