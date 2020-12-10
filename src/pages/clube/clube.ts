import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, InfiniteScroll, Tabs, NavParams, ActionSheetController, Platform, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { ClubeService } from '../../data/clube.service';
import { AppModule } from '../../app/app.module';

@Component({
    selector: 'page-clube',
    templateUrl: 'clube.html'
})

export class ClubePage 
{
    public clube: any;

    constructor(private navCtr: NavController,
                private navParams: NavParams,
                private loadingCtrl: LoadingController,
                private clubeServ: ClubeService) {
        this.fetchContent();
    }

    private fetchContent(): void {
        this.clube = null;
        let loading = this.loadingCtrl.create({ content: 'Carregando...' });
        loading.present();
        this.clubeServ.get().subscribe(
            (retorno) => {
                if (retorno.clube) {
                    this.clube = retorno.clube;
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

    private galeria(): void{
        this.navCtr.push(GaleriaPage, {idClube: this.clube.id})
    }

    private viewCarteirinha(): void{
        this.navCtr.push(CarteirinhaPage);
    }
}

@Component({
    templateUrl: 'galeria.html'
})
export class GaleriaPage
{
    public fotos: any[];
    public grid = true;
    public page: number = 1;
    public idClube:number;

    constructor(private navParams: NavParams, private loadingCtrl: LoadingController, private clubeServ: ClubeService){
        this.idClube = navParams.data.idClube;
        this.fetchContent();
    }

    private fetchContent(): void{
        this.page = 1;
        let loading = this.loadingCtrl.create({ content: 'Carregando...' });
        loading.present();

        this.clubeServ.getFotos(this.idClube, this.page).subscribe(
            (retorno) => {
                if(retorno.fotos.length > 0){
                    this.fotos = retorno.fotos;
                    this.fotos.forEach((f, i) => {
                        f.urlImg = AppModule.getUrlSingarehst()+'/img/'+f.urlImg;
                    });
                }
                loading.dismiss();
                console.log(this.fotos);
            }, 
            error => {
                loading.dismiss();
                (error) => console.log(error);
            });
    }

    private doInfinite(infiniteScroll):void{
        this.page++;
        this.clubeServ.getFotos(this.idClube, this.page).subscribe(
            (retorno) => {
                if(retorno.fotos.length > 0){
                    let aux = retorno.fotos;
                    aux.forEach((f, i) => {
                        f.urlImg = AppModule.getUrlSingarehst()+'/img/'+f.urlImg;
                    });
                    this.fotos = this.fotos.concat(aux);
                }
                infiniteScroll.complete();
            }, 
            error => {
                (error) => console.log(error);
            });
    }

    private changeGrid(){
        this.grid = !this.grid;
    }
}

@Component({
    templateUrl: 'carteirinha.html'
})
export class CarteirinhaPage
{
    constructor(private loadingCtrl: LoadingController, private navCtrl: NavController){
        let user = JSON.parse(localStorage.getItem('user'));

        let vencimentoCarteirinha = Date.parse(user.vencimentoCarteirinha);
        let date_now = Date.now();
        if (vencimentoCarteirinha < date_now || isNaN(vencimentoCarteirinha)) {
            this.navCtrl.push(SolicitarCarteirinhaPage)
        }
        else {
          this.viewCarteirinha();
        }    
    }

    private viewCarteirinha(){}
}

declare var cordova: any;
@Component({
    templateUrl: 'solicitar.carteirinha.html'
})
export class SolicitarCarteirinhaPage
{
    lastImage: string = null;
    loading: Loading;

    constructor(private actionSheetCtrl: ActionSheetController, 
                private loadingCtrl: LoadingController,
                private platform: Platform,
                private camera: Camera,
                private file: File,
                private fileTransfer: FileTransfer,
                private filePath: FilePath,
                private toastCtrl: ToastController){
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Enviar Imagem',
            buttons: [
              {
                text: 'Carregar da galeria',
                handler: () => { this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY); }
              },
              {
                text: 'Tirar uma foto',
                handler: () => { this.takePicture(this.camera.PictureSourceType.CAMERA); } 
              },
              {
                text: 'Cancelar',
                role: 'cancel'
              }
            ]
          });
          actionSheet.present();
    }

    public takePicture(sourceType){
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        this.camera.getPicture(options).then((imagePath) => {
            let base64Image = 'data:image/jpeg;base64,'+imagePath;
            console.log(base64Image);
            if(this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath).then(filePath => {
                    let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                });
            }
            else{
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
        }, (err) => {
            this.presentToast('Erro ao selecionar imagem');
        });
    }

    private createFileName(){
        var d = new Date();
        var n = d.getTime();
        var newFileName = n + '.jpg';
        return newFileName;
    }
    
    private copyFileToLocalDir(namePath, currentName, newFileName){
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
        }, error => {
            this.presentToast('Falha ao armazenar imagem.');
        });
    }
    
    private presentToast(text){
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
        }

        public pathForImage(img){
        if(img === null){
            return '';
        }
        else{
            return cordova.file.dataDirectory + img;
        }
    }
    
    public uploadImage() {
        var url = "http://18.228.132.19/singarehst/associado/upload.json";
        
        var targetPath = this.pathForImage(this.lastImage);
        let user = JSON.parse(localStorage.getItem('user'));
        user.CPF = user.CPF.replace('.', '-');
        var filename = user.CPF+'.jpg';
        
        var options = {
            fileKey: "foto",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params : {'filename': filename}
        };
        
        const fileTransfer: FileTransferObject = this.fileTransfer.create();
        
        this.loading = this.loadingCtrl.create({
            content: 'Carregando...',
        });
        this.loading.present();
        
        fileTransfer.upload(targetPath, url, options).then(data => {
            this.loading.dismissAll()
        }, err => {
            this.loading.dismissAll()
            this.presentToast('Falha ao enviar imagem.');
        });
    }
}