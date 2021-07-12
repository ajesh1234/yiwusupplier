import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { NavParams, AlertController, ModalController, IonInput, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  getValue: any = '';
  catData: any = '';
  noData: boolean;
  productData: any = [];
  update: any = '';
  imageUrl: any = '';
  galleryurl:any='';
  pageNum: any = 1;
  public totalPages = 0;
  getChild: any = '';
  userData: any = '';
  getSupplier: any = '';
  searchVal: any = '';
  searchText: any = '';
  show: boolean = false;
  constructor(public alertController:AlertController, public modalController: ModalController, public storageService: StorageService, public navCtrl: NavController, public route: ActivatedRoute, public router: Router, public api: ApiService, public componentService: ComponentService) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.catData = state.catData ? JSON.parse(state.catData) : '';
      this.getValue = state.item ? JSON.parse(state.item) : '';
      this.getChild = state.child ? JSON.parse(state.child) : '';
      this.searchVal = state.search ? state.search : '';
    }
    this.storageService.get('userData').then(res => {
      console.log(res);
      if (res != null && res != undefined) {
        this.userData = res;
        this.productData = [];
        this.check();
      }
    });
    
    // setTimeout(() => {
    //   this.productData = [];
    //     this.check();
    //   }, 300)

    this.componentService.eventsubscribe('product:created', (data: any) => {
      console.log(data, "ddd")
      this.pageNum = 1;
      this.totalPages = 0;
      if (data.catData) {
        this.catData = JSON.parse(data.catData);
      } else {
        this.catData = '';
      }
      if (data.item) {
        this.getValue = JSON.parse(data.item);
      } else {
        this.getValue = '';
      }
      if (data.child) {
        this.getChild = JSON.parse(data.child);
      } else {
        this.getChild = '';
      }
      this.productData = [];
      console.log("enter")
      this.check()
    });
  }


  goTo(data) {
    console.log(data ,"data")
    this.navCtrl.navigateForward(['/productdetails'], { state: { slug: data.slug } })
  }
  FilterItems() {
    this.productData = [];
    console.log(this.searchText)
    var data = {
      skip: this.pageNum,
      token: this.userData.api_token,
      search: this.searchText,
      type:'supplier'
    }
    this.api.getProductBySearch(data).subscribe(res => {
      console.log(res, "cat");
      if (res.status == '200') {
        if (res.prods.length != 0) {
          this.noData = false;
          this.imageUrl = res.imgurl + '/';
          res.prods.forEach((datas, key) => {
            this.productData.push(datas);
          })
          console.log(this.productData);

        } else {
          this.noData = true;

        }

        this.totalPages = Math.ceil(parseInt(res.totalprods) / 10);

      }

    })
  }
  showSeach() {
    if (this.show) {
      this.show = false;
    } else {
      this.show = true;
    }
  }
  getProductsByCat() {
    var data = {
      catslug: this.catData.slug,
      skip: this.pageNum,
      token: this.userData.api_token,
      type: 'supplier',
      search: this.searchText,
    }
    this.api.getProductsByCatIds(data).subscribe(res => {
      if (res.status == '200') {
        if (res.prods.length != 0) {
          this.noData = false;
          this.imageUrl = res.imgurl + '/';
          // console.log(this.imageUrl);
          res.prods.forEach((datas, key) => {
            this.productData.push(datas);
          })
        } else {
          this.noData = true;
          this.productData =[];
        }

        this.totalPages = Math.ceil(parseInt(res.totalprods) / 10);

      }

    })
  }
  getProductsByChild() {
    var data = {
      catslug: this.catData.slug,
      subslug: this.getValue.slug,
      childcatslug: this.getChild.slug,
      skip: this.pageNum,
      token: this.userData.api_token,
      type:'supplier',
      search: this.searchText
    }
    this.api.getProductsByChildIds(data).subscribe(res => {
      // console.log(res, "cat");
      // this.componentService.stopLoading();
      if (res.status == '200') {
        if (res.prods.length != 0) {
          this.noData = false;
          this.imageUrl = res.imgurl + '/';
          console.log(this.imageUrl);
          res.prods.forEach((datas, key) => {
            this.productData.push(datas);
          })
        } else {
          this.noData = true;
          this.productData =[];
        }

        this.totalPages = Math.ceil(parseInt(res.totalprods) / 10);
      }

    })
  }
  getProductsBysubCat() {
    var data = {
      catslug: this.catData.slug,
      subslug: this.getValue.slug,
      skip: this.pageNum,
      token: this.userData.api_token,
      type:'supplier',
      search: this.searchText,
    }
    this.api.getProductsByIds(data).subscribe(res => {
      if (res.status == '200') {
        if (res.prods.length != 0) {
          this.noData = false;
          this.imageUrl = res.imgurl + '/';
          res.prods.forEach((datas, key) => {
            this.productData.push(datas);
          })
        } else {
          this.noData = true;
        }
        this.totalPages = Math.ceil(parseInt(res.totalprods) / 10);
      }

    })
  }
  search(){
    this.productData = [];
    this.check();
  }
  edit(data){
    this.navCtrl.navigateForward(['/addproduct'],{state:{data:data,  img: this.imageUrl,gallery: this.galleryurl }})
  }
  check(){
    if (this.getValue !== '' && this.catData != '' && this.getChild != '') {
      console.log("products based on child");
      this.getProductsByChild()
    } else if (this.getValue !== '' && this.catData != '') {
      console.log("products based on sub category");
      this.getProductsBysubCat()
    } else if (this.getValue == '' && this.catData != '') {
      console.log("products based on category");
      this.getProductsByCat()
    }
    if (this.getValue == '' && this.catData == '' && this.getChild == '' && this.searchText=='') {
      console.log("products lsitsting");
      this.getProducts();
    }
   
    if(this.searchText!='' && this.getValue == '' && this.catData == '' && this.getChild == ''){
      console.log("products lsitsting with search.");
      this.FilterItems();
    }
    if(this.searchText!='' && this.catData != '' && this.getValue == '' && this.getChild == ''){
      console.log("products lsitsting by category with search.");      
      this.getProductsByCat();
    }
  }
  getProducts() {
    var data = {
      skip: this.pageNum,
      token: this.userData.api_token,
      type:'supplier'

    }
    this.api.getProducts(data).subscribe(res => {
      if (res.status == '200') {
        if (res.prods.length != 0) {
          this.noData = false;
          this.imageUrl = res.imgurl + '/';
          this.galleryurl = res.galleryurl + '/';
          res.prods.forEach((datas, key) => {
            this.productData.push(datas);
          })
        } else {
          this.noData = true;
        }
        this.totalPages = Math.ceil(parseInt(res.totalprods) / 10);
      }

    })
  }
  pagination(event) {
    setTimeout(() => {
      if (this.pageNum < this.totalPages) {
        this.pageNum++;
        // console.log(this.getValue, this.catData)
        // console.log('enter',)
        this.check();
      }

      if (this.pageNum == this.totalPages) {
        event.target.disabled = true;
      }

      event.target.complete();

    }, 500);
  }
  async deleteConfirmation(id, index) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class subscription-label",
      header: "Are you sure you want to delete this product?",
      message: "",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "YES",
          handler: () => {
            console.log("Confirm Okay");
            this.delete(id, index)
          },
        },
      ],
    });

    await alert.present();
  }
  delete(id, index) {
    this.componentService.presentLoading();
    var formdata = {
      token: this.userData.api_token,
      product_id: id
    }
    this.api.post('/product_delete', formdata).subscribe((res: any) => {
      this.componentService.stopLoading();
      if (res.status == '200') {
        this.productData.splice(index, 1);
        if(this.productData.length ==0 ){
          this.noData = true;
        }
      }
    }, err => {
      this.componentService.stopLoading();
    })
  }
}
