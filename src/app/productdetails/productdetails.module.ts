import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic-rating';
import { ProductdetailsPageRoutingModule } from './productdetails-routing.module';

import { ProductdetailsPage } from './productdetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    ProductdetailsPageRoutingModule
  ],
  declarations: [ProductdetailsPage]
})
export class ProductdetailsPageModule {}
