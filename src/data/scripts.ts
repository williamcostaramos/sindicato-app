export class scripts
{
    constructor(){

    }

    public floatToBr(num):string{
        var x = 0;
        var cents;
        var ret;
        if(num<0){
          num = Math.abs(num);
          x = 1;
        }
  
        if(isNaN(num)) num = "0";
          cents = Math.floor((num*100+0.5)%100);
  
        num = Math.floor((num*100+0.5)/100).toString();
  
        if(cents < 10) cents = "0" + cents;
          for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
              num = num.substring(0,num.length-(4*i+3))+'.'
                    +num.substring(num.length-(4*i+3));
  
        ret = num + ',' + cents;
  
        if (x == 1) ret = ' - ' + ret;return ret;
    }

    public validarCpf(cpf):string{
        let cpfArray: number[] = [];
        let digVerificador: number[] = [];
        if(cpf!='' && cpf.length >= 11){
          cpf = cpf.replace(/\D/g, ''); //Remove tudo o que não é dígito
          this.separador(cpf, cpfArray);
          let soma:number = 0;
          let mult:number = 10;
          for(let i = 0; i <= 8; i++){
            soma += cpfArray[i]*mult;
            mult--; 
          }
          digVerificador[0] = this.digVerificador(soma);
    
          soma = 0;
          mult = 11;  
          for(let i = 0; i <= 9; i++){
            soma += cpfArray[i]*mult;
            mult--; 
          }  
          digVerificador[1] = this.digVerificador(soma);
          if(digVerificador[0] != cpfArray[9] || digVerificador[1] != cpfArray[10]){
            return '';
          }
          console.log(cpf);
        }
        else{
            return '';
        }
        
    }
    
    private digVerificador(d:number):number{
        let resto:number = 0
        let verificador:number = 0;
        resto = d%11;
        verificador = 11-resto;
        if(verificador > 9)
          return 0;
        else
          return verificador;
    }
    
    private separador(cpf, cpfAux:number []){
        let cont = cpf.length;
        if(cpf.length > 1){
            cpf = cpf.replace(/(\d{1})(\d)/, '$1.$2');//Coloca um ponto entre o primeiro e o segundo digito
            cpf = cpf.split('.');   
            cpfAux[11-cont] = cpf[0];
            this.separador(cpf[1], cpfAux);
        }
        else{
            cpfAux[11-cont] = cpf;
        }
    }

    public cpf_mask(v):string {
        v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
        v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
        v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
        //de novo (para o segundo bloco de números)
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
        return v;
    }

    public cnpj_mask(v):string {
        v = v.replace(/\D/g, '');
        v = v.replace(/(\d{2})(\d)/, '$1.$2'); 
        v = v.replace(/(\d{3})(\d)/, '$1.$2'); 
        v = v.replace(/(\d{3})(\d)/, '$1.$2'); 
        v = v.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        return v;
    }

    public phone_mask(v):string{
        v = v.replace(/\D/g, '');             //Remove tudo o que não é dígito
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2'); //Coloca parênteses em volta dos dois primeiros dígitos
        v = v.replace(/(\d)(\d{4})$/, '$1-$2');    //Coloca hífen entre o quarto e o quinto dígitos

        return v;
    }
}