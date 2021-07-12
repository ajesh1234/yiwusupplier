import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from 'time-ago-pipe';

import { IonicModule } from '@ionic/angular';

import { ChatdetailPageRoutingModule } from './chatdetail-routing.module';

import { ChatdetailPage } from './chatdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatdetailPageRoutingModule
  ],
  declarations: [ChatdetailPage,TimeAgoPipe]
})
export class ChatdetailPageModule {}
