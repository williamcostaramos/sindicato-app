import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, NavParams } from 'ionic-angular';
import { AuthService } from '../../auth.service';
import { AssociadoService } from '../../data/associado.service';
import { EmpresaService } from '../../data/empresa.service';

import { EmpresaCadastrarPage } from '../empresa/empresa';
import { AssociadoCadastrarPage } from '../associado/associado';
import { RecuperarSenhaPage } from '../recuperar.senha/recuperar.senha';
import { TabsPage } from '../tabs/tabs';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-login',
  templateUrl: 'tipo.login.html'
})

export class TipoLoginPage {

  constructor(public navCtrl: NavController, private navParams: NavParams){
  }

  private loginEmpresa():void{
    this.navCtrl.push(LoginEmpresaPage);
  }

  private loginAssociado():void{
    this.navCtrl.push(LoginAssociadoPage);
  }
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.associado.html'
})
export class LoginAssociadoPage implements OnInit {
  loading: Loading;
  cpf: string;
  password: string;
  error: string = null;
  keepConnected: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private associadoServ: AssociadoService,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ngOnInit(): void {
    if (this.auth.loggedIn() && !this.auth.expiration()) {
      this.navCtrl.setRoot(TabsPage);
    }
  }

  public criarUsuario() {
    this.navCtrl.push(AssociadoCadastrarPage);
  }

  public recuperarSenha(){
    this.navCtrl.push(RecuperarSenhaPage, {service: this.associadoServ, tipo: 'associado'});
  }

  public login() {
    let loading = this.loadingCtrl.create({ content: 'Carregando...' });
    loading.present();
    this.auth.loginAssociado(this.cpf, this.password, this.keepConnected).subscribe(
      (retorno) => {
        if (retorno) {
          loading.dismiss();
          this.navCtrl.setRoot(TabsPage);
        }
        else {
          this.error = 'Acesso negado';
          loading.dismiss();
        }
      },
      error => {
        loading.dismiss();
        (error) = this.error = error;
      });

  }

  
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.empresa.html'
})
export class LoginEmpresaPage implements OnInit {
  loading: Loading;
  cnpj: string;
  password: string;
  error: string = null;
  keepConnected: boolean = false;
  pages: Array<{title: string, component: any, button: string, openTab?: any}>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private empresaServ: EmpresaService,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
      this.pages = navParams.data.pages;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ngOnInit(): void {
    if (this.auth.loggedIn() && !this.auth.expiration()) {
      this.navCtrl.setRoot(TabsPage);
    }
  }

  public recuperarSenha(){
    this.navCtrl.push(RecuperarSenhaPage, {service: this.empresaServ, tipo: 'empresa'});
  }

  public criarEmpresa() {
    this.navCtrl.push(EmpresaCadastrarPage);
  }

  public login() {
    let loading = this.loadingCtrl.create({ content: 'Carregando...' });
    loading.present();
    this.auth.loginEmpresa(this.cnpj, this.password, this.keepConnected).subscribe(
      (retorno) => {
        if (retorno) {
          loading.dismiss();
          this.navCtrl.setRoot(TabsPage);
        }
        else {
          this.error = 'Acesso negado';
          loading.dismiss();
        }
      },
      error => {
        loading.dismiss();
        (error) = this.error = error;
      });

  }
}
