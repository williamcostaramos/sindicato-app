import {Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs/Observable';
import { AppModule } from '../app/app.module';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ConveniosService
{
    private urlApi = AppModule.getUrl()+'/convenios';

    constructor(private http: Http, private auth: AuthService){

    }

    public all(page:number): Observable<any>{
        return this.http.get(this.urlApi+'.json?token='+this.auth.getToken()+'&page='+page)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body;
    }

    private handleError(error: any) {
        let errMsg: string;
        if (error instanceof Response) {
        const body = error.json() || '';
        errMsg = body.message;
        // const err = body.error || JSON.stringify(body);
        // errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
        errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}