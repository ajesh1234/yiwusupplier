import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm;
  device_type: any = 'android';
  remember:boolean =false
  constructor(public componentService: ComponentService, public platform: Platform, public api: ApiService, public menu: MenuController, public navController: NavController, public formBuilder: FormBuilder, public storageService: StorageService) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])]
    });
    this.menu.enable(false);
    if (this.platform.is('ios')) {
      this.device_type = 'ios';
    }
   
  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    if(JSON.parse(localStorage.getItem('user') ) !=undefined && JSON.parse(localStorage.getItem('user') ) != null ){
      var user =  JSON.parse(localStorage.getItem('user') )
      console.log(user, "uu")
       this.loginForm.controls.email.setValue(user.email);
       this.loginForm.controls.password.setValue(user.password);
       this.remember =true;
     }
  }
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  login() {
    console.log(this.remember);   
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return false;
    }
    this.componentService.presentLoading();
    var data = {
      "email": this.loginForm.value.email,
      "password": this.loginForm.value.password,
      'user_type': 'supplier',
      'device_type': this.device_type,
    }
    console.log(data, "data");
    this.api.post('/login', data).subscribe((res: any) => {
      console.log('res:- ', res);
      this.componentService.stopLoading();
      if (res.status == "200") {
        if(this.remember){
          var saveData = {
            email: this.loginForm.value.email,
            password : this.loginForm.value.password
          };
          localStorage.setItem('user',JSON.stringify(saveData));
        }else{
          localStorage.removeItem('user');
        }      
        this.storageService.set('userData', res.user_info).then(resp => {
          this.menu.enable(true);
          this.componentService.presentToast(res.message, 'success')
          this.navController.navigateRoot(['/tabs/tab1']);
          this.loginForm.reset();
        });
      } else {
        this.componentService.presentToast(res.message, 'danger')
      }
    }, err => {
      this.componentService.stopLoading();
      console.log('login error:- ', err);
    });

  }

}
