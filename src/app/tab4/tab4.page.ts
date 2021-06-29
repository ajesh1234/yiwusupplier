import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, ModalController, Platform ,AlertController} from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  userData: any = '';
  chatList: any = [];
  noData: boolean;

  constructor(public alertController:AlertController,public storageService: StorageService, public navCtrl: NavController, public platform: Platform, public componentService: ComponentService, public modalController: ModalController, public api: ApiService, public menu: MenuController) {
    this.componentService.eventsubscribe('chats:created', (data)=>{
      this.nogetChatList();
      })
  }
  ionViewDidEnter() {
    this.storageService.get('userData').then(res => {
      if (res != null && res != undefined) {
        this.userData = res;
        this.getChatList();
      }
    });
  }
  ngOnInit() {

  }
  async deleteConfirmation(id, index) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class subscription-label",
      header: "Are you sure you want to delete this chat?",
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
        this.chatList.splice(index, 1);
        this.alertController.dismiss();
      }
    }, err => {
      this.componentService.stopLoading();
    })
  }
  nogetChatList() {
    var data = {
      token: this.userData.api_token
    }
    console.log(data, "data");
    this.api.get('/chat_list', data).subscribe((res: any) => {
      console.log(res);
      if (res.status == '200') {
        this.chatList = res.chat;
        this.noData = false;
        this.componentService.eventpublish('messageCount', res.total_readcount)
        if (this.chatList.length == 0) {
          this.noData = true;
        }
      }
    })

  }
  getChatList() {
    this.componentService.presentLoading();
    var data = {
      token: this.userData.api_token
    }
    console.log(data, "data");
    this.api.get('/chat_list', data).subscribe((res: any) => {
      console.log(res);
      this.componentService.stopLoading();
      if (res.status == '200') {
        this.chatList = res.chat;
        this.componentService.eventpublish('messageCount', res.total_readcount)

        this.noData = false;
        if (this.chatList.length == 0) {
          this.noData = true;
        }
      }
    })

  }
  goToChat(data) {
    this.navCtrl.navigateForward(['/chatbox'], { state: { reciever_id: data.sender_id } })
  }
}
