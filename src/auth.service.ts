import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppModule } from './app/app.module';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
  public token: string;
  public cpf: string;
  public password: string;

  constructor(private http: Http) {

  }

  getToken() {
    if (!this.loggedIn()) {
      return null;
    } else {
      let token = JSON.parse(localStorage.getItem('token'));
      return token;
    }
  }

  loggedIn() {
    if (localStorage.getItem('user')) {
      return true;
    } else {
      return false;
    }
  }

  expiration() {
    let expiration_date = Date.parse(this.getCurrentUser().dataExpiracao.date);
    if (isNaN(expiration_date))
      expiration_date = Date.parse(this.getCurrentUser().dataExpiracao);
    let date_now = Date.now();
    if (expiration_date < date_now) {
      return true;
    }
    else {
      return false;
    }
  }

  getCurrentUser() {
    if (!this.loggedIn())
      return null;
    let user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  getSenha() {
    if (!this.loggedIn()) {
      return null;
    } else {
      let senha = JSON.parse(localStorage.getItem('senha'));
      return senha;
    }
  }

  loginAssociado(cpf: string, password: string, keepConnected: boolean): Observable<boolean> {
    let body = 'cpf=' + cpf + '&senha=' + password + '&keepConnected='+ keepConnected +'&client_id=app_singarehst&client_secret=1234';
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });

    return this.http.post(AppModule.getUrl() + '/associado/oauthFull.json', body, options)
      .map(function (response: Response) {
        let r = response.json();
        if (r.token.authorization != '') {
          r.associado.senha = password;
          localStorage.setItem('user', JSON.stringify(r.associado));
          localStorage.setItem('senha', password)
          localStorage.setItem('token', JSON.stringify(r.token.authorization));
          return true;
        }
        else {
          return false;
        }
      })
      .catch(this.handleError);
  }

  loginEmpresa(cpf: string, password: string, keepConnected: boolean): Observable<boolean> {
    let body = 'cnpj=' + cpf + '&senha=' + password + '&keepConnected='+ keepConnected +'&client_id=app_singarehst&client_secret=1234';
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });

    return this.http.post(AppModule.getUrl() + '/empresa/oauthFull.json', body, options)
      .map(function (response: Response) {
        let r = response.json();
        if (r.token.authorization != '') {
          r.empresa.senha = password;
          localStorage.setItem('user', JSON.stringify(r.empresa));
          localStorage.setItem('senha', password)
          localStorage.setItem('token', JSON.stringify(r.token.authorization));
          return true;
        }
        else {
          return false;
        }
      })
      .catch(this.handleError);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
