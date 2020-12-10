import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AssociadoService } from '../../data/associado.service';
import { EmpresaService } from '../../data/empresa.service';
import { ConfiguracoesService } from '../../data/configuracoes.service';
import { LoginAssociadoPage } from '../../pages/login/login';
import { HomePage } from '../../pages/home/home';
import { CheckoutPage } from '../../pages/checkout/checkout';
import { TabsPage } from '../../pages/tabs/tabs';
import { AuthService } from '../../auth.service';
import { scripts } from '../../data/scripts';
import { m } from '@angular/core/src/render3';

@Component({
    selector: 'page-associado',
    templateUrl: 'associado.cadastrar.html'
})

export class AssociadoCadastrarPage implements OnInit
{
    public associadoForm:any;
    termos = 'Autorizo a Empresa na qual exerço a minha função, a descontar do meu Salário base mensal o correspondente a R$ 20,00 (vinte reais), a título de contribuição associativa que será repassado ao SINGAREHST - Sindicato dos Garçons e Empregados em Hotéis, Bares, Restaurantes e Similares do Estado de Tocantins, em boleto próprio que será fornecido pelo Sindicato.';
    associado = {
        matriculaAtual: '',
        numeroSindicalizacao: '',
        nome: '',
        CPF: '',
        senha: '',
        dataNascimento: '',
        sexo: '',
        estadoCivil: '',
        nomeMae: '',
        nomePai: '',
        RG: '',
        RGOrgEmissor: '',
        RGExpedicao: '',
        celular: '',
        email: '',
        termoAceito: false,
        freelancer: false,
        empresa_id: null
        };
    public cnpjEmpresa = '';
    public nomeFantasia = '';
    public success = false;    
    public errorForm = false;

    constructor(private navCtrl: NavController, 
                private alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                private associadoServ: AssociadoService,
                private empresaServ: EmpresaService,
                private formBuilder: FormBuilder,
                private scripts: scripts){}

    ngOnInit(){
        this.associadoForm = this.formBuilder.group({
            nome: ['', Validators.required],
            // CPF: ['', Validators.required],
            senha: ['', Validators.required],
            dataNascimento: ['', Validators.required],
            sexo: ['', Validators.required],
            estadoCivil: ['', Validators.required],
            nomeMae: ['', Validators.required],
            nomePai: ['', Validators.required],
            celular: ['', Validators.required],
            email: ['', Validators.required]
        })
    }

    public cadastrar(){
        if(!this.associadoForm.valid){
            this.errorForm = true;
        }
        else{
            let loading = this.loadingCtrl.create({content: 'Carregando...'});
            loading.present();
            this.associadoServ.add(this.associado).subscribe(
                (retorno) => {
                    if(retorno.message == 'success'){
                        let alert = this.alertCtrl.create({subTitle: 'Cadastro realizado com sucesso', buttons: ['Ok']});
                        alert.present();
                        this.navCtrl.setRoot(LoginAssociadoPage);
                    }
                    else{
                        let alert = this.alertCtrl.create({subTitle: retorno.message, buttons: ['Ok']});
                        alert.present();
                    }
                    loading.dismiss();
                },
                error => {
                    let alert = this.alertCtrl.create({subTitle: error, buttons: ['Ok']});
                    alert.present();
                    loading.dismiss();
                    (error) => console.log(error);
            });
        }
    }

    public getAssociado(){
        if(this.associado.CPF){
            let loading = this.loadingCtrl.create({content: 'Carregando...'});
            loading.present();
            this.associadoServ.getByCpf(this.associado.CPF).subscribe(
                (retorno) => {
                    if(retorno.message == 'success'){
                        if(!retorno.associado.senha){
                            this.associado = retorno.associado;
                            this.associado.celular = ''; 
                            this.success = true;
                        }
                        else{
                            let alert = this.alertCtrl.create({subTitle: 'Este CPF já está cadastrado em nosso sistema.', buttons: ['Ok']});
                            alert.present();
                            this.success = false;
                        }
                    }
                    else{
                        this.success = true;
                    }
                    loading.dismiss();
                }, 
                error => {
                    loading.dismiss();
                    (error) => console.log(error);
            });
        }
        else{
            let alert = this.alertCtrl.create({subTitle: 'Informe o seu CPF', buttons: ['Ok']});
            alert.present();
        }
    }

