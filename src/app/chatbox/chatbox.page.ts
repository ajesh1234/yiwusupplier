import { Component, OnInit,ViewChild } from '@angular/core';
import { ModalController, AlertController,NavController,IonContent, ActionSheetController } from '@ionic/angular';
import { ChatdetailPage } from '../chatdetail/chatdetail.page';
// import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { StorageService } from '../services/storage.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
declare var Pusher: any;
@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.page.html',
  styleUrls: ['./chatbox.page.scss'],
})
export class ChatboxPage implements OnInit {
  @ViewChild(IonContent, {  static: false }) content: IonContent;
  reciever_id:any='';
  chat:any=[];
  pageNum: any = 1;
  public totalPages = 0;
  userData:any='';
  message:any='';
  image:any='';
  chat_imgurl:any='';
  userName:any='';
  constructor(public alertController:AlertController,public actionSheetController:ActionSheetController, public camera : Camera,public socialSharing: SocialSharing, public storageService: StorageService, public navCtrl: NavController, public componentService: ComponentService, public api: ApiService, public router: Router, public modalController: ModalController) {
    this.storageService.get('userData').then(res => {
      if (res != null && res != undefined) {
        this.userData = res;
      }
    });
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.reciever_id = state.reciever_id ? state.reciever_id : '';
      this.storageService.get('userData').then(res => {
        if (res != null && res != undefined) {
          this.userData = res;
          this.getUserChat();
        }
      });      
    };
    // this.componentService.eventsubscribe('chat:created',(data)=>{
    //   this.getUserChat()
    // })
    Pusher.logToConsole = true;
    
    const pusher = new Pusher('917d2b88ea99c8e88584', {
      cluster: 'ap2',
      forceTLS: true
    });
    const channel = pusher.subscribe('chat');
    console.log(channel, "chaneel");
    var that = this;
    channel.bind('chat-notification', function(data) {
             setTimeout(() => {
          that.getUserChat();
        }, 200);
   
    });
   }

  ngOnInit() {
  }
  openCamera(sourceType){
    const options: CameraOptions = {
        quality: 20,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 300,
        targetHeight: 300,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }
      
      this.camera.getPicture(options).then((imageData) => {
           this.image= 'data:image/jpeg;base64,' + imageData;
          //  this.sendMessage();
           console.log( this.image);
      }, (err) => {
       // Handle error
       alert(JSON.stringify(err))
      });
  
    }
    close(){
      this.image ='';
    }
    async selectImage() {
      const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.openCamera(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
        ]
      });
      await actionSheet.present();
    }
  goBack(){
    this.navCtrl.pop();
  }
  sendMessage(){
    console.log(this.message)
    if ((this.message && this.message.length && !(/^ *$/.test(this.message)))|| (this.image !='' && this.image !=null)) {
      this.componentService.presentLoading();
         var data = {
      message: this.message,
      receiver_id:this.reciever_id,
      token :this.userData.api_token,
      image: this.image
      // total :this.total
     }
    console.log(data, "data")
    this.api.post('/add_chat', data).subscribe((res: any) => {
      console.log(res)
      this.componentService.stopLoading();
      if(res.status == '200'){
        this.chat.push(res.chat);
        // this.componentService.eventpublish('chat:created', Date.now());
        this.message = '';
        this.image = '';
      setTimeout(() => {
        this.updateScroll();
      }, 200);
      }else{
      this.componentService.presentToast(res.message , 'danger');
      }
    })
  }else{
    // this.componentService.stopLoading();
    this.componentService.presentToast('Please enter message/ image.','danger');
    return false;
  }
  }
  updateScroll() {
    console.log('+++++', this.content);
    this.content.scrollToBottom().then(val => {
      console.log(val);
    }).catch(err => {
    });
  }
  addClass(val){
    // console.log(val)
    if(val.sender_id == this.userData.id){
      return 'right_div';
    }else{
      return 'left_div';
    }
  }
  async deleteConfirmation(id, index) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class subscription-label",
      header: "Are you sure you want to delete this ticket?",
      message: "",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "YES",
          handler: () => {
            console.log("Confirm Okay");
            this.delete(id, index)
          },
        },
      ],
    });

    await alert.present();
  }
  delete(id, index) {
    this.componentService.presentLoading();
    var formdata = {
      token: this.userData.api_token,
      chat_id: id
    }
    this.api.post('/delete_chat', formdata).subscribe((res: any) => {
      this.componentService.stopLoading();
      if (res.status == '200') {
        this.chat.splice(index, 1)
      }
    }, err => {
      this.componentService.stopLoading();
    })
  }
  getUserChat(){
      // this.componentService.presentLoading();
      var data = {
        user_id :this.reciever_id,
        token: this.userData.api_token,
        skip: this.pageNum
      }
      this.api.get('/user_chat', data).subscribe((res: any) => {
        // this.componentService.stopLoading();
        console.log(res)
        if (res.status == '200') {
          this.chat = res.chat; 
          this.chat_imgurl =res.chat_imgurl
          this.userName = res.userinfo.name;
          this.componentService.eventpublish('chats:created',Date.now());
          setTimeout(() => {
            this.updateScroll();
          }, 200); 
        this.totalPages = Math.ceil(parseInt(res.totalprods) / 10);
        }
      })    
  }
  getImage(user){
    // console.log(user, this.chat_imgurl);
    var img = this.chat_imgurl+'/'+user.image;
    return img;
  }
  pagination(event) {
    setTimeout(() => {
      if (this.pageNum < this.totalPages) {
        this.pageNum++;
        this.getUserChat();
      }

      if (this.pageNum == this.totalPages) {
        event.target.disabled = true;
      }

      event.target.complete();

    }, 500);
  }
  
  async presentModal(data) {
    const modal = await this.modalController.create({
      component: ChatdetailPage,
      cssClass: 'filtermodal',
      id: "chat",
      componentProps: { 
        'data': data,
        'url':this.chat_imgurl
      }
    });
    return await modal.present();
  }
  async dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
