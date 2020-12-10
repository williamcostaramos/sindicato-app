import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, InfiniteScroll, Tabs, NavParams } from 'ionic-angular';

import { ConveniosService } from '../../data/convenios.service';
import { AppModule } from '../../app/app.module';

@Component({
    selector: 'page-convenios',
    templateUrl: 'convenios.html'
})

export class ConveniosPage 
{
    public page: number = 1;
    public convenios: any[];

    constructor(private navCtr: NavController,
                private navParams: NavParams,
                private loadingCtrl: LoadingController,
                private conveniosServ: ConveniosService) {
        this.fetchContent();
    }

    private fetchContent(): void {
        this.page = 1;
        this.convenios = [];
        let loading = this.loadingCtrl.create({ content: 'Carregando...' });
        loading.present();
        this.conveniosServ.all(this.page).subscribe(
            (retorno) => {
                if (retorno.convenios.length > 0) {
                    this.convenios = retorno.convenios;
                    this.convenios.forEach((c, i) => {
                        c.urlImg = AppModule.getUrlSingarehst()+'/img/'+c.urlImg;
                    });
                    loading.dismiss();
                }
                else {
                    loading.dismiss();
                }
            },
            error => {
                loading.dismiss();
                (error) => console.log(error);
            });

    }

    private doInfinite(infiniteScroll): void {
        this.page++;
        this.conveniosServ.all(this.page).subscribe(
            (retorno) => {
                if (retorno.convenios.length > 0) {
                    let aux = retorno.convenios;
                    aux.forEach((c, i) => {
                        c.urlImg = AppModule.getUrlSingarehst()+'/img/'+c.urlImg;
                    });
                    this.convenios = this.convenios.concat(aux);
                }
                infiniteScroll.complete();
            },
            error => {
                infiniteScroll.complete();
                (error) => console.log(error);
            });
    }
}