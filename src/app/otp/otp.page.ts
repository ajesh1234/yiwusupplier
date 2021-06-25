import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams,MenuController,ModalController, IonInput, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';

declare var $: any;
declare var SMSReceive: any;

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  @ViewChild('input1', { static: false }) input1: IonInput;
  @ViewChild('input2', { static: false }) input2: IonInput;
  @ViewChild('input3', { static: false }) input3: IonInput;
  @ViewChild('input4', { static: false }) input4: IonInput;
  public verificationForm: FormGroup;
  email:any='';
  constructor(public navParams:NavParams,public modalController:ModalController,public componentService: ComponentService, public navCtrl: NavController, public menu: MenuController, public formBuilder: FormBuilder, public api: ApiService) {
    this.menu.enable(false);
    this.email = this.navParams.get('email');
    this.verificationForm = this.formBuilder.group({
      input1: ['', Validators.compose([Validators.required])],
      input2: ['', Validators.compose([Validators.required])],
      input3: ['', Validators.compose([Validators.required])],
      input4: ['', Validators.compose([Validators.required])],
    });
    var that = this;
    $('body').on('keyup', 'ion-input.phone-input', function (event) {
      var key = event.keyCode || event.charCode;
      console.log(key)
      var inputs = $('ion-input.phone-input');
      if (key == 8 || key == 46) {
        var indexNum = inputs.index(this);
        console.log(indexNum, "innn")
        if (indexNum != 0) {

          if (indexNum == 3) {
            that.verificationForm.controls.input4.setValue('');
            that.input3.setFocus();
            that.verificationForm.controls.input3.setValue('');
          }
          if (indexNum == 2) {
            that.verificationForm.controls.input3.setValue('');
            that.input2.setFocus();
            that.verificationForm.controls.input2.setValue('');
          }
          if (indexNum == 1) {
            that.verificationForm.controls.input2.setValue('');
            that.input1.setFocus();
            that.verificationForm.controls.input1.setValue('');
          }
          if (indexNum == 0) {
            that.verificationForm.controls.input1.setValue('');
          }
        }
      }

    });
 
  }

  ngOnInit() {
  }
  otpEnter(evt, val) {
    console.log('OTP', evt.value, val, evt);
    if (evt.value.length) {
      if (val == 1) {
        this.verificationForm.controls.input1.setValue(evt.value);
        this.input2.setFocus();
      } else if (val == 2) {
        this.verificationForm.controls.input2.setValue(evt.value);
        this.input3.setFocus();
      } else if (val == 3) {
        this.verificationForm.controls.input3.setValue(evt.value);
        this.input4.setFocus();
      } else if (val == 4) {
        this.verificationForm.controls.input4.setValue(evt.value);
        console.log("enter on 6")
        this.otpVerification(evt.value);
      }
    }
  }
  otpVerification(val) {
    if(!this.verificationForm.valid){
      this.verificationForm.markAllAsTouched();
      return false;
    }
    this.componentService.presentLoading();
    var data = {
      "emailotp": this.verificationForm.value.input1 + '' + this.verificationForm.value.input2 + '' + this.verificationForm.value.input3 + '' + val
    }
    this.api.post('/otpforgot', data).subscribe((res: any) => {
      console.log('res:- ', res);
      this.componentService.stopLoading();
      if (res.status == "200") {
        this.componentService.presentToast(res.message, 'success');
        this.modalController.dismiss();
        this.navCtrl.navigateRoot(['/resetpassword'], {
          queryParams: {
          email:this.email
          }})
      } else {
        this.componentService.presentToast(res.message, 'danger')
      }
    }, err => {
      this.componentService.stopLoading();
      console.log('login error:- ', err);
    });
  }
  resend_otp() {
    this.componentService.presentLoading();
    var data = {
      "email": this.email,
    }
    console.log(data, "data")
    this.api.post('/forgot', data).subscribe((res: any) => {
      console.log('res:- ', res);
      this.componentService.stopLoading();
      if (res.status == "200") {
        this.componentService.presentToast(res.message, 'success');
      } else {
        this.componentService.presentToast(res.message, 'danger')
      }
    }, err => {
      this.componentService.stopLoading();
      console.log('login error:- ', err);
    });
  }

}
