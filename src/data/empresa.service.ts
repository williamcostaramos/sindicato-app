import {Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs/Observable';
import { AppModule } from '../app/app.module';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class EmpresaService{
  private urlApi = AppModule.getUrl()+'/empresa';

  constructor(private http: Http, private auth: AuthService){

  }

  setTokenFirebase(tokenFirebase: String): Observable<any>{
    let body = 'tokenFirebase='+tokenFirebase;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.urlApi+'/setAuthFirebase/'+this.auth.getCurrentUser().id+'.json?token='+this.auth.getToken(), body, options)
              .map(this.extractData)
              .catch(this.handleError);
  }

  public get(cnpj: string): Observable<any>{
    let body = 'cnpj='+cnpj;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.urlApi+'/getByCnpj.json', body, options)
              .map(this.extractData)
              .catch(this.handleError);
  }

    // public add(associado: any): Observable<any>{
    //     associado.termoAceito ? associado.termoAceito=1:associado.termoAceito=0;
    //     let body = 'matriculaAtual='+associado.matriculaAtual+
    //                 '&numeroSindicalizacao='+associado.numeroSindicalizacao+
    //                 '&nome='+associado.nome+
    //                 '&CPF='+associado.CPF+
    //                 '&senha='+associado.senha+
    //                 '&dataNascimento='+associado.dataNascimento+
    //                 '&sexo='+associado.sexo+
    //                 '&estadoCivil='+associado.estadoCivil+
    //                 '&nomeMae='+associado.nomeMae+
    //                 '&nomePai='+associado.nomePai+
    //                 '&RG='+associado.RG+
    //                 '&RGOrgEmissor='+associado.RGOrgEmissor+
    //                 '&RGExpedicao='+associado.RGExpedicao+
    //                 '&termoAceito='+associado.termoAceito;
    //     //let body = JSON.stringify(associado);
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //     let options = new RequestOptions({headers: headers});

    //     return this.http.post(this.urlApi+'/add.json', body, options)
    //             .map(this.extractData)
    //             .catch(this.handleError);
    // }

  public primeiroAcesso(empresa: any): Observable<any>{
      let body =  'senha='+empresa.senha+
                  '&email='+empresa.email;

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let options = new RequestOptions({headers: headers});

      return this.http.post(this.urlApi+'/primeiroAcesso/'+empresa.id+'.json', body, options)
              .map(this.extractData)
              .catch(this.handleError);
  }

  public getPagamentos(): Observable<any>{
    return this.http.get(this.urlApi+'/getPagamento/'+this.auth.getCurrentUser().id+'.json?token='+this.auth.getToken())
            .map(this.extractData)
            .catch(this.handleError);
  }

  public recoverPassword(cnpj: string): Observable<any>{
    let body = 'cnpj='+cnpj;

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.urlApi+'/recoverPassword.json', body, options)
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
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
