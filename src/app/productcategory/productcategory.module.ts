import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductcategoryPageRoutingModule } from './productcategory-routing.module';

import { ProductcategoryPage } from './productcategory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductcategoryPageRoutingModule
  ],
  declarations: [ProductcategoryPage]
})
export class ProductcategoryPageModule {}
