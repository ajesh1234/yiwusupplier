import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotationreuestsPage } from './quotationreuests.page';

const routes: Routes = [
  {
    path: '',
    component: QuotationreuestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationreuestsPageRoutingModule {}
