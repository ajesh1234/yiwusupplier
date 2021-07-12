import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuController, NavController, ModalController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { TermsPage } from '../terms/terms.page';
import { IonicSelectableComponent } from 'ionic-selectable';
import { StorageService } from '../services/storage.service';

import { ProductcategoryPage } from '../productcategory/productcategory.page';
declare var $:any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signupForm: FormGroup;
  noError: boolean;
  getCountries: any = [];
  isSubmit:boolean=false;
  cat:any=[];
  imgUpload:any='';
  dcountry_code: any;
  device_type: any = 'android';  
  show:boolean=false;
  showService:boolean =false;
  categoryData: any = [];
  showLevel1 = null;
  showLevel2 = null;
  serviceshowLevel1 = null;
  serviceshowLevel2 = null;
  categoryArray: any = [];
  categoryDisplayArray: any = [];
  serviceData:any=[];
  serviceArray:any=[];
  imageArray:any=[];
  typeArray:any=['Product Supplier','Service Supplier','Product and Service Supplier']
  constructor(public storageService:StorageService,public navCtrl: NavController, public platform: Platform, public componentService: ComponentService, public modalController: ModalController, public api: ApiService, public formBuilder: FormBuilder, public menu: MenuController) {
    this.signupForm = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([
        Validators.required,
        Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/),        
        // Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z]+.[a-zA-Z0-9-.]+$"),
      ])],
      password: ["", Validators.compose([Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{5,})$")])],
      confirmpassword: ["", Validators.compose([ Validators.required])],
      // address: ["", Validators.compose([Validators.required])],
      country: ["", Validators.compose([Validators.required])],
      registration_no: ["", Validators.compose([Validators.required])],
      details: ["", Validators.compose([Validators.required])],
      type: ["", Validators.compose([Validators.required])],
      phonenumber: ['', Validators.compose([Validators.required,,Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')])],
      terms: [false, Validators.compose([Validators.required, Validators.pattern('true')])],
    }, {
      validator: this.matchingPasswords('password', 'confirmpassword')
    });
    this.menu.enable(false);
    if (this.platform.is('ios')) {
      this.device_type = 'ios';
    }
  }

  ngOnInit() {
    this.getCategories();
  }

  upload(evn) {
    console.log($("#fupload")[0].files);
    if($("#fupload")[0].files.length>5){
      this.componentService.presentToast('Upload maximum 5photos/5 videos', 'danger');
      return false;
    }
    for(var i = 0 ; i < $("#fupload")[0].files.length; i++){
      this.imageArray.push($("#fupload")[0].files[i]);
    }
    console.log(this.imageArray ,"img");
    // this.imgUpload = $("#fupload")[0].files[0];

  }
  delete(i){
    this.imageArray.splice(i, 1);
  }
  selectOption(){
    console.log(this.signupForm.value.type);
    this.categoryArray = [];
    this.categoryDisplayArray = [];
    this.serviceArray = [];
    if(this.signupForm.value.type == 'Product Supplier'){
      this.showService =false;
    }
    if(this.signupForm.value.type == 'Service Supplier'){
      this.show =false;
    }    
    this.getCategories();
  }
  //Method for country code while changing
  CountryChange(event: { component: IonicSelectableComponent, value: any }) {
    console.log(event.value);
    // this.country_code = event.value.code;
    var dict = {
      country_name: event.value.country_name,
      country_code: event.value.country_code
    }
    this.dcountry_code = dict;
    this.signupForm.controls.country.setValue(dict);
    console.log(this.signupForm.value);
  };

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value && confirmPassword.value !='') {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
  
  signup() {
    this.isSubmit = true; 
    console.log('enter', this.signupForm.value)
    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      return false;
    }
  
    var type; 
    if(this.signupForm.value.type == 'Product Supplier'){
      if(this.categoryArray.length == 0){
        this.componentService.presentToast('Please select product categories', 'danger');
        return false;
      }
     type = 'product';
    }else if(this.signupForm.value.type == 'Service Supplier'){
      if(this.serviceArray.length == 0){
        this.componentService.presentToast('Please select service categories', 'danger');
        return false;
      }
      type = 'services';
    }else{
      type = 'both';
      if(this.categoryArray.length == 0 || this.serviceArray.length == 0 ){
        this.componentService.presentToast('Please select product and service categories', 'danger');
        return false;
      }
    }  
    this.componentService.presentLoading();
    var formData = new FormData();
    console.log(this.imageArray)
    if(this.imageArray.length>0){
      this.imageArray.forEach((data) => {
        formData.append('image[]', data);
      });
    }  
    formData.append('vendor','1');
    formData.append('device_type',this.device_type);    
    formData.append('phone',this.signupForm.value.phonenumber);
    formData.append('name', this.signupForm.value.name);
    formData.append('email', this.signupForm.value.email);
    formData.append('address', this.signupForm.value.address);
    formData.append('country', this.signupForm.value.country.country_name);
    formData.append('reg_number', this.signupForm.value.registration_no);
    formData.append('who_are_you', type);
    formData.append('shop_message', this.signupForm.value.details);
    formData.append('password', this.signupForm.value.password);
    formData.append('confirmpassword', this.signupForm.value.confirmpassword);
    this.categoryArray.forEach((data) => {
      formData.append('product_categories[]', data);
    });
    this.serviceArray.forEach((data) => {
      formData.append('services_categories[]', data);
    });
    var headers = new Headers();
    headers.append('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
    var that = this;
    var url = '/register';
    $.ajax({
      url:  this.api.appUrl+ url,
      data: formData,
      processData: false,
      contentType: false,
      method: "post",
      success: function (res) {
        console.log(res)
         that.componentService.stopLoading();
        if (res['status'] == '200') {
          if(res.verification_email_sent == 1){
            that.isSubmit = false; 
            that.imageArray =[];
            that.componentService.presentToast(res.message, 'success')
            that.navCtrl.navigateRoot(['/tabs/login']);
            that.signupForm.reset();
         }else{
          that.storageService.set('userData', res.user_info).then(resp => {        
            that.isSubmit = false; 
            that.componentService.presentToast(res['message'],'success');
            that.imageArray ='';
            that.signupForm.reset();
            that.menu.enable(true);
            that.navCtrl.navigateRoot(['/tabs/tab1']);
          });
        }
        } else {
          that.isSubmit = false; 
          that.componentService.presentToast( res['message'], 'danger');
        }
      },
    });


  
    // var data = {
    //   "phone": this.productForm.value.phonenumber,
    //   "business_email": this.productForm.value.email,
    //   'name': this.productForm.value.name,
    //   'country': this.productForm.value.country.country_name,
    //   'message': this.productForm.value.message,
    //   'order_quantity': this.productForm.value.quantity,
    //   'unit': this.productForm.value.unit,
    //   'image': this.imgUpload,
    //   'product_id': this.proid
    // }
    // console.log(data, "data")
    // this.api.post('/inquireSubmitPost', data).subscribe((res: any) => {
    //   console.log('res:- ', res);
    //   this.componentService.stopLoading();
    //   if (res.status == "200") {
    //     this.componentService.presentToast(res.message, 'success');
    //     this.productForm.reset();
    //     this.dismiss();
    //   } else {
    //     this.componentService.presentToast(res.message, 'danger');
    //   }
    // }, err => {
    //   this.componentService.stopLoading();
    //   console.log('login error:- ', err);
    // });
  }
  checkLength() {
    console.log(this.signupForm.value.phonenumber)
  }

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  };
  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };
  toggleLevel2(idx, catName, subCatData) {

    if (this.isLevel2Shown(idx)) {
      // this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      // this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  };
  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };
  servicetoggleLevel1(idx) {
    if (this.serviceisLevel1Shown(idx)) {
      this.serviceshowLevel1 = null;
    } else {
      this.serviceshowLevel1 = idx;
    }
  };
  serviceisLevel1Shown(idx) {
    return this.serviceshowLevel1 === idx;
  };
  servicetoggleLevel2(idx, catName, subCatData) {

    if (this.serviceisLevel2Shown(idx)) {
      // this.showLevel1 = null;
      this.serviceshowLevel2 = null;
    } else {
      // this.showLevel1 = idx;
      this.serviceshowLevel2 = idx;
    }
  };
  serviceisLevel2Shown(idx) {
    return this.serviceshowLevel2 === idx;
  };
  remove(index, data){
    for(var i = 0; i <= this.categoryData.length; i++){
      if(data.type == 'main_cat##'){
        if(this.categoryData[i]?.id == data.id){
          this.categoryData[i].isChecked =false;
        }
      }else if(data.type == 'sub_cat##'){
        if(this.categoryData[i]?.sub_and_child_cat?.length>0){
          for(var sub_i = 0; sub_i <= this.categoryData[i].sub_and_child_cat.length; sub_i++){
            // console.log(this.categoryData[i].sub_and_child_cat[sub_i], data.id)
            if(this.categoryData[i]?.sub_and_child_cat[sub_i]?.id == data.id){
              this.categoryData[i].sub_and_child_cat[sub_i].isChecked =false;
            } 
          }
        }   
      }
    }
    // this.categoryArray.splice(index, 1);
    // this.categoryDisplayArray.splice(index, 1);
    console.log(this.categoryDisplayArray)
  }
  checkEvent(data, check, type) {
    // console.log(this.categoryData)
    console.log(data.id, check, type);
    if (this.categoryArray.length > 0) {
      var index = this.categoryArray.findIndex(x => x == type + data.id);
      console.log(index, "idndex")
      if (index > -1) {
        this.categoryArray.splice(index, 1);
        this.categoryDisplayArray.splice(index, 1);
      } else {
        this.categoryArray.push(type + data.id);
        this.categoryDisplayArray.push({
          id: data.id,
          name: data.name,
          type: type
        })
      }
    } else {
      this.categoryArray.push(type + data.id);
      this.categoryDisplayArray.push({
        id: data.id,
        name: data.name,
        type: type
      })
    }
    console.log(this.categoryArray, "array");
    console.log(this.categoryDisplayArray)
  }
  checkServiceEvent(data, check, type) {
    console.log(data.id, check, type);
    if (this.serviceArray.length > 0) {
      var index = this.serviceArray.findIndex(x => x == type + data.id);
      console.log(index, "idndex")
      if (index > -1) {
        this.serviceArray.splice(index, 1);
      } else {
        this.serviceArray.push(type + data.id);
      }
    } else {
      this.serviceArray.push(type + data.id);
    
    }
    console.log(this.serviceArray, "array");
  }
  getCategories() {
    var data = {}
    this.api.get('/getContent', data).subscribe((res: any) => {
      if (res.status == '200') {
        this.categoryData = res.product_categories;
        // if (this.cat.length == 0) {
          this.categoryData.forEach((ele, key) => {
            this.categoryData[key].isChecked = false;
            if (this.categoryData[key].sub_and_child_cat.length > 0) {
              this.categoryData[key].sub_and_child_cat.forEach((element, sub_key) => {
                this.categoryData[key].sub_and_child_cat[sub_key].isChecked = false;
                if (this.categoryData[key].sub_and_child_cat[sub_key].childs.length > 0) {
                  this.categoryData[key].sub_and_child_cat[sub_key].childs.forEach((element, child_key) => {
                    this.categoryData[key].sub_and_child_cat[sub_key].childs[child_key].isChecked = false;
                  });
                }
              });
            }
          });
         console.log(this.categoryData, "data");
         this.serviceData = res.service_categories;
         this.serviceData.forEach((ele, key) => {
          this.serviceData[key].isChecked = false;
          if (this.serviceData[key].sub_and_child_cat.length > 0) {
            this.serviceData[key].sub_and_child_cat.forEach((element, sub_key) => {
              this.serviceData[key].sub_and_child_cat[sub_key].isChecked = false;
              if (this.serviceData[key].sub_and_child_cat[sub_key].childs.length > 0) {
                this.serviceData[key].sub_and_child_cat[sub_key].childs.forEach((element, child_key) => {
                  this.serviceData[key].sub_and_child_cat[sub_key].childs[child_key].isChecked = false;
                });
              }
            });
          }
         })
         console.log(this.serviceData, "service data");

      }
    })
  }
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.signupForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  ionViewDidEnter() {
    this.getcountries();
  }
  getcountries() {
    var data = {}
    this.api.get('/getCountries', data).subscribe((res: any) => {
      console.log(res, "data")
      if (res.status == '200') {
        this.getCountries = res.countries;
        this.dcountry_code = {
          country_code: 'AF',
          country_name: 'Afghanistan'
        }
        this.signupForm.controls.country.setValue({
          country_code: 'AF',
          country_name: 'Afghanistan'
        });
      }
    })
  }
  showCheck(){
    this.show =! this.show;
  }
  showServieCheck(){
    this.showService =! this.showService;
  }
  async presencettModal(data) {
    const modal = await this.modalController.create({
      component: ProductcategoryPage,
      cssClass: 'filtermodal',
      id: "terms",
      componentProps: { 
        'title': this.signupForm.value.type,
        'cat' :JSON.stringify(this.cat)
      }
    });
    modal.onDidDismiss()
    .then((data) => {
      console.log(data, "iondd")
      this.cat  = data.data;
  });
    return await modal.present();
  }
  

  async presentModal(data) {
    const modal = await this.modalController.create({
      component: TermsPage,
      cssClass: 'filtermodal',
      id: "terms",
      componentProps: { 
        'title': data
      }
    });
    return await modal.present();
  }

}
