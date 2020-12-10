import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

import { AuthService } from '../../auth.service';
import { TipoLoginPage } from '../login/login';
import { AtendimentosPage } from '../atendimentos/atendimentos';
import { InformacoesPage } from '../informacoes/informacoes';
import { AssociadoEditarPage } from '../associado/associado';
import { FreelancersPage } from '../associado/associado';
import { ConveniosPage } from '../convenios/convenios';
import { ClubePage } from '../clube/clube';
import { DescontoPage } from '../associado/associado';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {

  tab1Root: {title: string, component: any, icon: string};
  tab2Root: {title: string, component: any, icon: string};
  tab3Root: {title: string, component: any, icon: string};
  tab4Root: {title: string, component: any, icon: string};
  tab5Root: {title: string, component: any, icon: string};

  mySelectedIndex: number;
  public user: any;

  constructor(private navCtrl: NavController, 
              private navParams: NavParams, 
              private auth: AuthService, 
              private menu: MenuController) {
  }
  
  ngOnInit():void {
    this.user = this.auth.getCurrentUser();
    if(this.navParams.data.page != undefined){
      let page = this.navParams.data.page;
      this.tab1Root = {title: page.title, component: page.component, icon: page.button};
    }
    else{
      this.tab1Root = {title: 'Home', component: HomePage, icon: 'home'};
    }
    if(this.user.role == 'associado'){
      this.menu.enable(true, 'associado');
      this.menu.enable(false, 'empresa');
      this.tab2Root = {title: 'Atendimentos', component: AtendimentosPage, icon: 'md-filing'};
      this.tab3Root = {title: 'Info', component: InformacoesPage, icon: 'md-information-circle'};
      this.tab4Root = {title: 'Perfil', component: AssociadoEditarPage, icon: 'md-person'};
    }
    else{
      if(this.user.role == 'empresa'){
        this.menu.enable(true, 'empresa');
        this.menu.enable(false, 'associado');
        this.tab2Root = {title: 'Freelancers', component: FreelancersPage, icon: 'md-people'};
        this.tab3Root = {title: 'Info', component: InformacoesPage, icon: 'md-information-circle'};
      }
    }
  }

  public openMenu():void{
    this.menu.open();
  }
}
