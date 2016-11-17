import {Page, NavController, Platform} from "ionic-angular/index";
import {Board} from "../../providers/board.model";
import {BoardImage} from "../../providers/boardimage.model";
import {DashboardCache} from "../../providers/dashboard.cache";
import {BoardService} from "../../providers/board.service";
import {Dashboard} from "../../providers/dashboard.model";
import {Camera, Device, CameraOptions, Diagnostic} from 'ionic-native';
import {NgZone, Component} from '@angular/core';
import {ImagePicker} from "ionic-native";
//import {ImageRotation} from './image-rotation';


@Page({
    templateUrl: 'build/pages/edit-board/edit-board.html',
})
export class EditBoardPage {

    board: Board = {id: 0, name: "", location_text: "", description: "", invite_code: ""};
    boardlogo: BoardImage={id:0, boardimage:""}
    saved: boolean = false;
    error: boolean = false;
    public device: any;
    public devicestate:boolean = false;
  file_srcs: string;
  public cameraSupported:boolean;
  //  public is_device:boolean=false;

    constructor(protected nav: NavController,
                protected dashboard: DashboardCache,
                protected boards: BoardService,
                protected zone: NgZone,
                protected platform: Platform
                ) {

       //  var ua=window.navigator.userAgent;
       // // this.is_device = ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1;
       // this.is_device=(/Safari\/[.0-9]*/).test(ua);
       platform.ready().then(() => {
     
        Diagnostic.isCameraPresent().then((res) => {
          console.log('diagnostic result', res);
          this.cameraSupported = res;
        }).catch((err) =>  {
          console.log('got an error using diagnostic');
          console.dir(err);
        });

    });

       let timeoutId = setTimeout(() => {  
            window.localStorage.removeItem("url");
            if(localStorage.getItem('myboard')){
              let myBoard= JSON.parse( localStorage.getItem('myboard'));
                this.board = myBoard;
                if(!this.board.imagename){
                    this.file_srcs="img/myboard.png";
                }else{
                   this.file_srcs=this.board.imagename;
                   window.localStorage.setItem("url", this.board.imagename);
                }

            }
       }, 10);

        //recognize of uuid of device to distinguish device and site
        

        this.device = {};
        platform.ready().then(() => {
            this.device = Device.device.uuid;
            this.devicestate=true;
        });

        
    }

   onPageWillLeave()
    {

       this.dashboard.invalidate();

    }

    updateBoardImage(){
        this.boards
        .updateimage(this.board.id, this.boardlogo.boardimage)
        .then(() => {
            console.log("Updated image", this.board);

            this.error = false;
            this.saved = true;
        }).catch(err => {
            console.log("Failed to update", err);
            this.error = true;
            this.saved = false;
        });
    }

    protected updateBoard() {
      //console.log(this.board.imagename);
        this.boards
        .update(this.board.id, this.board.name, this.board.location_text, this.board.description, this.board.imagename)
        .then(() => {
            console.log("Updated", this.board);
           // this.updateBoardImage();
            this.error = false;
            this.saved = true;
        }).catch(err => {
            console.log("Failed to update", err);
            this.error = true;
            this.saved = false;
        });
    }

    protected insertBoardImage(boardid) {
        this.boards
        .createimage(boardid, this.boardlogo.boardimage)
        .then(() => {
            console.log("Created Board Image", this.board);
        }).catch(err => {
            console.log("Failed to insert Board Image", err);
            this.error = true;
            this.saved = false;
        });
    }

    protected insertBoard() {
        this.boards
        .create(this.board.name, this.board.location_text, this.board.description, this.board.imagename)
        .then(row => {
            this.board.id = row.id;
            this.board.invite_code = row.invite_code;
            this.dashboard.invalidate();
            this.error = false;
            this.saved = true;
           // this.insertBoardImage(this.board.id);
            console.log("Created", this.board);
        }).catch(err => {
            console.log("Failed to insert", err);
            this.error = true;
            this.saved = false;
        });
    }

    
    //get image from camera
    takePicture(){
       Camera.getPicture({
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            targetWidth: 300,
            targetHeight: 300
        }).then((imageData) => {
          // imageData is a base64 encoded string
         // this.boardlogo.boardimage= "data:image/jpeg;base64," + imageData;
             this.board.imagename= "data:image/jpeg;base64," + imageData;
             // this.board.imagename=  imageData;
            this.file_srcs ="data:image/jpeg;base64," + imageData;
            window.localStorage.setItem("url", this.board.imagename);

        }, (err) => {
            console.log(err);
        });
     }
     //get image from gal
   imagePicker() {

    //   let options = {
    //     maximumImagesCount: 1,
    //     width: 300,
    //     height: 300,
    //     quality : 75
    //   };

    // ImagePicker.getPictures(options)
    //     .then((results) => {
    //         this.board.imagename= results[0];
    //         this.file_srcs = results[0];
    //         window.localStorage.setItem("url", this.board.imagename);
           
    //     }, (error) => {
    //         console.log("ERROR -> " + JSON.stringify(error));
    //     });

    Camera.getPicture({
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            saveToPhotoAlbum: false
        }).then((imageData) => {
          // imageData is a base64 encoded string
         // this.boardlogo.boardimage= "data:image/jpeg;base64," + imageData;
             this.board.imagename= "data:image/jpeg;base64," + imageData;
             // this.board.imagename=  imageData;
            this.file_srcs ="data:image/jpeg;base64," + imageData;
            window.localStorage.setItem("url", this.board.imagename);

        }, (err) => {
            console.log(err);
        });
  }




     render(src){
        var image = new Image();
        var dataUrl;
        var MAX_HEIGHT=300;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");

       
        image.onload = function(){
            var orginwidth=image.width;
            var orginheight=image.height;
           
           var left=0, top=0;
           var angle=0;
         
           if(orginwidth>=orginheight){
               left=(orginwidth - orginheight)/2;
               top=0;
               angle=0;
           }else{
               top=(orginheight - orginwidth)/2;
               left=0;
               
               
           }
           var ua=window.navigator.userAgent;
           var is_device:boolean;
           is_device = ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1;
      
           if(is_device){
                   angle=90;
              }
           

            ctx.rotate(angle*Math.PI/180);
            ctx.translate(0, -canvas.height);
            ctx.drawImage(image, left, top, orginwidth-left, orginheight-top, 0, 0, 300 , 300);
            ctx.restore();


            
            dataUrl = canvas.toDataURL('image/jpeg');
            console.log(dataUrl);
            window.localStorage.setItem("url", dataUrl);
           
          };
        image.src = src;
        
}

    //get image from my computer
    fileChange(input){   
        
        console.log("file change");
        
        var img= document.createElement("img");
        img.src= window.URL.createObjectURL(input.files[0]);
        this.render(img.src);
        this.file_srcs=img.src;
        

    }
    testfunc(dataurl){
        this.board.imagename=dataurl;
    }
    
    onSave(boardForm) {
       // alert(window.localStorage.getItem("url"));
       this.board.imagename=window.localStorage.getItem("url");
        if (!boardForm.valid) {
            console.log("Invalid form", boardForm);
        } else if (this.board.id > 0) {
            this.updateBoard();
        } else {
            this.insertBoard();
        }
    }
}
