import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuotationdetailsPageRoutingModule } from './quotationdetails-routing.module';

import { QuotationdetailsPage } from './quotationdetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuotationdetailsPageRoutingModule
  ],
  declarations: [QuotationdetailsPage]
})
export class QuotationdetailsPageModule {}
