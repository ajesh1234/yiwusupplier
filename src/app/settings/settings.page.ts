import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ComponentService } from '../services/component.service';
import { MenuController, NavController,AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  data:any='';
  userData:any='';
  cartLength:any=0;
  ordercount:any='';
  favcount:any='';
  constructor(public api:ApiService,public componentService:ComponentService, public alertController:AlertController, public storageService:StorageService, public navCtrl :NavController) {
   this.favcount = this.api.favcount;
    this.storageService.get('userData').then(res=>{
      console.log(res);
      if( res != null && res != undefined){
        this.userData = res;
      }
    })
    this.componentService.eventsubscribe('cart:created',(data)=>{
      if(localStorage.getItem('cart_data')!=null && localStorage.getItem('cart_data')!= undefined){
        this.cartLength = JSON.parse(localStorage.getItem('cart_data')).length;
      }else{
        this.cartLength = 0
      }
    })
    this.componentService.eventsubscribe('user:created', (data: any) => {
      this.storageService.get('userData').then(res=>{
        console.log(res);
        if( res != null && res != undefined){
          this.userData = res;
           this.getOrders();

        }
      })
    });
    if(localStorage.getItem('cart_data')!=null && localStorage.getItem('cart_data')!= undefined){
      this.cartLength = JSON.parse(localStorage.getItem('cart_data')).length;
    }else{
      this.cartLength = 0
    }
   }

  ngOnInit() {
    this.storageService.get('userData').then(res=>{
      console.log(res);
      if( res != null && res != undefined){
        this.userData = res;
         this.getOrders();
      }
    })
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
  async logoutConfirmation() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class subscription-label",
      header: "Are you sure you want to logout?",
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
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }
  logout(){
    this.storageService.deleteAll();
    this.componentService.presentToast('Logout Successfully!', 'success')
    this.navCtrl.navigateRoot(['/login'])
  }
}
