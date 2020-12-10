import {Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs/Observable';
import { AppModule } from '../app/app.module';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PagseguroService{
  private urlApi = AppModule.getUrl()+'/pagseguro';

  constructor(private http: Http, private auth: AuthService){

  }

  getSessionId(): Observable<any>{
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let options = new RequestOptions({headers: headers});
      return this.http.post(this.urlApi+'/getSessionId.json?token='+this.auth.getToken(), '', options)
                .map(this.extractData)
                .catch(this.handleError);
  }

  pagamento(associado_id: number, creditCardToken: string, senderHash: string, cardHolderName: string, cardHolderCPF: string, email: string): Observable<any>{
      let body = 'associado_id='+associado_id+ 
                '&creditCardToken='+creditCardToken+
                '&senderHash='+senderHash+
                '&cardHolderName='+cardHolderName+
                '&cardHolderCPF='+cardHolderCPF+
                '&email='+email+
                '&empresaId='+this.auth.getCurrentUser().id;
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let options = new RequestOptions({headers: headers});
      return this.http.post(this.urlApi+'/pagamento.json?token='+this.auth.getToken(), body, options)
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
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
