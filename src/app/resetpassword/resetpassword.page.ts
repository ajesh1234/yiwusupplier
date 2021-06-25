import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { NavParams,MenuController,ModalController, IonInput, NavController } from '@ionic/angular';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage implements OnInit {
email:any='';
public resetForm: FormGroup;
noError:boolean;
  constructor(public navCtrl:NavController,public api :ApiService, public componentService :ComponentService,public route :ActivatedRoute, public formBuilder:FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params && params.email) {
        this.email = params.email;
      }
    })
    this.resetForm = this.formBuilder.group({
      password: ["", Validators.compose([Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{5,})$")])],
      confirmpassword: ["", Validators.compose([Validators.minLength(6),Validators.required])],
    }, { 
      validator: this.matchingPasswords('password', 'confirmpassword')
    });
   }

  ngOnInit() {
  }
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value && confirmPassword.value!='') {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
  resetpas(){
    if(!this.resetForm.valid){
      this.resetForm.markAllAsTouched();
      return false;
    }
    // if(this.noError){
    //   return false;
    // }
    this.componentService.presentLoading();
    var data = {
      "email": this.email,
      "password":this.resetForm.value.password
    }
    console.log(data, "data")
    this.api.post('/resetpass', data).subscribe((res: any) => {
      console.log('res:- ', res);
      this.componentService.stopLoading();
      if (res.status == "200") {
        this.componentService.presentToast(res.message, 'success');
        this.navCtrl.navigateRoot('/login');
      } else {
        this.componentService.presentToast(res.message, 'danger')
      }
    }, err => {
      this.componentService.stopLoading();
      console.log('login error:- ', err);
    });
  }
  comparePassword(){
    // console.log(this.signupForm.value.password, this.signupForm.value.confirmpassword)
    if (this.resetForm.value.password == this.resetForm.value.confirmpassword) {
    this.noError = false;
    }else{
      if(this.resetForm.value.confirmpassword !=''){
        this.noError = true;
      }
    }
  }
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.resetForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
