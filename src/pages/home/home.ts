import { Component } from '@angular/core';
import { NavController, LoadingController, InfiniteScroll } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { PublicidadesService } from '../../data/publicidades.service';
import { AppModule } from '../../app/app.module';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public page: number = 1;
  public publicidades: any[];

  constructor(private navCtrl: NavController, 
              private loadingCtrl: LoadingController, 
              private sanitizer: DomSanitizer,
              private publicidadesServ: PublicidadesService) {
    this.fetchContent();
  }

  private fetchContent(): void{
    this.page = 1;
    this.publicidades = [];
    let loading = this.loadingCtrl.create({content: 'Carregando...'});
    loading.present();
    this.publicidadesServ.all(this.page).subscribe(
      (retorno) => {
        if(retorno.publicidades.length > 0){
          this.publicidades = retorno.publicidades;
          this.publicidades.forEach((p, i) =>{
            if(!p.codigo_video)
              p.url = AppModule.getUrlSingarehst()+'/img/'+p.url;
            else{
              p.url = this.sanitizer.bypassSecurityTrustResourceUrl(p.url);
              console.log(p.url);
            }
          });
          loading.dismiss();
        }
        else{
          loading.dismiss();
        }
      },
      error => {
        loading.dismiss();
        (error) => console.log(error);
      });

  }

  private doInfinite(infiniteScroll):void{
    this.page++;
    this.publicidadesServ.all(this.page).subscribe(
      (retorno) => {
        if(retorno.publicidades.length > 0){
          let pub = retorno.publicidades;
          pub.forEach((p, i) => {
            if(!p.codigo_video)
              p.url = AppModule.getUrlSingarehst()+'/img/'+p.url;
            else{
              p.url = this.sanitizer.bypassSecurityTrustResourceUrl(p.url);
              console.log(p.url);
            }
          });
          this.publicidades = this.publicidades.concat(pub);
        }
        infiniteScroll.complete();
      },
      error =>{
        infiniteScroll.complete();
        (error) => console.log(error);
      });
  }

}