    public getEmpresa(){
        if(this.cnpjEmpresa){
            let loading = this.loadingCtrl.create({content: 'Carregando...'});
            loading.present();
            this.empresaServ.get(this.cnpjEmpresa).subscribe(
                (retorno) => {
                    if(retorno.message == 'success'){
                        this.associado.empresa_id = retorno.empresa.id;
                        this.nomeFantasia = retorno.empresa.nomeFantasia;
                    }
                    else{
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
    }

    public validarCpf(cpf){
        let auxCpf = this.scripts.validarCpf(cpf);
        if(auxCpf == ''){
            let alert = this.alertCtrl.create({subTitle: 'CPF inválido', buttons: ['OK']});
            alert.present();
        }
        else{
            this.associado.CPF = auxCpf;
        }
        
    }

    public cpf_mask(v) {
        this.associado.CPF = this.scripts.cpf_mask(v);
    }

    public phone_mask(v){
        this.associado.celular = this.scripts.phone_mask(v);
    }
}

@Component({
    selector: 'page-associado',
    templateUrl: 'associado.editar.html'
})

export class AssociadoEditarPage implements OnInit
{
    public associadoForm: FormGroup;
    public associado = {
        matriculaAtual: '',
        numeroSindicalizacao: '',
        nome: '',
        CPF: '',
        novaSenha: '',
        dataNascimento: '',
        sexo: '',
        estadoCivil: '',
        nomeMae: '',
        nomePai: '',
        celular: '',
        email: '',
        RG: '',
        RGOrgEmissor: '',
        RGExpedicao: '',
        freelancer: false,
        empresa_id: null
        };
    error: '';
    public cnpjEmpresa = '';
    public nomeFantasia = '';
    errorForm = false;
    editPassword = false;

    constructor(private navCtrl: NavController, 
                private alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                private formBuilder: FormBuilder,
                private associadoServ: AssociadoService,
                private empresaServ: EmpresaService,
                private auth: AuthService,
                private scripts: scripts){

    }

    ngOnInit(){
        this.associado = this.auth.getCurrentUser();  
        let auxNascimento = ((new Date(Date.parse(this.associado.dataNascimento))).toLocaleDateString()).split('/');
        this.associado.dataNascimento = auxNascimento[2]+'-'+auxNascimento[1]+'-'+auxNascimento[0];    
        this.associadoForm = this.formBuilder.group({
            nome: ['', Validators.required],
            CPF: ['', Validators.required],
            dataNascimento: ['', Validators.required],
            sexo: ['', Validators.required],
            estadoCivil: ['', Validators.required],
            nomeMae: ['', Validators.required],
            nomePai: ['', Validators.required],
            celular: ['', Validators.required],
            email: ['', Validators.required]
        })
    }

    public editar(){
        if(!this.associadoForm.valid){
            console.log(this.associadoForm);
            this.errorForm = true;
        }
        else{
            let loading = this.loadingCtrl.create({content: 'Carregando...'});
            loading.present();
            this.associadoServ.edit(this.associado).subscribe(
                (retorno) => {
                    if(retorno.message == 'success'){
                        retorno.associado.dataNascimento = retorno.associado.dataNascimento.date;
                        localStorage.removeItem('user');
                        localStorage.setItem('user', JSON.stringify(retorno.associado));
                        this.associado = retorno.associado;  
                        let alert = this.alertCtrl.create({subTitle: 'Dados atualizados com sucesso', buttons: ['Ok']});
                        alert.present();
                        this.navCtrl.setRoot(HomePage);
                    }
                    else{
                        let alert = this.alertCtrl.create({subTitle: retorno.message, buttons: ['Ok']});
                        alert.present();
                    }
                    loading.dismiss();
                },
                error => {
                    let alert = this.alertCtrl.create({subTitle: error, buttons: ['Ok']});
                    alert.present();
                    loading.dismiss();
                    (error) => this.error = error;
            });
        }
    }

    public getEmpresa(){
        if(this.cnpjEmpresa){
            let loading = this.loadingCtrl.create({content: 'Carregando...'});
            loading.present();
            this.empresaServ.get(this.cnpjEmpresa).subscribe(
                (retorno) => {
                    if(retorno.message == 'success'){
                        this.associado.empresa_id = retorno.empresa.id;
                        this.nomeFantasia = retorno.empresa.nomeFantasia;
                    }
                    else{
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
    }

    public showPassword(){
        (!this.editPassword) ? this.editPassword = true : this.editPassword = false;
    }

    public validarCpf(cpf){
        let auxCpf = this.scripts.validarCpf(cpf);
        if(auxCpf == ''){
            let alert = this.alertCtrl.create({subTitle: 'CPF inválido', buttons: ['OK']});
            alert.present();
        }
        else{
            this.associado.CPF = auxCpf;
        }
        
    }

    private cpf_mask(v) {
        this.associado.CPF = this.scripts.cpf_mask(v);
    }
}

@Component({
    selector: 'page-associado',
    templateUrl: 'freelancers.html'
})

export class FreelancersPage implements OnInit
{
    public associados: any[];
    public page = 1;
    public cobranca: boolean = true;
    public valorTaxa: string;
    public pagamentos: any[];

    constructor(private navCtrl: NavController,
                private loadingCtrl: LoadingController,
                private associadoServ: AssociadoService,
                private scripts: scripts,
                private empresaServ: EmpresaService,
                private configuracoesServ: ConfiguracoesService) {
        //this.pagamento = this.authServ.getCurrentUser().pagmento;
    }

    ngOnInit(){
        this.fetchConfig();
    }

    private fetchConfig(): void{
        let loading = this.loadingCtrl.create({content: 'Carregando...'});
        loading.present();
        this.configuracoesServ.get().subscribe(
            (retorno) => {
                console.log(retorno);
                if(retorno.habilitarCobranca){
                    this.valorTaxa = this.scripts.floatToBr(retorno.valorTaxa);
                    this.getPagamentos();
                }
                else{
                    this.cobranca = false;
                }
                this.fetchContent(loading);
            }, 
            error => {
                (error) => console.log(error);
            });
    }

    private getPagamentos(): void{
        this.empresaServ.getPagamentos().subscribe(
            (retorno) => {
                if(retorno.pagamentos.length > 0){
                    this.pagamentos = retorno.pagamentos;
                }
                else{
                    this.pagamentos = [];
                }
            },
            error => {
                (error) => console.log(error);
            }
        )
    }

    private pago(id: number): boolean{
        for(let i = 0; i < this.pagamentos.length; i++){
            if(this.pagamentos[i].associado_id == id){
                return true;
            }
        }
        return false;
    }

    private fetchContent(loading:any): void {
        this.page = 1;
        this.associados = [];
        loading.present();
        this.associadoServ.all(this.page).subscribe(
            (retorno) => {
                if (retorno.associados.length > 0) {
                    this.associados = retorno.associados;
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

    private checkout(associado: any):void{
        this.navCtrl.push(CheckoutPage, associado);
    }

    private doInfinite(infiniteScroll): void {
        this.page++;
        this.associadoServ.all(this.page).subscribe(
            (retorno) => {
                if (retorno.associados.length > 0) {
                    this.associados = this.associados.concat(retorno.associados);
                }
                infiniteScroll.complete();
            },
            error => {
                infiniteScroll.complete();
                (error) => console.log(error);
            });
    }
}

@Component({
    templateUrl: 'desconto.html'
})
export class DescontoPage
{
    public termoAceito: boolean;

    constructor(private navCtrl: NavController, 
                private loadingCtrl: LoadingController, 
                private alertCtrl: AlertController, 
                private associadoServ: AssociadoService, 
                private auth: AuthService){
        this.termoAceito = auth.getCurrentUser().termoAceito;
    }

    private aceitarTermo():void {
        let loading = this.loadingCtrl.create({content: 'Carregando...'});
        loading.present();
        this.associadoServ.aceitarTermo().subscribe(
            (retorno) => {
                if(retorno.message == 'success'){
                    let user = this.auth.getCurrentUser();
                    user.termoAceito = true;
                    localStorage.removeItem('user');
                    localStorage.setItem('user', JSON.stringify(user));
                    let alert = this.alertCtrl.create({subTitle: 'Termos aceitos.', buttons: ['Ok']});
                    alert.present();
                    this.navCtrl.setRoot(TabsPage, {page: {title: 'Home', component: HomePage, button: 'home'}});
                }
                else{
                    let alert = this.alertCtrl.create({subTitle: 'Falha ao aceitar os termos do desconto. Entre em contato com o sindicato.'});
                    alert.present();
                }
                loading.dismiss();
            },
            error => {
                loading.dismiss();
                (error) => console.log(error);
            });
    }
}