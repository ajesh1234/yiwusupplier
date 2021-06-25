import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab5PageRoutingModule } from './tab5-routing.module';
import { Tab5Page } from './tab5.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    RouterModule.forChild([{ path: '', component: Tab5Page }]),
    Tab5PageRoutingModule,
  ],
  declarations: [Tab5Page]
})
export class Tab5PageModule {}
