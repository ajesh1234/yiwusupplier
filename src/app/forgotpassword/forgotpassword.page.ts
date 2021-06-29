import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { OtpPage } from '../otp/otp.page';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  public loginForm;


  constructor(public api: ApiService, public storageService: StorageService, public componentService: ComponentService, public modalController: ModalController, public menu: MenuController, public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({              
        email: ['', Validators.compose([Validators.required,
            Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)])]
    });
    this.menu.enable(false);
  }

  ngOnInit() {
  }
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  async otpPage() {
    const modal = await this.modalController.create({
      component: OtpPage,
      componentProps: {email: this.loginForm.value.email
      }
    });
    modal.onDidDismiss().then((detail) => {
      console.log("hhh", detail);
    });
    return await modal.present();
  }
  forgot() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return false;
    }
    this.componentService.presentLoading();
    var data = {
      "email": this.loginForm.value.email,
    }
    console.log(data, "data")
    this.api.post('/forgot', data).subscribe((res: any) => {
      console.log('res:- ', res);
      this.componentService.stopLoading();
      if (res.status == "200") {
        this.componentService.presentToast(res.message, 'success');
        this.otpPage();
      } else {
        this.componentService.presentToast(res.message, 'danger')
      }
    }, err => {
      this.componentService.stopLoading();
      console.log('login error:- ', err);
    });

  }

}
