import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { ComponentService } from '../services/component.service';
import { TermsPage } from '../terms/terms.page';
import { MenuController, NavController, ModalController, Platform } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categoryArray:any=[];
  userData: any = '';
  categoryData: any = [];
  constructor(public navCtrl :NavController,public componentService:ComponentService, public modalController:ModalController,public storageService: StorageService, public api: ApiService) {
  }

  ngOnInit() {
    this.storageService.get('userData').then(res => {
      if (res != null && res != undefined) {
        this.userData = res;
      }
      this.getCategories();
    });
  }
  getCategories() {
    var data = {
      token: this.userData.api_token
    }
    console.log(data, "data")
    this.api.get('/getContent', data).subscribe((res: any) => {
      console.log(res)
      if (res.status == '200') {
        this.categoryData = res.product_categories;
        this.componentService.eventpublish('messageCount', res.total_readcount)

      }
    })
  }
  goTo(data) {
    console.log(data, "ff");
    this.componentService.eventpublish('product:created', { catData: JSON.stringify(data) });
    this.navCtrl.navigateForward(['/tabs/tab3'], { state: { catData: JSON.stringify(data) } });
  }
}
