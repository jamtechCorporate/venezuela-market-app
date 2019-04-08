import { Component } from '@angular/core';
import { NavController, Platform, ToastController } from 'ionic-angular';
import { Service } from '../../providers/service/service';
import { Values } from '../../providers/service/values';
import { CartPage } from '../cart/cart';
import { ProductsPage } from '../products/products';
import { SearchPage } from '../search/search';
import { ProductPage } from '../product/product';

@Component({
    templateUrl: 'home.html'
})
export class Home {
    status: any;
    items: any;
    product: any;
    options: any;
    id: any;
    variationID: any;
    time: any;
    has_more_items: boolean = true;
    backbutton = 0;
    constructor(public nav: NavController, public service: Service, public values: Values, public platform:Platform, public toastCtrl: ToastController) {
        this.items = [];
        this.options = [];
        platform.ready().then(()=>{
            platform.registerBackButtonAction(()=>{
              if(this.backbutton == 0){
                this.backbutton++;
                this.presentToast();
              }
              else{
                platform.exitApp();
              }
            });
          })
        this.service.getProducts();
    }
    presentToast() {
        let toast = this.toastCtrl.create({
          message: 'Presione dos veces para salir de la aplicación',
          duration: 2000,
          position: 'top'
        });
      
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
          this.backbutton = 0
        });
      
        toast.present();
      }
    getCategory(id, slug, name) {
        this.items.id = id;
        this.items.slug = slug;
        this.items.name = name;
        this.items.categories = this.service.categories;
        this.nav.push(ProductsPage, this.items);
    }
    getCart() {
        this.nav.push(CartPage);
    }
    getSearch() {
        this.nav.push(SearchPage);
    }
    mySlideOptions = {
        initialSlide: 1,
        loop: true,
        autoplay: 5800,
        pager: true
    }
    getId() {
        var i;
        if (this.options.length >= 1)
            var resa = this.options[0].split(":");
        if (this.options.length >= 2)
            var resb = this.options[1].split(":");
        if (this.options.length >= 1)
            for (i = 0; i < this.product.product.variations.length; i++) {
                if (this.product.product.variations[i].attributes[0].option == resa[1]) {
                    if (this.options.length == 1) {
                        break;
                    }
                    else if (this.product.product.variations[i].attributes[1].option == resb[1]) {
                        break;
                    }
                }
            }
    }
    doInfinite(infiniteScroll) {
        this.service.loadMore().then((results) => this.handleMore(results, infiniteScroll));
    }
    handleMore(results, infiniteScroll) {
        if (!results) {
            this.has_more_items = false;
        }
        infiniteScroll.complete();
    }
    getProduct(id) {
        this.nav.push(ProductPage, id);
    }
}