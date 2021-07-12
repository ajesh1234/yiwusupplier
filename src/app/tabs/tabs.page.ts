import { Component } from '@angular/core';
import { ComponentService } from '../services/component.service';
import { MenuController, NavController, ModalController, Platform } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  messageCount:any=0;
  userData:any;
  tabOrderVal:any='';
  tabChatVal:any='';
  tabVal:any='';
  constructor(public storageService:StorageService,public componentService:ComponentService, public navCtrl :NavController) {
    this.componentService.eventsubscribe('messageCount',(data)=>{
      console.log(data)
      this.messageCount = data; 
    })
    this.componentService.eventsubscribe('verification',(data)=>{
      if(this.userData.api_token ==  data.token){
        this.userData.status = data.profile;
        console.log(this.userData, "user")
        this.storageService.set('userData',  this.userData).then(resp => {
          console.log(resp, "user123")
          this.componentService.eventpublish('user:created',Date.now());          
        })
      }
    
    })
  }
  goTo(data) {
    this.storageService.get('userData').then(res=>{
      if( res != null && res != undefined){
        console.log('if', res.status)
        if(res.status == 0){
          this.componentService.presentContactToast('Your account is currently pending to be approved by the administrator. Thanks', 'danger')
          return false;
        }else{   
          this.tabVal = 'tab3';
          this.componentService.eventpublish('product:created', {});  
          this.navCtrl.navigateForward(['/tabs/tab3']);
        }
      }
      })
  }
  goToChat(val){
    this.storageService.get('userData').then(res=>{
      if( res != null && res != undefined){
        console.log('if', res.status)
        if(res.status == 0){
          this.componentService.presentContactToast('Your account is currently pending to be approved by the administrator. Thanks', 'danger')
          return false;
        }else{
          if(val == 'tab4'){
          this.tabChatVal = val;
          }
          if(val == 'tab2'){
            this.tabOrderVal = val;
            }
          console.log("else idf ", this.tabChatVal)
          this.navCtrl.navigateRoot(['/tabs/'+val]);
        }        
      }
    })
  }
}
