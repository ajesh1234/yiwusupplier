import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { ModalController, NavController } from '@ionic/angular';
// import { InquiremodalPage } from '../inquiremodal/inquiremodal.page';
// import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';
import { StorageService } from '../services/storage.service';
// import { ReportPage } from '../report/report.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
// import { Instagram } from '@ionic-native/instagram/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.page.html',
  styleUrls: ['./productdetails.page.scss'],
})
export class ProductdetailsPage implements OnInit {
  profile: any = 'tinfo';
  @ViewChild('mySlider') mySlider: IonSlides;
  rate: any = 0;
  currentIndex: any;
  productArray: any;
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    slidesPerView: 5,
  };
  message: any = '';
  selectedImg: any = '';
  proSlug: any = '';
  selectedData: any = '';
  proData: any;
  wish: any;
  total: any = 0;
  cartData: any = [];
  selectedProduct: any = '';
  quantity: any = 1;
  searchVal: any = '';
  getSupplier: any = '';
  showLevel1 = null;
  showLevel2 = null;
  showLevel5 = null;
  reply: any = '';
  userData: any = '';
  review: any = '';
  showLevel3 = null;
  editmessage: any = '';
  editreply: any = '';
  constructor(private photoViewer: PhotoViewer, public socialSharing: SocialSharing, public storageService: StorageService, public navCtrl: NavController, public componentService: ComponentService, public api: ApiService, public router: Router, public modalController: ModalController) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.proSlug = state.slug ? state.slug : '';
      this.wish = state.wish ? state.wish : '';
      this.searchVal = state.search ? state.search : '';
      this.getSupplier = state.data ? JSON.parse(state.data) : '';
      console.log(this.getSupplier, "drr")
      this.getProDetails();
    };
    this.componentService.eventpublish('comment:created', (data) => {
      this.getProDetails();

    });
    console.log(this.proSlug, "id")
    this.storageService.get('userData').then(res => {
      if (res != null && res != undefined) {
        this.userData = res;
      }
    });
  }
  openImage(img){
    console.log(img)
    this.photoViewer.show('https:'+img);
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
  toggleLevel5(idx) {
    console.log(idx)
    if (this.isLevel5Shown(idx)) {
      this.showLevel5 = null;
    } else {
      this.showLevel5 = idx;
    }
  };
  isLevel5Shown(idx) {
    return this.showLevel5 === idx;
  };
  toggleLevel2(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel2 = null;
    } else {
      this.showLevel2 = idx;
    }
  };
  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };
  toggleLevel3(idx, comment) {
    this.editmessage = comment.message;
    if (this.isLevel1Shown(idx)) {
      this.showLevel3 = null;
    } else {
      this.showLevel3 = idx;
    }
  };
  isLevel3Shown(idx) {
    return this.showLevel3 === idx;
  };
  goBack() {
    if (this.wish == '1') {
      this.navCtrl.navigateBack(['/wishlist'])
    } else {
      console.log("Rrrr")
      if (this.searchVal != '') {
        this.navCtrl.back();
        // this.navCtrl.navigateBack(['/tabs/products'], { state: { search: this.searchVal} })
        // this.componentService.eventpublish('product:created', {search: this.searchVal});  
      } else if (this.getSupplier != '') {
        this.navCtrl.back();
        // this.navCtrl.navigateBack(['/tabs/products'], { state: {data:JSON.stringify(this.getSupplier)} })
        // this.componentService.eventpublish('product:created', {data:JSON.stringify(this.getSupplier)});  
      } else {
        this.navCtrl.navigateBack(['/tabs/products']);
      }
    }

  }
  share(val) {
    this.componentService.presentLoading();
    if (val == 'insta') {
      this.socialSharing.shareViaInstagram(this.proData.product.name, 'https:'+this.selectedImg).then(() => {
        this.componentService.stopLoading();
      }).catch(() => {
        this.componentService.stopLoading();
      });
      // this.instagram.share(this.proData.productlink, 'Caption')
      //   .then(() => console.log('Shared!'))
      //   .catch((error: any) => console.error(error));

    } else if (val == 'twitter') {
      this.socialSharing.shareViaTwitter(null, null, 'https:' + this.proData.productlink).then(() => {
        this.componentService.stopLoading();
      }).catch(() => {
        this.componentService.stopLoading();
      });
    } else if (val == 'fb') {
      this.socialSharing.shareViaFacebook(null, null, this.proData.productlink).then(() => {
        this.componentService.stopLoading();
      }).catch(() => {
        this.componentService.stopLoading();
      });
    } else {
      this.componentService.stopLoading();
      var url = 'https:' + this.proData.productlink
      var title = 'test';
      window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url , "_blank");

    }

  }
  addreply(comment, i) {
    console.log(comment.commentid);
    this.componentService.presentLoading();
    var data = {
      "text": this.reply,
      "comment_id": comment.commentid,
      'token': this.userData.api_token
    }
    console.log(data, "data");
    this.api.post('/comment_reply', data).subscribe((res: any) => {
      console.log('res:- ', res);
      this.componentService.stopLoading();
      if (res.status == "200") {
        console.log('enyye', this.proData?.product?.comments[i])
        // this.componentService.eventpublish('comment:created', Date.now());
        if (this.proData.product.comments[i].replies) {
          this.proData.product.comments[i].replies.push(res.replies)
        } else {
          this.proData.product.comments[i].replies[0] = res.replies;
        }
        this.reply = '';
        this.showLevel2 = null;
        console.log(this.proData.product.comments, "comments")
        this.componentService.presentToast(res.message, 'success')

      } else {
        this.componentService.presentToast(res.message, 'danger')
      }
    }, err => {
      this.componentService.stopLoading();
      console.log('login error:- ', err);
    });
  }
  goToChat() {
    this.navCtrl.navigateForward(['/chatbox'], { state: { reciever_id: this.proData.product.user_id } })
  }
  addComment() {
    if (this.message == undefined || this.message == '') {
      this.componentService.presentToast('Please enter comment..', 'danger');
      return false;
    }
    this.componentService.presentLoading();
    var data = {
      text: this.message,
      product_id: this.proData.product.id,
      token: this.userData.api_token
    }
    console.log(data, "data")
    this.api.post('/comment_item', data).subscribe((res: any) => {
      console.log(res)
      this.componentService.stopLoading();

      if (res.status == '200') {
        this.proData.product.comments.unshift(res.comment)
        this.message = '';
      }
    })
  }
  editComment(comment, i) {
    console.log(comment)
    if (this.editmessage == undefined || this.editmessage == '') {
      this.componentService.presentToast('Please enter comment..', 'danger');
      return false;
    }
    this.componentService.presentLoading();
    var data = {
      text: this.editmessage,
      comment_id: comment.commentid,
      token: this.userData.api_token
    }
    console.log(data, "data")
    this.api.post('/edit_comment', data).subscribe((res: any) => {
      console.log(res)
      this.componentService.stopLoading();
      if (res.status == '200') {
        this.proData.product.comments[i].message = res.comment.message;
        // this.message = '';
        this.showLevel3 = null
      }
    })
  }
  editReply(comment, i, ri) {
    console.log(comment)
    if (this.editreply == undefined || this.editreply == '') {
      this.componentService.presentToast('Please enter reply..', 'danger');
      return false;
    }
    this.componentService.presentLoading();
    var data = {
      text: this.editreply,
      reply_id: comment.replyid,
      token: this.userData.api_token
    }
    console.log(data, "data")
    this.api.post('/edit_reply', data).subscribe((res: any) => {
      console.log(res)
      this.componentService.stopLoading();
      if (res.status == '200') {
        this.proData.product.comments[i].replies[ri] = res.replies;
        // this.message = '';
        this.showLevel5 = null
      }
    })
  }
  delete(comment, i) {
    console.log(comment)
    this.componentService.presentLoading();
    var data = {
      comment_id: comment.commentid,
      token: this.userData.api_token
    }
    console.log(data, "data")
    this.api.post('/delete_comment', data).subscribe((res: any) => {
      console.log(res)
      this.componentService.stopLoading();
      if (res.status == '200') {
        this.proData.product.comments.splice(i, 1);

      }
    })
  }
  deleteReply(comment, i, ri) {
    console.log(comment)
    this.componentService.presentLoading();
    var data = {
      reply_id: comment.replyid,
      token: this.userData.api_token
    }
    console.log(data, "data")
    this.api.post('/delete_reply', data).subscribe((res: any) => {
      console.log(res)
      this.componentService.stopLoading();
      if (res.status == '200') {
        this.proData.product.comments[i].replies.splice(ri, 1);
      }
    })
  }
  onRateChange(ev) {
    console.log(ev, this.rate);
  }
  addReview() {
    if (this.review == undefined || this.review == '') {
      this.componentService.presentToast('Please enter review..', 'danger');
      return false;
    }
    this.componentService.presentLoading();
    var data = {
      review: this.review,
      product_id: this.proData.product.id,
      token: this.userData.api_token,
      rating: this.rate
    }
    console.log(data, "data")
    this.api.post('/review_submit', data).subscribe((res: any) => {
      console.log(res)
      this.componentService.stopLoading();

      if (res.status == '200') {
        this.proData.product.comments.unshift(res.comment)
        this.message = '';
      }
    })
  }
  addCart() {
    this.total = 0;
    this.cartData = [];
    if (JSON.parse(localStorage.getItem("cart_data")) == null || JSON.parse(localStorage.getItem("cart_data")) == undefined) {
      this.cartData = [];
    } else {
      this.cartData = JSON.parse(localStorage.getItem("cart_data"));
    }
    console.log(this.cartData)
    var len = this.cartData.length;
    var doPush = 0;
    console.log(len)
    for (var i = 0; i < len; i++) {
      console.log(this.cartData[i].id, "+++", this.selectedProduct.id)
      if (this.cartData[i].id && this.cartData[i].id == this.selectedProduct.id) {
        this.cartData[i].quantity = this.cartData[i].quantity + this.selectedProduct.quantity
        if (this.cartData[i].whole_sell_discount == '' || this.cartData[i].whole_sell_discount == null) {
          this.cartData[i].subtotal = 0;
        } else {
          var price = parseFloat(this.cartData[i].whole_sell_discount[0]).toFixed(2)
          this.cartData[i].subtotal = parseFloat(price) * this.cartData[i].quantity;
        }
        doPush = 1;
      }
    }
    if (doPush === 0) {
      this.cartData.push(this.selectedProduct);
      console.log("dooo ", this.cartData)
    }
    // this.storageService.set('cartData', this.cartData).then(resp => {
    //   console.log(resp, "sds")
    // });
    localStorage.setItem("cart_data", JSON.stringify(this.cartData));
    this.componentService.eventpublish('cart:created', Date.now());

    this.componentService.presentToast('Product added to cart', 'success');
    // this.total = this.cart.calculateTotal();

  }
  calculateTotal() {
    this.total = 0;
    this.cartData = [];
    console.log(JSON.parse(localStorage.getItem("cart_data")));
    if (JSON.parse(localStorage.getItem("cart_data")) == null) {
      this.cartData = [];
    } else {
      this.cartData = JSON.parse(localStorage.getItem("cart_data"));
    }
    var len = this.cartData.length;
    console.log(this.cartData)
    for (var i = 0; i < len; i++) {
      console.log(this.cartData[i].total);
      var price;
      if (this.cartData[i].whole_sell_discount == '' || this.cartData[i].whole_sell_discount == null) {
        price = 0;
      } else {
        price = parseFloat(this.cartData[i].whole_sell_discount[0]).toFixed(2)
      }
      this.total += price * this.cartData[i].quantity;
      console.log(this.total, "total");
    }
    return this.total;
  }
  // async presentModal(dataid) {
  //   const modal = await this.modalController.create({
  //     component: InquiremodalPage,
  //     cssClass: 'filtermodal',
  //     componentProps: {
  //       id: dataid
  //     }
  //   });
  //   return await modal.present();
  // }
  selected(val, data) {
    // console.log(i)
    this.selectedImg = this.proData.imgurl + '/' + val;
    this.selectedData = data;
  }
  slidePrev(evt) {
    console.log(evt)
    this.mySlider.slidePrev();
    this.mySlider.getActiveIndex().then((index) => {
      console.log(index, "index")
      this.selectedImg = this.proData.imgurl + '/' + this.proData.product_galleries[index].photo;
      this.selectedData = this.proData.product_galleries[index];
    });
  }
  slideNext(evt) {
    this.mySlider.slideNext();
    this.mySlider.getActiveIndex().then((index) => {
      console.log(index, "index")
      this.selectedImg = this.proData.imgurl + '/' + this.proData.product_galleries[index + 1].photo;
      this.selectedData = this.proData.product_galleries[index + 1];
      console.log(this.selectedImg, this.selectedData)

    });
  }
  getProDetails() {
    // this.componentService.presentLoading();
    var data = {}
    this.api.get('/item/' + this.proSlug, data).subscribe((res: any) => {
      // this.componentService.stopLoading();
      if (res.status == '200') {
        this.proData = res;
        if (this.proData.product_galleries.length) {
          this.selectedImg = this.proData.imgurl + '/' + this.proData.product_galleries[0].photo;
        } else {
          this.selectedImg = this.proData.normalimgurl + '/' + this.proData.product.photo;
        }
        if (this.proData.product.minimum_quantity != null) {
          this.quantity = this.proData.product.minimum_quantity;
        } else {
          this.quantity = 1;
        }
        this.selectedData = this.proData.product_galleries[0];
        this.selectedProduct = this.proData.product;
        this.selectedProduct.quantity = this.quantity;
        if (this.selectedProduct.whole_sell_discount == '' || this.selectedProduct.whole_sell_discount == null) {
          this.selectedProduct.subtotal = 0;
        } else {
          var price = parseFloat(this.selectedProduct.whole_sell_discount[0]).toFixed(2)
          this.selectedProduct.subtotal = parseFloat(price) * this.selectedProduct.quantity;
        }
        this.selectedProduct.image = this.selectedImg;
        console.log(this.selectedProduct);

      }
    })
  }
  addQuantity() {
    this.quantity = this.quantity + 1;
    this.selectedProduct.quantity = this.quantity;
    if (this.selectedProduct.whole_sell_discount == '' || this.selectedProduct.whole_sell_discount == null) {
      this.selectedProduct.subtotal = 0;
    } else {
      var price = parseFloat(this.selectedProduct.whole_sell_discount[0]).toFixed(2)
      this.selectedProduct.subtotal = parseFloat(price) * this.selectedProduct.quantity;
    }
  }
  removeQuantity() {
    var proQuan;
    if (this.proData.product.minimum_quantity != null) {
      proQuan = this.proData.product.minimum_quantity;
    } else {
      proQuan = 1;
    }
    if (this.quantity > proQuan) {
      this.quantity = this.quantity - 1;
      this.selectedProduct.quantity = this.quantity;
      if (this.selectedProduct.whole_sell_discount == '' || this.selectedProduct.whole_sell_discount == null) {
        this.selectedProduct.subtotal = 0;
      } else {
        var price = parseFloat(this.selectedProduct.whole_sell_discount[0]).toFixed(2)
        this.selectedProduct.subtotal = parseFloat(price) * this.selectedProduct.quantity;
      }
    }
  }
  getActive(product) {
    // console.log(product.id , this.selectedData.id)
    if (product.id == this.selectedData.id) {
      return 'active';
    }
  }

  ngOnInit() {
  }

  // async presentReportModal(id) {
  //   const modal = await this.modalController.create({
  //     component: ReportPage,
  //     cssClass: 'disputeModal',
  //     id: 'report',
  //     componentProps: {
  //       id: id
  //     }
  //   });
  //   return await modal.present();
  // }
}
