import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, NavParams } from 'ionic-angular';
import { AuthService } from '../../auth.service';



@Component({
  selector: 'page-recuperarSenha',
  templateUrl: 'recuperar.senha.html'
})
export class RecuperarSenhaPage implements OnInit{
  loading: Loading;
  busca: string;
  service: any;
  tipo: '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {

  }

  ngOnInit(){
    this.service = this.navParams.data.service;
    this.tipo = this.navParams.data.tipo;
  }

  public cancelar(){
    this.navCtrl.pop();
  }

  public recuperar(){
    let loading = this.loadingCtrl.create({content: 'Carregando...'});
    loading.present();

    this.service.recoverPassword(this.busca).subscribe(
        (retorno) => {
          if(retorno.message == 'success'){
            loading.dismiss();
            let alert = this.alertCtrl.create({subTitle: 'Uma nova senha foi enviada para seu email.', buttons: ['Ok']});
            alert.present();
            this.navCtrl.pop();
          }
          else{
            loading.dismiss();
            let alert = this.alertCtrl.create({subTitle: retorno.message, buttons: ['Ok']});
            alert.present();  
          }
        },
        error => {
          loading.dismiss();
          (error) = error;
        });

  }



}
