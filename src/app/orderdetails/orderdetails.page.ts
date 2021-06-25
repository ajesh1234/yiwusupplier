import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.page.html',
  styleUrls: ['./orderdetails.page.scss'],
})
export class OrderdetailsPage implements OnInit {
  order_id: any = '';
  orderData: any = '';
  userData: any = '';
  imageUrl: any = '';
  color: any = '';
  productArray: any = [];
  noti: any = '';
  constructor(public storageService: StorageService, public navCtrl: NavController, public componentService: ComponentService, public api: ApiService, public router: Router, public modalController: ModalController) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.order_id = state.id ? state.id : '';
      this.noti = state.noti ? state.noti : '';
    };
  
    this.storageService.get('userData').then(res => {
      // console.log(res);
      if (res != null && res != undefined) {
        this.userData = res;
        this.getOrderDetails();
        if( this.noti !=''){
          this.read();
        }
      }
    })

  }

  ngOnInit() {
  }
  read(){
    var data = {
      token: this.userData.api_token,
      notification_id: this.noti
    }
    this.api.post('/notf_read', data).subscribe((res: any) => {
      this.componentService.stopLoading();
      if (res.status == '200') {
      this.componentService.eventpublish('noti:created',Date.now());
      }
    }, err => {
    }) 
  }
  getOrderDetails() {
    console.log(this.order_id)
    this.componentService.presentLoading();
    var data = {
      token: this.userData.api_token,
      order_number: this.order_id
    }
    this.api.post('/order_details', data).subscribe((res: any) => {
      this.componentService.stopLoading();
      if (res.status == '200') {
        this.imageUrl = res.imgurl + '/';
        this.orderData = res.order;
        console.log(this.orderData);
        if (this.orderData.status == 'pending') {
          this.color = "warning";
        } else if (this.orderData.status == 'delivered') {
          this.color = "success";
        } else {
          this.color = "danger";
        }
        var that = this;
        Object.values(res.cart).forEach((element, key) => {
          // console.log(element);
          that.productArray.push(element);
        });
        //  console.log(that.productArray)
      }
    }, err => {
      this.componentService.stopLoading();
    })
  }
  goBack() {
    if (this.noti != '') {
      // this.navCtrl.navigateBack(['/notifications']);
      this.navCtrl.pop();
    } else {
      this.navCtrl.navigateBack(['/tabs/tab2']);
    }
  }

}
