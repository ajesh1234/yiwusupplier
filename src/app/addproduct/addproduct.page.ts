import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuController, NavController, ModalController, Platform, ActionSheetController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { StorageService } from '../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';

declare var $: any;
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {
  public productForm: FormGroup;
  pro_picture: any = '';
  categoryData: any = [];
  imageArray: any = [];
  subCategoryData: any = [];
  childCategoryData: any = [];
  checklink: any = '';
  whole_sell_qty: any = [];
  tagArray: any = [];
  priceArray: any = [];
  unitArray: any = [
    'Custom Unit',
    'Gram',
    'Kilogram',
    'Litre',
    'Pound',
    'Pair',
    'Acre/Acres',
    'Ampere/Ampers',
    'Bag/Bags',
    'Box/Boxes',
    'Barrel/Barrels',
    'Blade/Blade',
    'Bushel/Bushels',
    'Carat/Carts',
    'Case/Cases',
    'Piece/Pieces',
    'Set/Sets',
    'Meter/Meters',
    'Roll/Rolls',
    'Ton/Tons',
    'Unit/Units',
    'Cubic Meter/Cubic Meters',
    'Kilogram/Kilograms',
    'Nothing'
  ]
  payment_terms: any = []
  whole_sell_price: any = [];
  sampleArray = [
    'Free Sample are Available',
    'Within certain price rang free sample are available',
    'Free Sample available with shipping and tax paid by',
    'Sample Costs shipping and taxes have to be paid by the',
    'If order is confirmed we will reimbuse the sample costs'
  ]
  isDisplay: boolean = true;
  seoCheckModel: boolean = true;
  export_market:any = [
    {value: 'Asia',isChecked:false},
    {value:'Central Asia',isChecked:false},
    {value:'South America',isChecked:false},
    {value:'Western Europe',isChecked:false},
    {value:'Africa',isChecked:false},
    {value:'Australia',isChecked:false},
    {value:'North America',isChecked:false},
    {value:'East Europe',isChecked:false},
    {value:'Middle East',isChecked:false},
  ]
  exportArray: any = [];
  userData: any = '';
  cod:any;
  cid:any;
  lic:any;
  tt:any;
  other:any;
  pro_picture_edit:any='';
  data: any = '';
  gallery:any='';
  img:any='';
  constructor(public router: Router, public storageService: StorageService, public camera: Camera, public actionSheetController: ActionSheetController, public navCtrl: NavController, public platform: Platform, public componentService: ComponentService, public modalController: ModalController, public api: ApiService, public formBuilder: FormBuilder, public menu: MenuController) {
    this.productForm = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required])],
      sku: ["", Validators.compose([Validators.required])],
      category_id: ["", Validators.compose([Validators.required])],
      subcategory_id: [""],
      child_id: [""],
      seo_check: [""],
      youtube: [""],
      measure:[""],
      unit_measurement: [""],
      unit_val: [""],
      moq_val: [""],
      price_val: [""],
      pro_inventory: [""],
      minimum_quantity: [""],
      weight: [""],
      weight_unit: ["Kg"],
      length: [""],
      width: [""],
      height: [""],
      cubic_meter: [""],
      sample_check: ["no"],
      simple_policy: [""],
      policy: [""],
      meta_description: [""],
      meta: [""]
    })
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.data = state.data ? state.data : '';
      this.img = state.img ? state.img : ''; 
       this.gallery = state.gallery ? state.gallery : '';
      console.log(this.data)
    };
    this.storageService.get('userData').then(res => {
      if (res != null && res != undefined) {
        this.userData = res;
      }
    });
    this.productForm.controls.sku.setValue(this.data.sku);
    this.productForm.controls.name.setValue(this.data.name);
    this.productForm.controls.category_id.setValue(this.data.category_id);
    if(this.data.measure!=null && this.data.measure!=''){
      this.productForm.controls.measure.setValue(this.data.measure);
    }
    if (this.data.thumbnail != null && this.data.thumbnail != '') {
      this.pro_picture_edit = this.data.thumbnail;
      console.log(this.img+this.pro_picture_edit)
    }
    if (this.data.youtube != null && this.data.youtube != '') {
      this.productForm.controls.youtube.setValue(this.data.youtube);
    }
    console.log(this.seoCheckModel,'+++', this.data.meta_description)
    
    if (this.data.meta_description != null && this.data.meta_description != '') {
      this.seoCheckModel = true;
      this.isDisplay = true;
      this.productForm.controls.meta_description.setValue(this.data.meta_description);
      this.tagArray = this.data.meta_tag;
    }
    if (this.data.sample_check != null && this.data.sample_check != '') {
      this.productForm.controls.sample_check.setValue(this.data.sample_check);
    }
    console.log(this.data)
    if(this.data !=''){
      this.whole_sell_qty = this.data.whole_sell_qty;
      this.whole_sell_price =this.data.whole_sell_discount;
      if(this.data.whole_sell_qty.length>0){
        for(var i=0; i < this.data.whole_sell_qty.length; i++){
          // for(var j=0; j < this.data.whole_sell_discount.length; j++){
            var data = {
              qty:  this.data.whole_sell_qty[i],
              price:this.data.whole_sell_discount[i]
            }
            this.priceArray.push(data);
          // }
        }
        console.log(this.priceArray)
      }
      if(this.data.minimum_quantity!= null && this.data.minimum_quantity != ''){
        this.productForm.controls.minimum_quantity.setValue(this.data.minimum_quantity);
      }
      if(this.data.weight!= null && this.data.weight != ''){
        this.productForm.controls.weight.setValue(this.data.weight);
      }
      if(this.data.length!= null && this.data.length != ''){
        this.productForm.controls.length.setValue(this.data.length);
      }
      if(this.data.width!= null && this.data.width != ''){
        this.productForm.controls.width.setValue(this.data.width);
      }
      if(this.data.height!= null && this.data.height != ''){
        this.productForm.controls.height.setValue(this.data.height);
      }
      if(this.data.cubic_meter!= null && this.data.cubic_meter != ''){
        this.productForm.controls.cubic_meter.setValue(this.data.cubic_meter);
      }
      if(this.data.cubic_meter!= null && this.data.cubic_meter != ''){
        this.productForm.controls.cubic_meter.setValue(this.data.cubic_meter);
      }
      if(this.data.sample_policy!= null && this.data.sample_policy != ''){
        this.productForm.controls.simple_policy.setValue(this.data.sample_policy);
      } 
      if(this.data.policy!= null && this.data.policy != ''){
        this.productForm.controls.policy.setValue(this.data.policy);
      }          
      if(this.data.payment_term!= null && this.data.payment_term != ''){
        console.log(this.data.payment_term.split(","));
        this.payment_terms = this.data.payment_term.split(",");
        var index = this.payment_terms.findIndex(x => x == 'Cash on Delivery (COD)');
        if (index > -1) {
          this.cod = true;
        } 
        var index1 = this.payment_terms.findIndex(x => x == 'Cash in Advance (CID)');
        if (index1 > -1) {
          this.cid = true;
        } 
        var index2 = this.payment_terms.findIndex(x => x == 'Letter of Credit (L/C)');
        if (index2 > -1) {
          this.lic = true;
        } 
        var index3 = this.payment_terms.findIndex(x => x == 'Telegraphic Transfer (T/T)');
        if (index3 > -1) {
          this.tt = true;
        } 
        var index4 = this.payment_terms.findIndex(x => x == 'Other');
        if (index4 > -1) {
          this.other = true;
        }  
      }
      if(this.data.export_market!= null && this.data.export_market != ''){
        console.log(this.data.export_market.split(","));
        var newexport_market = this.data.export_market.split(",");
        this.exportArray = this.data.export_market.split(",");
        for(var i =0 ;i <this.export_market.length; i++){
          var index = newexport_market.findIndex(x => x == this.export_market[i].value);
          if (index > -1) {
            this.export_market[i].isChecked = true;
          } 
        }
      } 
    }
   }


  ngOnInit() {
    // console.log(Math.random().toString(10));
    this.productForm.controls.sku.setValue(this.stringGen(10));
    this.getCategories();
  }
  checkSeo(evn) {
    console.log(evn.currentTarget.checked)
    if (evn.currentTarget.checked) {
      this.productForm.controls.seo_check.setValue(1);
      // this.isDisplay = true;
    } else {
      this.productForm.controls.seo_check.setValue(0);
      // this.isDisplay = false;
    }
  }
  delete(i){
    this.imageArray.splice(i, 1);
  }
  addTag() {
    if (this.productForm.value.meta != '') {
      if (this.tagArray.length == 0) {
        this.tagArray.push(this.productForm.value.meta);
        this.productForm.controls.meta.setValue('');
      } else {
        var index = this.tagArray.findIndex(x => x == this.productForm.value.meta);
        if (index > -1) {
          // this.tagArray.splice(index, 1);
        } else {
          this.tagArray.push(this.productForm.value.meta);
          this.productForm.controls.meta.setValue('');
        }
      }
      console.log(this.tagArray, "taggg")
    }
  }
  removeTag(index) {
    this.tagArray.splice(index, 1);
  }
  stringGen(len) {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  }


  add() {
    console.log(this.productForm.value.moq_val, this.productForm.value.price_val);
    if (this.productForm.value.moq_val != '' && this.productForm.value.price_val != '') {
      this.whole_sell_qty.push(this.productForm.value.moq_val);
      this.whole_sell_price.push(this.productForm.value.price_val);
      var data = {
        qty: this.productForm.value.moq_val,
        price: this.productForm.value.price_val
      }
      this.priceArray.push(data);
      this.productForm.controls.moq_val.setValue('');
      this.productForm.controls.price_val.setValue('');
    }
    // else {
    //   this.componentService.presentToast('Please enter', 'danger')
    // }
  }
  remove(index) {
    this.priceArray.splice(index, 1)
    this.whole_sell_qty.splice(index, 1)
    this.whole_sell_price.splice(index, 1)
  }
  validateYouTubeUrl(element: any) {
    if (element !== undefined || element !== '') {
      console.log('URL-->', element);
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      const match = element.match(regExp);
      if (match && match[2].length === 11) {
        console.log('MATCH YOUTUBE', match[2]);
        return { type: 'youtube', vidId: match[2] };
      } else {
        return { type: 'video' };
      }
    }
  }
  checkLink() {
    this.checklink = this.validateYouTubeUrl(this.productForm.value.youtube);
    if (this.checklink != 'youtube') {
      this.componentService.presentToast('Please add valid youtube link.', 'danger');
      return false;
    }
  }
  toggle() {
    this.isDisplay = !this.isDisplay
  }
  changeRadioStatus(evn, val) {
    console.log(evn.currentTarget.checked, val);
    if (this.payment_terms.length == 0) {
      this.payment_terms.push(val);
    } else {
      var index = this.payment_terms.findIndex(x => x == val);
      if (index > -1) {
        this.payment_terms.splice(index, 1);
      } else {
        this.payment_terms.push(val);
      }
    }
    console.log(this.payment_terms, "payment");
  }
  changeExport(evn, val) {
    if (this.exportArray.length == 0) {
      this.exportArray.push(val);
    } else {
      var index = this.exportArray.findIndex(x => x == val);
      if (index > -1) {
        this.exportArray.splice(index, 1);
      } else {
        this.exportArray.push(val);
      }
    }
    console.log(this.exportArray, "export");
  }
  selectCat() {
    console.log(this.productForm.value.category_id, this.categoryData);
    var index = this.categoryData.findIndex(x => x.id == this.productForm.value.category_id);
    console.log(index, this.categoryData[index]);
    this.subCategoryData = this.categoryData[index].sub_and_child_cat;
  }
  selectSubCat() {
    console.log(this.subCategoryData, this.productForm.value.subcategory_id)
    var index = this.subCategoryData.findIndex(x => x.id == this.productForm.value.subcategory_id);
    console.log(index, this.subCategoryData[index]);
    this.childCategoryData = this.subCategoryData[index].childs;
  }
  getCategories() {
    var data = {}
    this.api.get('/getContent', data).subscribe((res: any) => {
      if (res.status == '200') {
        this.categoryData = res.product_categories;
        if (this.data != '') {
          this.selectCat();
          if (this.data.subcategory_id != null && this.data.subcategory_id != '') {
            this.productForm.controls.subcategory_id.setValue(this.data.subcategory_id);
            this.selectSubCat();
          }
          if (this.data.childcategory_id != null && this.data.childcategory_id != '') {
            this.productForm.controls.child_id.setValue(this.data.childcategory_id);
          }
        }
        console.log(this.categoryData, "data");
      }
    })
  }
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.productForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
  removeGallery(val, index){
    var data = {
      token :this.userData.api_token,
      gallery_id: val.id
     }
    console.log(data, "data");
    this.api.post('/gallery_delete', data).subscribe((res: any) => {
      console.log(res)
      if(res.status == '200'){
        this.componentService.eventpublish('product:created', Date.now());
        this.data.galleries.splice(index, 1);
      }else{
      this.componentService.presentToast(res.message , 'danger');
      }
    })
  }
  upload(evn) {
    // console.log($("#fupload")[0].files.length, this.data.galleries.length);
    if(this.data != '' && this.data.galleries && this.data.galleries !=undefined && this.data.galleries != null && this.data.galleries.length>0){
    var length  = this.data.galleries.length + this.imageArray.length +$("#fupload")[0].files.length;
    console.log(length)
    if(length > 5){
      this.componentService.presentToast('Upload maximum 5photos/videos', 'danger');
      return false;
    }
    }
    if ($("#fupload")[0].files.length > 5) {
      this.componentService.presentToast('Upload maximum 5photos/videos', 'danger');
      return false;
    }
    for (var i = 0; i < $("#fupload")[0].files.length; i++) {
      this.imageArray.push($("#fupload")[0].files[i]);
    }
    console.log(this.imageArray, "img");
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
      this.pro_picture = 'data:image/jpeg;base64,' + imageData;

    })
  }
  editProduct() {
    var formData = new FormData();
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return false;
    }
    if (this.productForm.value.seo_check == 1) {
      if (this.productForm.value.meta == '' && this.tagArray.length == 0) {
        this.componentService.presentToast('Please enter meta tag.', 'danger');
        return false;
      } else if (this.productForm.value.meta_description == '') {
        this.componentService.presentToast('Please enter meta description.', 'danger');
      } else {
        if (this.tagArray.length == 0) {
          this.tagArray.push(this.productForm.value.meta);       
        }
        this.tagArray.forEach((data) => {
          formData.append('meta_tag[]', data);
        });

      }
    }
    this.componentService.presentLoading();
    for (const key of Object.keys(this.productForm.controls)) {
      formData.append(key, this.productForm.controls[key].value);
    }
    // return false;
    if (this.priceArray.length == 0) {
      if (this.productForm.value.moq_val != '' && this.productForm.value.price_val != '') {
        this.whole_sell_price.push(this.productForm.value.price_val);
        this.whole_sell_qty.push(this.productForm.value.moq_val);
      }
    }
    console.log(this.imageArray)
    if (this.imageArray.length > 0) {
      this.imageArray.forEach((data) => {
        formData.append('gallery[]', data);
      });
    }
    formData.append('type', 'Physical');
    formData.append('product_id', this.data.id);
    formData.append('product_condition', '2');
    formData.append('token', this.userData.api_token);
    if (this.whole_sell_price.length > 0) {
      this.whole_sell_price.forEach((data) => {
        formData.append('whole_sell_discount[]', data);
      });
    }
    if (this.whole_sell_qty.length > 0) {
      this.whole_sell_qty.forEach((data) => {
        formData.append('whole_sell_qty[]', data);
      });
    }
    if (this.payment_terms.length > 0) {
      this.payment_terms.forEach((data) => {
        formData.append('payment_terms[]', data);
      });
    }
    if (this.exportArray.length > 0) {
      this.exportArray.forEach((data) => {
        formData.append('export_market[]', data);
      });
    }
    var headers = new Headers();
    headers.append('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
    var that = this;
    var url = '/product_update';
    $.ajax({
      url: this.api.appUrl + url,
      data: formData,
      processData: false,
      contentType: false,
      method: "post",
      success: function (res) {
        console.log(res)
        that.componentService.stopLoading();
        if (res['status'] == '200') {
          that.componentService.presentToast(res['message'], 'success');

                   that.componentService.eventpublish('product:created', Date.now());
        } else {
          that.componentService.presentToast(res['message'], 'danger');
        }
      },
    }, err => {
      this.componentService.stopLoading();
    });
  }
  addProduct() {
    var formData = new FormData();
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return false;
    }
    if(this.pro_picture =='' || this.pro_picture == null){
      this.componentService.presentToast('Please select photo.', 'danger');
      return false;
    }
    if (this.productForm.value.seo_check == 1) {
      if (this.productForm.value.meta == '' && this.tagArray.length == 0) {
        this.componentService.presentToast('Please enter meta tag.', 'danger');
        return false;
      } else if (this.productForm.value.meta_description == '') {
        this.componentService.presentToast('Please enter meta description.', 'danger');
      } else {
        if (this.tagArray.length == 0) {
          this.tagArray.push(this.productForm.value.meta);
        }
        this.tagArray.forEach((data) => {
          formData.append('meta_tag[]', data);
        });
      }
    }
    this.componentService.presentLoading();
    for (const key of Object.keys(this.productForm.controls)) {
      formData.append(key, this.productForm.controls[key].value);
    }
    // return false;
    formData.append('photo', this.pro_picture);      

    if (this.priceArray.length == 0) {
      if (this.productForm.value.moq_val != '' && this.productForm.value.price_val != '') {
        this.whole_sell_price.push(this.productForm.value.price_val);
        this.whole_sell_qty.push(this.productForm.value.moq_val);
      }
    }
    console.log(this.imageArray)
    if (this.imageArray.length > 0) {
      this.imageArray.forEach((data) => {
        formData.append('gallery[]', data);
      });
    }
    formData.append('type', 'Physical');
    formData.append('product_condition', '2');
    formData.append('token', this.userData.api_token);
    if (this.whole_sell_price.length > 0) {
      this.whole_sell_price.forEach((data) => {
        formData.append('whole_sell_discount[]', data);
      });
    }
    if (this.whole_sell_qty.length > 0) {
      this.whole_sell_qty.forEach((data) => {
        formData.append('whole_sell_qty[]', data);
      });
    }
    if (this.payment_terms.length > 0) {
      this.payment_terms.forEach((data) => {
        formData.append('payment_terms[]', data);
      });
    }
    if (this.exportArray.length > 0) {
      this.exportArray.forEach((data) => {
        formData.append('export_market[]', data);
      });
    }
    var headers = new Headers();
    headers.append('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
    var that = this;
    var url = '/add_product';
    $.ajax({
      url: this.api.appUrl + url,
      data: formData,
      processData: false,
      contentType: false,
      method: "post",
      success: function (res) {
        console.log(res)
        that.componentService.stopLoading();
        if (res['status'] == '200') {
          that.componentService.presentToast(res['message'], 'success');
          that.imageArray = [];
          that.payment_terms = [];
          that.exportArray = [];
          that.whole_sell_price = [];
          that.whole_sell_qty = [];
          that.priceArray = [];
          that.tagArray = [];
          that.productForm.reset();
          $('ion-checkbox').removeAttr('checked');
          that.pro_picture ='';
          that.pro_picture_edit ='';
          that.navCtrl.navigateBack('/tabs/tab3')
          that.componentService.eventpublish('product:created', Date.now());
        } else {
          that.componentService.presentToast(res['message'], 'danger');
        }
      },
    }, err => {
      this.componentService.stopLoading();
    });
  }
}
