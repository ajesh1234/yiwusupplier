import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, NavParams, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ComponentService } from '../services/component.service';


@Component({
  selector: 'app-productcategory',
  templateUrl: './productcategory.page.html',
  styleUrls: ['./productcategory.page.scss'],
})
export class ProductcategoryPage implements OnInit {
  data: any = '';
  val: any = '';
  categoryData: any = [];
  showLevel1 = null;
  showLevel2 = null;
  categoryArray: any = [];
  categoryDisplayArray: any = [];
  cat: any = [];
  constructor(public navParams: NavParams, public componentService: ComponentService, public modalController: ModalController, public api: ApiService) {
    this.val = navParams.get('title');
    this.cat = JSON.parse(navParams.get('cat'));
    console.log(this.cat);
    // if(this.val  == 'Product Supplier'){
    this.getCategories();

    // }
  }

  ngOnInit() {
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
  async dismiss() {
    this.modalController.dismiss(this.categoryDisplayArray, undefined, 'terms');
  }
  getCategories() {
    var data = {}
    this.api.get('/getContent', data).subscribe((res: any) => {
      if (res.status == '200') {
        this.categoryData = res.product_categories;
        if (this.cat.length == 0) {
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
        } else {
          for (var i = 0; i < this.cat.length; i++) {
            var index = this.categoryData.findIndex(x => x.id == this.cat[i].id);
            console.log(index,"in")
            // this.categoryData.forEach((ele, key) => {
            //   console.log(ele , this.cat[i])
            //   if (this.cat[i].type == 'main_cat##') {
            //     if (this.cat[i].id == ele.id) {
            //       console.log("enter");
            //       this.categoryData[key].isChecked = true;
            //     } else {
            //       this.categoryData[key].isChecked = false;
            //     }
            //   }
            // })
          }
          // for (var i = 0; i < this.cat.length; i++) {
          //   this.categoryData.forEach((ele, key) => {
          //     if (this.cat[i].type == 'main_cat##') {
          //       if (this.cat[i].id == ele.id) {
          //         this.categoryData[key].isChecked = true;
          //       } else {
          //         this.categoryData[key].isChecked = false;
          //       }
          //     } 
          //      if(this.categoryData[key].sub_and_child_cat.length>0){
          //         this.categoryData[key].sub_and_child_cat.forEach((element, sub_key) => {
          //           if(this.cat[i].type == 'sub_cat##'){
          //           if (this.cat[i].id == element.id) {
          //             this.categoryData[key].sub_and_child_cat[sub_key].isChecked = true;
          //           } else {
          //             this.categoryData[key].sub_and_child_cat[sub_key].isChecked = false;
          //           }
          //         }
          //         if (this.categoryData[key].sub_and_child_cat[sub_key].childs.length > 0) {
          //           this.categoryData[key].sub_and_child_cat[sub_key].childs.forEach((element, child_key) => {
          //             if(this.cat[i].type == 'child_cat##'){
          //               if (this.cat[i].id == element.id) {
          //                 this.categoryData[key].sub_and_child_cat[sub_key].childs[child_key].isChecked = true;

          //               } else {
          //                 this.categoryData[key].sub_and_child_cat[sub_key].childs[child_key].isChecked = false;

          //               }
          //             }
          //           });
          //         }
          //         });
          //        } 
          //    })
          //  }
        }
        console.log(this.categoryData, "data")

      }
    })
  }
  getTerms() {
    //  this.componentService.presentLoading();
    var data = {
      val: this.val
    }
    this.api.post('/getPages', data).subscribe((res: any) => {
      // this.componentService.stopLoading();
      if (res.status == '200') {
        console.log(res);
        this.data = res.pagedata[0].details;
      } else {
        this.data = '';
      }
    })
  }

}
