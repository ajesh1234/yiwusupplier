import { Component } from '@angular/core';
import { ComponentService } from '../services/component.service';
import { MenuController, NavController, ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public componentService:ComponentService, public navCtrl :NavController) {}
  goTo(data) {
    console.log(data, "ff");    
    this.componentService.eventpublish('product:created', {});  
    this.navCtrl.navigateForward(['/tabs/tab3']);
  }
}
