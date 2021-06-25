import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { NavParams, MenuController, ModalController, AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  userData: any = '';
  data: any = '';
  noData: boolean = false;
  notificationData: any = [];
  constructor(public alertController: AlertController, public modalController: ModalController, public storageService: StorageService, public navCtrl: NavController, public route: ActivatedRoute, public router: Router, public api: ApiService, public componentService: ComponentService) {
    this.storageService.get('userData').then(res => {
      console.log(res);
      if (res != null && res != undefined) {
        this.userData = res;
        this.notificationData = [];
        this.noData = false;
        this.getNotification();
      }
    });
    this.componentService.eventsubscribe('noti:created', (data) => {
      this.notificationData = [];
      this.noData = false;
      this.getNotification();
    })
  }

  ngOnInit() {

  }
  goBack() {
    this.navCtrl.pop();
  }
  async deleteConfirmation(id, index) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class subscription-label",
      header: "Are you sure you want to delete this notification?",
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
      notification_id: id
    }
    this.api.get('/notf_delete', formdata).subscribe((res: any) => {
      this.componentService.stopLoading();
      if (res.status == '200') {
        this.notificationData.splice(index, 1);
        if (this.notificationData.length == 0) {
          this.noData = true;
        }
      }
    }, err => {
      this.componentService.stopLoading();
    })
  }
  goTo(data) {
    console.log(data);
    this.navCtrl.navigateForward(['/orderdetails'], { state: { id: data.order_number, noti: data.id } });
  }
  getNotification() {
    var data = {
      token: this.userData.api_token
    }
    this.api.get('/notf_list', data).subscribe(res => {
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
  ionViewDidEnter() {

  }
}
