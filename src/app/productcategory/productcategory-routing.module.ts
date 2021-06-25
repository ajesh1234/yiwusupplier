import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductcategoryPage } from './productcategory.page';

const routes: Routes = [
  {
    path: '',
    component: ProductcategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductcategoryPageRoutingModule {}
