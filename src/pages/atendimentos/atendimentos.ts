import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, InfiniteScroll } from 'ionic-angular';

import { AtendimentosService } from '../../data/atendimentos.service';

@Component({
    selector: 'page-atendimentos',
    templateUrl: 'atendimentos.html'
})

export class AtendimentosPage
{
    public page: number = 1;
    public atendimentos : any[];

    constructor(private navCtr: NavController,
                private loadingCtrl: LoadingController,
                private atendimentosServ: AtendimentosService){

    }

    ionViewWillEnter() {
        this.fetchContent();
    }

    private fetchContent():void{
        this.page = 1;
        let loading = this.loadingCtrl.create({content:'Carregando...'});
        loading.present();
        this.atendimentos = [];
        this.atendimentosServ.all(this.page).subscribe(
            (retorno) => {
                if(retorno.atendimentos.length > 0){
                    this.atendimentos = retorno.atendimentos;
                }
                loading.dismiss();
            },
            error => {
                loading.dismiss();
                (error) => console.log(error);
            });
    }

    private doInfinite(infiniteScroll):void{
        this.page++;
        this.atendimentosServ.all(this.page).subscribe(
            (retorno) => {
                if(retorno.atendimentos.length > 0){
                    this.atendimentos = this.atendimentos.concat(retorno.atendimentos);
                }
                infiniteScroll.complete();
            },
            error => {
                infiniteScroll.complete();
                (error) => console.log(error);
            })
    }

    private abrirAtendimento():void{
        this.navCtr.push(AtendimentoAbrirPage);
    }
}

@Component({
    selector: 'page-atendimentos',
    templateUrl: 'atendimento.abrir.html'
})

export class AtendimentoAbrirPage
{

    public atendimento = {
        assunto: '',
        descricaoAtendimento: '',
        tipoAtendimento_id: 0
    }

    public tiposAtendimento = <any>[];

    constructor(private navCtrl: NavController,
                private alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                private atendimentosServ: AtendimentosService){

    }

    ngOnInit():void{
        let loading = this.loadingCtrl.create({content: 'Carregando...'});
        loading.present();
        this.atendimentosServ.getTipos().subscribe(
            (retorno) => {
                if(retorno.tiposAtendimento.length > 0){
                    this.tiposAtendimento = retorno.tiposAtendimento;
                    loading.dismiss();
                }
            },
            error => {
                (error) => console.log(error);
            });
    }

    public abrirAtendimento():void{
        if(this.atendimento.tipoAtendimento_id != 0){
            this.atendimentosServ.add(this.atendimento).subscribe(
                (retorno) => {
                    if(retorno.message == 'success'){
                        let alert = this.alertCtrl.create({subTitle: 'Atendimento aberto com sucesso', buttons: ['Ok']});
                        alert.present();
                        this.navCtrl.pop({});
                    }
                    else{
                        let alert = this.alertCtrl.create({subTitle: 'Falha ao abrir o atendimento. Contate o Singarehst', buttons: ['Ok']});
                        alert.present();
                    }
                },
                error => {
                    (error) => console.log(error);
                });
        }
        else{
            let alert = this.alertCtrl.create({subTitle: 'Selecione um tipo de atendimento.', buttons: ['Ok']});
            alert.present();
        }
    }
}