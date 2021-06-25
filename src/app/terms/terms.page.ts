import { Component, OnInit } from '@angular/core';
import { MenuController,NavController,NavParams, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';


@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {
  data:any='';
  val :any='';
  constructor(public navParams: NavParams,public componentService:ComponentService,public modalController:ModalController, public api :ApiService) {
    this.val = navParams.get('title');
    console.log(this.val )
    this.getTerms();
   }

  ngOnInit() {
  }
  async dismiss() {
    this.modalController.dismiss(null, undefined, 'terms');
     }

     getTerms(){
      //  this.componentService.presentLoading();
      var data = {
        val:this.val
       }
      this.api.post('/getPages', data).subscribe((res: any) => {
        // this.componentService.stopLoading();
        if(res.status == '200'){
          console.log(res);
          this.data = res.pagedata[0].details;
        }else{
          this.data = '';
        }
      })
    }
}
