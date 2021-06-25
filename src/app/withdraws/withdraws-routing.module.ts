import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WithdrawsPage } from './withdraws.page';

const routes: Routes = [
  {
    path: '',
    component: WithdrawsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawsPageRoutingModule {}
