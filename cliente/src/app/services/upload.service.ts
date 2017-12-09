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
export class UploadService{  
    public url: string;

    // de esta manera tenermos disponible la url para los demas metodos
    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    // metodo para una petision a al api
    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token:string,
                     name:string){

        return new Promise(function(resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i = 0 ; i< files.length ; i++){
                formData.append(name, files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }                    
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);

        });
    }
}

