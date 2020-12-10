import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, Segment, AlertController, LoadingController, NavParams} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HomePage } from '../home/home';
import { PagseguroService } from '../../data/pagseguro.service';
import { scripts } from '../../data/scripts';
import 'rxjs/add/operator/toPromise';

declare var PagSeguroDirectPayment;

@Component({
  selector: 'page-associado',
  templateUrl: 'checkout.html'
})

export class CheckoutPage implements OnInit {
  @ViewChild(Segment)
  segment:Segment;
  public pagamentoForm:any;
  paymentMethods: any;
  brands: any[];
  paymentMethod = 'CREDIT_CARD';
  creditCard = {
    nomeTitular: '',
    cpfTitular: '',
    num: '',
    cvv: '',
    dateExp: '',
    email: '',
    brand: '',
    token: ''
  };
  associado: any;
  regexValidators = {
    numCard: /(\d)| /g,
    cvv: /(\d+)| /g
  }
  maxYear = Number(new Date().getFullYear())+15;
  errorForm: boolean = false;

  constructor(private navCtrl:NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private ref:ChangeDetectorRef,
              private alertCtrl: AlertController,
              private formBuilder: FormBuilder,
              private pagSeguroService: PagseguroService,
              private scripts: scripts) 
  {
    this.associado = navParams.data;
  }

  ngOnInit():any {
    this.pagamentoForm = this.formBuilder.group({
      num: ['', Validators.compose([Validators.pattern(this.regexValidators.numCard), Validators.required])],
      nomeTitular: ['', Validators.compose([Validators.required])],
      cpfTitular: ['', Validators.compose([Validators.required])],
      cvv: ['', Validators.compose([Validators.pattern(this.regexValidators.cvv), Validators.required])],
      dateExp: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])]
    });
    this.getSessionId();
  }

  private getSessionId():void{
    let loading = this.loadingCtrl.create({content: 'Carregando...'});
    loading.present();
    this.pagSeguroService.getSessionId().subscribe(
      (retorno) => {
        if(retorno){
          PagSeguroDirectPayment.setSessionId(retorno.resposta.id);
          this.getPaymentMethods(loading);
        }
      },
      error => {
        (error) => console.log(error);
        loading.dismiss();
      });
  }

  private getPaymentMethods(loading: any):void{
    PagSeguroDirectPayment.getPaymentMethods({
      //amount: this.cart.total,
      success: response => {
        let paymentMethods = response.paymentMethods;
        this.paymentMethods = Object.keys(paymentMethods).map((k) => paymentMethods[k]);
        this.brands = paymentMethods.CREDIT_CARD.options;
        this.brands = Object.keys(this.brands).map((j) => this.brands[j]);
        this.ref.detectChanges();
        loading.dismiss();
        //this.segment.ngAfterViewInit();
      }
    });
  }

  getCreditCardBrand(){
    console.log(this.creditCard.num.substring(0,6));
    PagSeguroDirectPayment.getBrand({
      cardBin: this.creditCard.num.substring(0,6),
      success: response => {
        this.creditCard.brand = response.brand.name
        this.ref.detectChanges();
        this.getCreditCardToken();
      },
      error: response => {console.log(response);}
    });
  }

  getCreditCardToken(){
    PagSeguroDirectPayment.createCardToken({
      cardNumber: this.creditCard.num,
      brand: this.creditCard.brand,
      cvv: this.creditCard.cvv,
      expirationMonth: this.creditCard.dateExp.split('-')[1],
      expirationYear: this.creditCard.dateExp.split('-')[0],
      success: response => {
        this.creditCard.token = response.card.token
        this.ref.detectChanges();
        this.sendPayment();
      }
    });
  }

  sendPayment(){
    if(!this.pagamentoForm.valid){
      this.errorForm = true;
    }
    else{
      var loading = this.loadingCtrl.create({content: 'Carregando...'});
      loading.present();
      console.log(this.creditCard.dateExp.split('-')[1]);
      PagSeguroDirectPayment.createCardToken({
        cardNumber: this.creditCard.num,
        brand: this.creditCard.brand,
        cvv: this.creditCard.cvv,
        expirationMonth: this.creditCard.dateExp.split('-')[1],
        expirationYear: this.creditCard.dateExp.split('-')[0],
        success: response => {
          this.creditCard.token = response.card.token
          this.ref.detectChanges();
          this.pagSeguroService.pagamento(this.associado.id,
                                          this.creditCard.token, 
                                          PagSeguroDirectPayment.getSenderHash(),
                                          this.creditCard.nomeTitular,
                                          this.creditCard.cpfTitular,
                                          this.creditCard.email).subscribe(
            (retorno) => {
              if(retorno.message == 'success' && retorno.resposta.status){
                loading.dismiss();
                let alertCtrl = this.alertCtrl.create({subTitle: 'Estamos processando seu pagamento.', buttons: ['OK']});
                alertCtrl.present();
                this.navCtrl.pop();
                }
              else{
                loading.dismiss();
                let alertCtrl = this.alertCtrl.create({subTitle: 'Falha no pagamento. Verifique os dados de pagamento.', buttons: ['OK']});
                alertCtrl.present();
              }
            }, 
            error => {
              loading.dismiss();
              (error) => console.log(error);
          });
        }
      });
      
      console.log(this.creditCard.token);
      console.log(PagSeguroDirectPayment.getSenderHash());
    }
  }

  public validarCpf(cpf){
    let auxCpf = this.scripts.validarCpf(cpf);
    if(auxCpf == ''){
        let alert = this.alertCtrl.create({subTitle: 'CPF inválido', buttons: ['OK']});
        alert.present();
    }
    else{
        this.creditCard.cpfTitular = auxCpf;
    }  
  }

  private cpf_mask(v) {
    this.creditCard.cpfTitular = this.scripts.cpf_mask(v);
  }

}