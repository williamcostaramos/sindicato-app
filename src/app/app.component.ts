import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AppModule } from '../app/app.module';
import { HomePage } from '../pages/home/home';
import { ConveniosPage } from '../pages/convenios/convenios';
import { ClubePage } from '../pages/clube/clube';
import { DescontoPage } from '../pages/associado/associado';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../auth.service';

import { TipoLoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = TipoLoginPage;
  public pagesAssociado: Array<{title: string, component: any, button: string}>;
  public pagesEmpresa: Array<{title: string, component: any, button: string}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public loadingCtrl: LoadingController,
              public auth: AuthService) {
    this.initializeApp();
    
    this.pagesAssociado= [
      {title: 'Home', component: HomePage, button: 'home'},
      {title: 'Convênios', component: ConveniosPage, button: 'grid'},
      {title: 'Clube', component: ClubePage, button: 'boat'},
      {title: 'Desconto Sindical', component: DescontoPage, button: 'paper'}
    ];
    this.pagesEmpresa= [
      {title: 'Home', component: HomePage, button: 'home'},
      {title: 'Convênios', component: ConveniosPage, button: 'grid'},
      {title: 'Clube', component: ClubePage, button: 'boat'}
    ];
  }

  private initializeApp(){
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      let loading = this.loadingCtrl.create({content: 'Carregando...'});
      loading.present();
      if (!this.auth.loggedIn()) {
        loading.dismiss()
        return this.nav.setRoot(TipoLoginPage);
      }
      if(this.auth.expiration()){
        let user = this.auth.getCurrentUser();
        if(!user.manterConectado){
          loading.dismiss()
          return this.nav.setRoot(TipoLoginPage);
        }
        else{
          if(user.role == 'associado'){
            this.auth.loginAssociado(user.CPF, user.senha, true).subscribe(
              (retorno) => {
                if (retorno) {
                  loading.dismiss()
                  return this.nav.setRoot(TabsPage);
                }
                else {
                  loading.dismiss()
                  return this.nav.setRoot(TipoLoginPage);
                }
              },
              error => {
                (error) = console.log(error);
              });
            
          }
          if(user.role == 'empresa'){
            this.auth.loginEmpresa(user.cnpj, user.senha, true).subscribe(
              (retorno) => {
                if (retorno) {
                  loading.dismiss()
                  return this.nav.setRoot(TabsPage);
                }
                else {
                  loading.dismiss()
                  return this.nav.setRoot(TipoLoginPage);
                }
              },
              error => {
                (error) = console.log(error);
              });
          }
        }
      }
      else{
        loading.dismiss();
        return this.nav.setRoot(TabsPage);
      }
    });
  }

  public openPage(page) {
    this.nav.setRoot(TabsPage, {page: page});
  }

  public logout(){
    this.auth.logout();
    this.nav.setRoot(TipoLoginPage);
  }
}
