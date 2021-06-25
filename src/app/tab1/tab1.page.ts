import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { NavParams, MenuController, ModalController, IonInput, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userData:any='';
  data:any='';
  noData:boolean =false;
  notificationData :any = [];
  constructor(public modalController: ModalController, public storageService: StorageService, public navCtrl: NavController, public route: ActivatedRoute, public router: Router, public api: ApiService, public componentService: ComponentService) {
    this.storageService.get('userData').then(res => {
      console.log(res);
      if (res != null && res != undefined) {
        this.userData = res;
        this.getOrders();
        this.getNotification();
      }
    });
    this.componentService.eventsubscribe('noti:created',(data)=>{
      this.notificationData =[];
      this.noData = false;
      this.getNotification();
    })
  } 
  ionViewDidEnter(){
    this.notificationData =[];
    this.noData = false;
    this.getOrders()
    this.getNotification();
  }
  getOrders() {
    var data = {
      token: this.userData.api_token
    }
    this.api.get('/dashboard',data).subscribe(res => {
      console.log(res);
      if (res.status == '200') {
       this.data = res;
      }

    })
  }
  getNotification() {
    var data = {
      token: this.userData.api_token
    }
    this.api.get('/notf_list',data).subscribe(res => {
      console.log(res);
      if (res.status == '200') {
        if (res.notifications.length != 0) {
          this.noData = false;
          res.notifications.forEach((datas, key) => {
            this.notificationData.push(datas);
          })
        } else {
          this.noData = true;
          this.notificationData = [];
        }
      }

    })
  }
  goTo(data){
    console.log(data);
    this.navCtrl.navigateForward(['/orderdetails'],{state:{id:data.order_number, noti : data.id}});
  }
}
