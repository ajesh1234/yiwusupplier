import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotationdetailsPage } from './quotationdetails.page';

const routes: Routes = [
  {
    path: '',
    component: QuotationdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationdetailsPageRoutingModule {}
