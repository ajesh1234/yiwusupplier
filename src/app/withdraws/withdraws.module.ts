import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WithdrawsPageRoutingModule } from './withdraws-routing.module';

import { WithdrawsPage } from './withdraws.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WithdrawsPageRoutingModule
  ],
  declarations: [WithdrawsPage]
})
export class WithdrawsPageModule {}
