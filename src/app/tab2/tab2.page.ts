import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { NavParams, MenuController, ModalController, IonInput, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  profile: any ='upcoming';
  imageUrl: any = '';
  pageNum: any = 1;
  public totalPages = 0;
  noData: boolean = false;
  color:any='';
  userData:any='';
  productData: any = [];
  constructor(public modalController: ModalController, public storageService: StorageService, public navCtrl: NavController, public route: ActivatedRoute, public router: Router, public api: ApiService, public componentService: ComponentService) {

    // this.componentService.eventsubscribe('order:created',(data)=>{
    //   this.getOrders();
    // })
  }
  segmentChanged(){
    this.productData = [];
    this.noData = false;
    this.getOrders();
  }
  ngOnInit(){
    this.storageService.get('userData').then(res => {
      console.log(res);
      if (res != null && res != undefined) {
        this.userData = res;
        this.getOrders();
      }
    });
  }
  getColor(status){
    if(status == 'pending' || status == 'processing'){
      this.color = "warning"; 
    }else if (status == 'delivered' || status == 'completed'){
      this.color = "success"; 
    }else{
      this.color = "danger"; 
    }
    return this.color ;
  }
  changeStatus(status, val, index){
    console.log(val, "hhh");
    // return  false;
    this.componentService.presentLoading();
    var data = {
      token: this.userData.api_token,
      order_number:val.order_number,
      status: status
    }
    this.api.post('/order_status',data).subscribe((res:any) => {
      this.componentService.stopLoading();
      if (res.status == '200') {
        // this.componentService.eventpublish('order:created', Date.now());    
        if(status == 'completed' || status == 'declined'){
          this.productData.splice(index, 1);
        }else{
        this.productData[index].status = status;
        }
        if(this.productData.length == 0){
          this.noData =true;
        }
      }
    })
  }
  goTo(data){
    this.navCtrl.navigateForward(['/orderdetails'],{state:{id: data.order_number}});
  }
  pagination(event) {
    setTimeout(() => {
      if (this.pageNum < this.totalPages) {
        this.pageNum++;
        this.getOrders();
      }

      if (this.pageNum == this.totalPages) {
        event.target.disabled = true;
      }

      event.target.complete();

    }, 500);
  }
  getOrders() {
    var data = {
      skip: this.pageNum,
      token: this.userData.api_token,
      type:'supplier',
      status: this.profile
    }
    this.api.get('/supplierorders',data).subscribe(res => {
      if (res.status == '200') {
        if (res.orders.length != 0) {
          this.noData = false;
          this.imageUrl = res.imgurl + '/';
          res.orders.forEach((datas, key) => {
            this.productData.push(datas);
          })
        } else {
          this.noData = true;
          this.productData = [];
        }
        this.totalPages = Math.ceil(parseInt(res.totalprods) / 10);
      }

    })
  }
}
