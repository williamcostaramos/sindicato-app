import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { EmpresaService } from '../../data/empresa.service';
import { LoginEmpresaPage } from '../../pages/login/login';
import { AuthService } from '../../auth.service';
import { scripts } from '../../data/scripts';

@Component({
    selector: 'page-empresa',
    templateUrl: 'empresa.cadastrar.html'
})

export class EmpresaCadastrarPage implements OnInit
{
    public empresaForm: any;
    public empresa = {
        id: Number,
        cnpj: '',
        razaoSocial: '',
        nomeFantasia: '',
        endereco: '',
        fone: '',
        inscricaoEstadual: '',
        senha:'',
        email: ''
    }
    public errorForm = false;
    public success = false;

    constructor(private navCtrl: NavController,
                private alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                private empresaServ: EmpresaService,
                private formBuilder: FormBuilder,
                private scripts: scripts){

    }

    ngOnInit():void{
        this.empresaForm = this.formBuilder.group({
            senha: ['', Validators.required],
            email: ['', Validators.required]
        });
    }

    public phone_mask(v){
        this.empresa.fone = this.scripts.phone_mask(v);
    }

    public cadastrar():void{
        let { senha } = this.empresaForm.controls;
        if(!this.empresaForm.valid){
            this.errorForm = true;
        }
        else{
            let loading = this.loadingCtrl.create({content: 'Carregando...'});
            loading.present();
            this.empresaServ.primeiroAcesso(this.empresa).subscribe(
                (retorno) => {
                    if(retorno.message == 'success'){
                        let alert = this.alertCtrl.create({subTitle: 'Seu acesso ao nosso app foi liberado com sucesso.', buttons: ['Ok']});
                        alert.present();
                        this.navCtrl.setRoot(LoginEmpresaPage);
                    }
                    else{
                        let alert = this.alertCtrl.create({subTitle: retorno.message, buttons: ['Ok']});
                        alert.present();
                    }
                    loading.dismiss();
                },
                error => {
                    (error) => console.log(error);
                    loading.dismiss();
            });
        }
    }

    public getEmpresa(){
        if(this.empresa.cnpj){
            let loading = this.loadingCtrl.create({content: 'Carregando...'});
            loading.present();
            this.empresaServ.get(this.empresa.cnpj).subscribe(
                (retorno) => {
                    if(retorno.message == 'success'){
                        this.empresa = retorno.empresa;
                        this.success = true;
                    }
                    else{
                        this.success = false;
                        let alert = this.alertCtrl.create({subTitle: retorno.message, buttons: ['Ok']});
                        alert.present();
                        
                    }
                    loading.dismiss();
                },
                error => {
                    loading.dismiss();
                    (error) => console.log(error);
            });
        }
        else{
            this.success = false;
            let alert = this.alertCtrl.create({subTitle: 'Informe o CNPJ da sua empresa.', buttons: ['Ok']});
            alert.present();
        }
    }
}