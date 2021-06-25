import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { OtpPageRoutingModule } from './otp-routing.module';

import { OtpPage } from './otp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    OtpPageRoutingModule
  ],
  declarations: [OtpPage]
})
export class OtpPageModule {}
