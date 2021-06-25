import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { NavParams, MenuController, ModalController, AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-notificationdetail',
  templateUrl: './notificationdetail.page.html',
  styleUrls: ['./notificationdetail.page.scss'],
})
export class NotificationdetailPage implements OnInit {
  userData:any='';
  data:any='';
  notiData:any='';
  constructor(public alertController:AlertController, public modalController: ModalController, public storageService: StorageService, public navCtrl: NavController, public route: ActivatedRoute, public router: Router, public api: ApiService, public componentService: ComponentService) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.data = state.data ? JSON.parse(state.data): '';
    };
    this.storageService.get('userData').then(res=>{
      // console.log(res);
      if( res != null && res != undefined){
        this.userData = res;
        this.getDetails();
      }
    })
 
  } 
  getDetails() {
    console.log(this.data.id)
    this.componentService.presentLoading();
    var data = {
      token :this.userData.api_token,
      order_number: this.data.id
    }
    this.api.post('/order_details', data).subscribe((res: any) => {
      console.log(res)
      this.componentService.stopLoading();
      if (res.status == '200') {
        this.notiData = res;
      }else{
        this.notiData ='';
      }
    },err=>{
      this.componentService.stopLoading();
    })
  }

  ngOnInit() {
  }

}
