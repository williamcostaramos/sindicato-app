import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, MenuController } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonMaskModule } from '@pluritech/ion-mask';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { MyApp } from './app.component';

import { AuthService } from '../auth.service';
import { EmpresaService } from '../data/empresa.service';
import { AssociadoService } from '../data/associado.service';
import { AtendimentosService } from '../data/atendimentos.service';
import { PublicidadesService } from '../data/publicidades.service';
import { InformacoesService } from '../data/informacoes.service';
import { ConveniosService } from '../data/convenios.service';
import { ClubeService } from '../data/clube.service';
import { PagseguroService } from '../data/pagseguro.service';
import { ConfiguracoesService } from '../data/configuracoes.service';
import { scripts } from '../data/scripts';

import { TipoLoginPage } from '../pages/login/login';
import { LoginEmpresaPage } from '../pages/login/login';
import { LoginAssociadoPage } from '../pages/login/login';
import { RecuperarSenhaPage } from '../pages/recuperar.senha/recuperar.senha';
import { EmpresaCadastrarPage } from '../pages/empresa/empresa';
import { AssociadoCadastrarPage } from '../pages/associado/associado';
import { AssociadoEditarPage } from '../pages/associado/associado';
import { FreelancersPage } from '../pages/associado/associado';
import { DescontoPage } from '../pages/associado/associado';
import { AtendimentosPage } from '../pages/atendimentos/atendimentos';
import { AtendimentoAbrirPage}  from '../pages/atendimentos/atendimentos';
import { InformacoesPage } from '../pages/informacoes/informacoes';
import { ConveniosPage } from '../pages/convenios/convenios';
import { ClubePage } from '../pages/clube/clube';
import { GaleriaPage } from '../pages/clube/clube';
import { CarteirinhaPage } from '../pages/clube/clube';
import { SolicitarCarteirinhaPage } from '../pages/clube/clube';
import { HomePage } from '../pages/home/home';
import { CheckoutPage } from '../pages/checkout/checkout';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    TipoLoginPage,
    LoginEmpresaPage,
    LoginAssociadoPage,
    RecuperarSenhaPage,
    EmpresaCadastrarPage,
    AssociadoCadastrarPage,
    AssociadoEditarPage,
    FreelancersPage,
    DescontoPage,
    AtendimentosPage,
    AtendimentoAbrirPage,
    InformacoesPage,
    ConveniosPage,
    ClubePage,
    GaleriaPage,
    SolicitarCarteirinhaPage,
    CarteirinhaPage,
    HomePage,
    CheckoutPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      monthNames: ['janeiro', 'fevereiro', 'mar\u00e7o', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
      tabsPlacement: 'bottom'
    }),
    HttpModule,
    IonMaskModule,
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TipoLoginPage,
    LoginEmpresaPage,
    LoginAssociadoPage,
    RecuperarSenhaPage,
    EmpresaCadastrarPage,
    AssociadoCadastrarPage,
    AssociadoEditarPage,
    FreelancersPage,
    DescontoPage,
    AtendimentosPage,
    AtendimentoAbrirPage, 
    InformacoesPage,
    ConveniosPage,
    ClubePage,
    GaleriaPage,
    CarteirinhaPage,
    SolicitarCarteirinhaPage,
    HomePage,
    CheckoutPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MenuController,
    Camera,
    File,
    FileTransfer,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    EmpresaService,
    AssociadoService,
    AtendimentosService,
    PublicidadesService,
    InformacoesService,
    ConveniosService,
    ClubeService,
    PagseguroService,
    ConfiguracoesService,
    scripts
  ]
})
export class AppModule {
  // private static urlSingarehst = 'http://localhost/singarehst';
  // private static urlApi:String = 'http://localhost/api_singarehst';
  private static urlSingarehst = 'http://18.228.132.19/singarehst';
  private static urlApi:String = 'http://18.228.132.19/api_singarehst';
  public static pages: Array<{title: string, component: any, button: string}>;
  
  public static getUrl(): String{
    return this.urlApi;
  } 

  public static getUrlSingarehst(): String{
    return this.urlSingarehst;
  }

  public static setPages(pages: Array<{title: string, component: any, button: string}>):void{
    this.pages = pages;
  }
}
