import {Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs/Observable';
import { AppModule } from '../app/app.module';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AssociadoService{
  private urlApi = AppModule.getUrl()+'/associado';

  constructor(private http: Http, private auth: AuthService){

  }

  setTokenFirebase(tokenFirebase: String): Observable<any>{
    let body = 'tokenFirebase='+tokenFirebase;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.urlApi+'/setAuthFirebase/'+this.auth.getCurrentUser().Id+'.json?token='+this.auth.getToken(), body, options)
              .map(this.extractData)
              .catch(this.handleError);
  }

  public all(page:number): Observable<any>{
    return this.http.get(this.urlApi+'/freelancers.json?token='+this.auth.getToken()+'&page='+page)
                .map(this.extractData)
                .catch(this.handleError);
  }

  public get(id: Number): Observable<any>{
    return this.http.get(this.urlApi+'/'+id+'.json?token='+this.auth.getToken())
              .map(this.extractData)
              .catch(this.handleError);
  }

  public add(associado: any): Observable<any>{
    associado.termoAceito ? associado.termoAceito=1:associado.termoAceito=0;
    let body =  'nome='+associado.nome+
                '&CPF='+associado.CPF+
                '&senha='+associado.senha+
                '&dataNascimento='+associado.dataNascimento+
                '&sexo='+associado.sexo+
                '&estadoCivil='+associado.estadoCivil+
                '&nomeMae='+associado.nomeMae+
                '&nomePai='+associado.nomePai+
                '&celular='+associado.celular+ 
                '&email='+associado.email+
                '&termoAceito='+associado.termoAceito+
                '&freelancer='+associado.freelancer+
                '&empresa_id='+associado.empresa_id;

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.urlApi+'/add.json', body, options)
              .map(this.extractData)
              .catch(this.handleError);
  }

  public edit(associado: any): Observable<any>{
    let body =  'nome='+associado.nome+
                '&CPF='+associado.CPF+
                '&dataNascimento='+associado.dataNascimento+
                '&sexo='+associado.sexo+
                '&estadoCivil='+associado.estadoCivil+
                '&nomeMae='+associado.nomeMae+
                '&nomePai='+associado.nomePai+
                '&celular='+associado.celular+
                '&email='+associado.email+
                '&freelancer='+associado.freelancer+
                '&empresa_id='+associado.empresa_id;
    if(associado.novaSenha != undefined)
      body += '&senha='+associado.novaSenha;

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.urlApi+'/edit/'+this.auth.getCurrentUser().id+'.json?token='+this.auth.getToken(), body, options)
              .map(this.extractData)
              .catch(this.handleError);
  }

  public getByCpf(cpf: string): Observable<any>{
    let body = 'CPF='+cpf;

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.urlApi+'/getByCpf.json', body, options)
              .map(this.extractData)
              .catch(this.extractData);
  }

  public recoverPassword(cpf: string): Observable<any>{
    let body = 'CPF='+cpf;

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.urlApi+'/recoverPassword.json', body, options)
              .map(this.extractData)
              .catch(this.extractData);
  }

  public aceitarTermo(): Observable<any>{
    return this.http.get(this.urlApi+'/aceitarTermo/'+this.auth.getCurrentUser().id+'.json?token='+this.auth.getToken())
              .map(this.extractData)
              .catch(this.extractData);
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
