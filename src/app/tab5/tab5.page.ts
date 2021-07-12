import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IonicSelectableComponent } from 'ionic-selectable';
import { StorageService } from '../services/storage.service';
import { ComponentService } from '../services/component.service';
import { MenuController, NavController, AlertController, ActionSheetController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  profile: any = 'basicinfo';
  profile_picture: any = '';
  getCountries: any = [];
  userData: any;
  imageUpload: any = '';
  public basicinfoForm;
  public changepasswordForm;
  isSubmit:boolean=false;

  typeArray: any = ['Product Supplier', 'Service Supplier', 'Product and Service Supplier']
  constructor(public api: ApiService, public storageService: StorageService, public formBuilder: FormBuilder, private camera: Camera, public actionSheetController: ActionSheetController, public componentService: ComponentService) {
    this.basicinfoForm = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')])],
      email: ["", Validators.compose([
        Validators.required,
        Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/),        
      ]),
      ],
      address: ['', Validators.compose([Validators.required])],
      registration_no: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      details: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      //  city:  [''],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')])],
    });
    this.changepasswordForm = this.formBuilder.group({
      current_password: ["", Validators.compose([Validators.required])],
      new_password: ["", Validators.compose([Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{5,})$")])],
      confirm_password: ["", Validators.compose([Validators.required, Validators.minLength(6)])],
    }, {
      validator: this.matchingPasswords('new_password', 'confirm_password')
    });
    this.storageService.get('userData').then(res => {
      if (res != null && res != undefined) {
        this.userData = res;
        this.basicinfoForm.patchValue({
          name: this.userData.name,
          email: this.userData.email,
          // address: this.userData.address,
          phone: this.userData.phone,
          registration_no: this.userData.reg_number,
          details: this.userData.shop_details,
        });
        if (this.userData.address != '' && this.userData.address != null && this.userData.address != undefined) {
          this.basicinfoForm.controls.address.setValue(this.userData.address);
        } 
        if (this.userData.who_are_you != '' && this.userData.who_are_you != null) {
          if (this.userData.who_are_you == 'Product') {
            this.basicinfoForm.controls.type.setValue("Product Supplier");
          } else if (this.userData.who_are_you == 'Service') {
            this.basicinfoForm.controls.type.setValue("Service Supplier");
          } else {
            this.basicinfoForm.controls.type.setValue("Product and Service Supplier");
          }
          console.log(this.basicinfoForm.value);
        }
      }
    })
    this.getcountries();

    this.componentService.eventsubscribe('user:created', (data: any) => {
      this.storageService.get('userData').then(res => {
        console.log(res);
        if (res != null && res != undefined) {
          this.storageService.get('userData').then(res => {
            if (res != null && res != undefined) {
              this.userData = res;
              // console.log(this.userData)
        
            }
          })
        }
      })
    });
  }

  ngOnInit() {
  }
  selectOption() {
    // this.categoryArray = [];
    // this.categoryDisplayArray = [];
    // this.serviceArray = [];
    // if(this.signupForm.value.type == 'Product Supplier'){
    //   this.showService =false;
    // }
    // if(this.signupForm.value.type == 'Service Supplier'){
    //   this.show =false;
    // }    
    // this.getCategories();
  }
  CountryChange(event: { component: IonicSelectableComponent, value: any }) {
    console.log(event.value);
    // this.country_code = event.value.code;
    var dict = {
      country_name: event.value.country_name,
      country_code: event.value.country_code
    }
    this.basicinfoForm.controls.country.setValue(dict);
  }; 
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
  getcountries() {
    var data = {}
    console.log(data, "data")
    this.api.get('/getCountries', data).subscribe((res: any) => {
      if (res.status == '200') {
        this.getCountries = res.countries;
        var dict = {
          country_name: this.userData.country
        }
        this.basicinfoForm.controls.country.setValue(dict);
      }
    })
  }
  editProfile() {
    this.isSubmit = true; 

    if (!this.basicinfoForm.valid) {
      this.basicinfoForm.markAllAsTouched();
      return false;
    }
    this.componentService.presentLoading();
    var data = {
      "phone": this.basicinfoForm.value.phone,
      "email": this.basicinfoForm.value.email,
      'name': this.basicinfoForm.value.name,
      'country': this.basicinfoForm.value.country.country_name,
      'zip': this.basicinfoForm.value.zip,
      'city': this.basicinfoForm.value.city,
      'address': this.basicinfoForm.value.address,
      'fax': this.basicinfoForm.value.address,
      'token': this.userData.api_token
    }
    this.api.post('/profile', data).subscribe((res: any) => {
      console.log('res:- ', res);
      this.componentService.stopLoading();
      if (res.status == "200") {
    this.isSubmit = false; 

        this.storageService.set('userData', res.user_info).then(res => {
          this.componentService.eventpublish('user:created', Date.now());
        });
        this.componentService.presentToast(res.message, 'success');
      } else {
    this.isSubmit = false; 

        this.componentService.presentToast(res.message, 'danger');
      }
    }, err => {
      this.componentService.stopLoading();
      console.log('login error:- ', err);
    });


  }
  changePassword() {
    if (!this.changepasswordForm.valid) {
      this.changepasswordForm.markAllAsTouched();
      return false;
    }
    this.componentService.presentLoading();
    var data = {
      "new_password": this.changepasswordForm.value.new_password,
      "old_password": this.changepasswordForm.value.current_password,
      'token': this.userData.api_token
    }
    this.api.post('/reset', data).subscribe((res: any) => {
      console.log('res:- ', res);
      this.componentService.stopLoading();
      if (res.status == "200") {
        this.componentService.presentToast(res.message, 'success');
      } else {
        this.componentService.presentToast(res.message, 'danger');
      }
    }, err => {
      this.componentService.stopLoading();
      console.log('login error:- ', err);
    });

  }
  isControlHasErrorChange(controlName: string, validationType: string): boolean {
    const control = this.changepasswordForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.basicinfoForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  segmentChanged(evn) {
    console.log(evn.target.value, "event");
    if (evn.target.value == 'cpassword ') {
      // this.changepasswordForm.reset();
    } else {
      // this.basicinfoForm.reset();
    }
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.openCamera(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  openCamera(sourceType) {
    const options: CameraOptions = {
      quality: 60,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.profile_picture = 'data:image/jpeg;base64,' + imageData;
      var data = {
        img: this.profile_picture,
        token: this.userData.api_token
      }
      this.api.post('/editPicture', data).subscribe((res: any) => {
        console.log('res:- ', res);
        this.componentService.stopLoading();
        if (res.status == "200") {
          this.componentService.presentToast(res.message, 'success');
          this.storageService.set('userData', res.user_info).then(res => {
            this.componentService.eventpublish('user:created', Date.now());
          });
        } else {
          this.componentService.stopLoading();
          this.componentService.presentToast(res.message, 'danger');
        }
      }, (err) => {
        this.componentService.stopLoading();
      });
    })
  }

}
