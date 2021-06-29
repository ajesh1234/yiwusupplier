import { Component } from '@angular/core';
import { ComponentService } from '../services/component.service';
import { MenuController, NavController, ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  messageCount:any=0;
  constructor(public componentService:ComponentService, public navCtrl :NavController) {
    this.componentService.eventsubscribe('messageCount',(data)=>{
      console.log(data)
      this.messageCount = data; 
    })
  }
  goTo(data) {
    console.log(data, "ff");    
    this.componentService.eventpublish('product:created', {});  
    this.navCtrl.navigateForward(['/tabs/tab3']);
  }
}
