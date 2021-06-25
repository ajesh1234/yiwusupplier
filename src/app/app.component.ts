import { Component } from '@angular/core';
import { StorageService } from '../app/services/storage.service';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { ApiService } from '../app/services/api.service';
import { ComponentService } from '../app/services/component.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showLevel1 = null;
  showLevel2 = null;
  selected:any='';
  categoryData:any=[];
  public appPages = [
    { title: 'Home', url: '/tabs/tab1', icon:'assets/images/myacc.svg'},
    { title: 'Categories', url: '/category', icon:'assets/images/myorder.svg'},
    { title: 'Quotation requests', url: '/quotationreuests', icon:'assets/images/tickets.svg'},
    { title: 'Notifications', url: '/notifications', icon:'assets/images/quotation.svg'},
    { title: 'Logout', url: '/login', icon:'assets/images/logout.svg'},
  ];
  constructor(public menu:MenuController,public componentService:ComponentService,  public api :ApiService,public storageService:StorageService, public navCtrl :NavController) {
    this.getCategories();
    this.storageService.get('userData').then(res=>{
      if( res != null && res != undefined){
        this.navCtrl.navigateRoot(['/tabs/tab1']);
      }
    })
  }
  getCategories(){
    var data = { }
    console.log(data, "data")
    this.api.get('/getContent', data).subscribe((res: any) => {
      if(res.status == '200'){
        this.categoryData = res.product_categories;
      }
    })
} 
toggleLevel1(idx) {
  if (this.isLevel1Shown(idx)) {
    this.showLevel1 = null;
  } else {
    this.showLevel1 = idx;
  }
};
isLevel1Shown(idx) {
  return this.showLevel1 === idx;
};
toggleLevel2(idx, catName,subCatData) {
  if(subCatData.childs.length == 0){
    this.goTo(catName,subCatData);
  }
  if (this.isLevel2Shown(idx)) {
    // this.showLevel1 = null;
    this.showLevel2 = null;
  } else {
    // this.showLevel1 = idx;
    this.showLevel2 = idx;
  }
};
isLevel2Shown(idx) {
  return this.showLevel2 === idx;
};
goTo(catName,subCatData){
  console.log(subCatData);
  this.selected = subCatData.id;
  this.menu.close();
  this.showLevel1 = null;
  this.showLevel2 = null;
  console.log(this.selected)
  this.navCtrl.navigateForward(['/tabs/tab3'],{state:{catData: JSON.stringify(catName) , item:JSON.stringify(subCatData)}})
  this.componentService.eventpublish('product:created', {catData: JSON.stringify(catName) , item:JSON.stringify(subCatData)});  
}
goToChild(catName,subCatData,child){
  this.selected = child.id;
  this.menu.close();
  this.showLevel1 = null;
  this.showLevel2 = null;
  this.navCtrl.navigateForward(['/tabs/tab3'],{state:{catData: JSON.stringify(catName) , item:JSON.stringify(subCatData), child :JSON.stringify(child)}})
  this.componentService.eventpublish('product:created', {catData: JSON.stringify(catName) , item:JSON.stringify(subCatData), child :JSON.stringify(child)});  
}
getClass(id){
  if(this.selected == id){
    return 'active'
  }
}
}
