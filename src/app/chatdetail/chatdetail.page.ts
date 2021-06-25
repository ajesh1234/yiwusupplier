import { Component, OnInit } from '@angular/core';
import { MenuController,NavController,NavParams, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
@Component({
  selector: 'app-chatdetail',
  templateUrl: './chatdetail.page.html',
  styleUrls: ['./chatdetail.page.scss'],
})
export class ChatdetailPage implements OnInit {
  data:any='';
  url :any='';
  chat_img:any=''
  constructor(public navParams: NavParams,public componentService:ComponentService,public modalController:ModalController, public api :ApiService) {
   this.data = navParams.get('data');
   this.url = navParams.get('url');
   this.chat_img = this.url+'/'+this.data.image;
   }

  ngOnInit() {
  }
  async dismiss() {
    this.modalController.dismiss(null, undefined, 'chat');
     }
}
