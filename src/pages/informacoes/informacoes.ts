import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, InfiniteScroll } from 'ionic-angular';

import { InformacoesService } from '../../data/informacoes.service';
import { AppModule } from '../../app/app.module';

@Component({
    selector: 'page-informacoes',
    templateUrl: 'informacoes.html'
})

export class InformacoesPage 
{
    public page: number = 1;
    public informacoes: any[];

    constructor(private navCtr: NavController,
                private loadingCtrl: LoadingController,
                private informacoesServ: InformacoesService) {
        this.fetchContent();
    }

    private fetchContent(): void {
        this.page = 1;
        this.informacoes = [];
        let loading = this.loadingCtrl.create({ content: 'Carregando...' });
        loading.present();
        this.informacoesServ.all(this.page).subscribe(
            (retorno) => {
                if (retorno.informacoes.length > 0) {
                    this.informacoes = retorno.informacoes;
                    this.informacoes.forEach((info, i) => {
                        if(info.anexo){
                            info.urlAnexo = AppModule.getUrlSingarehst()+'/informacao/download/'+info.id;
                        }
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
        this.informacoesServ.all(this.page).subscribe(
            (retorno) => {
                if (retorno.informacoes.length > 0) {
                    let aux = retorno.informacoes;
                    aux.forEach((info, i) => {
                        if(info.anexo){
                            info.urlAnexo = AppModule.getUrlSingarehst()+'/informacao/download/'+info.id;
                        }
                    });
                    this.informacoes = this.informacoes.concat(aux);
                }
                infiniteScroll.complete();
            },
            error => {
                infiniteScroll.complete();
                (error) => console.log(error);
            });
    }

    private donwload(): void{
        
    }
}