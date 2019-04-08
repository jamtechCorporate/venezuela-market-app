import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Item, LoadingController  } from 'ionic-angular';
import { CartService } from '../../providers/service/cart-service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';
import { BillingAddressForm } from '../checkout/billing-address-form/billing-address-form';
import { Home } from '../home/home';
import { ProductService } from '../../providers/service/product-service';

@Component({
    templateUrl: 'cart.html'
})
export class CartPage {
    cart: any;
    status: any;
    obj: any;
    quantity: number;
    update: any;
    options: any;
    number: any;
    addProduct: boolean = true;
    coupon: any;
    a: any;
    disableSubmit: boolean = false;
    buttonCoupon: boolean = false;
    disableSubmitCoupon: boolean = false;
    chosen_shipping: any;
    shipping: any;
    Apply: any;
    Checkout: any;
    constructor(
        public nav: NavController, 
        public service: CartService,
        public productService: ProductService,
        public values: Values, 
        public params: NavParams, 
        public functions: Functions, 
        public platform:Platform,
        public loadingCtrl: LoadingController
    ) {
        this.Apply = "Apply";
        this.Checkout = "Checkout";
        this.quantity = 1;
        this.options = [];
        this.obj = params.data;
        this.service.loadCart()
            .then((results) => this.handleCartInit(results));
            this.platform.ready().then(()=>{
                platform.registerBackButtonAction(()=>this.nav.setRoot(Home));
            })
    }

    doRefresh(refresher) {
        this.service.loadCart()
        .then((results) => this.handleCartInit(results));
        setTimeout(() => {
            //console.log('Async operation has ended');
            refresher.complete();
          }, 1000);
    }

    handleCartInit(results) {
        this.cart = results;
        this.shipping = results.zone_shipping;
        this.chosen_shipping = results.chosen_shipping;
    }
    handleCart(results) {
        this.cart = results;
    }
    delete(key) {
        this.service.deleteItem(key)
            .then((results) => this.handleCart(results));
    }
    checkout() {
        this.disableSubmit = true;
        this.Checkout = "PleaseWait";
        this.service.checkout()
            .then((results) => this.handleBilling(results));
    }
    handleBilling(results) {
        this.disableSubmit = false;
        this.Checkout = "Checkout";
        this.nav.push(BillingAddressForm, results);
    }
    deleteFromCart(id, key) {
        let loading = this.loadingCtrl.create({
            content: 'Por favor espere...'
          });
        
        loading.present();
        if(Object.keys(this.cart.cart_contents).length == 1){
            if(this.cart.cart_contents[key].quantity == 1){
                this.cart.cart_contents = {};
                console.log(this.cart);
            };
        }
        this.service.deleteFromCart(id, key)
            .then((results) =>{
                this.handleCart(results)
                loading.dismiss();
            });
            
    }
    addToCart(id, key, value) {
        let loading = this.loadingCtrl.create({
            content: 'Por favor espere...',
          });
        
        
        this.productService.getProduct(id).then(
            (result) => {
                let item = result['product'];
                console.log(item);                
                if(value < item.stock_quantity) {
                    loading.present();
                    this.service.addToCart(id, key)
                    .then((results) =>{
                        this.handleCart(results)
                        loading.dismiss();
                    });
                } else if(item.stock_quantity == null) {
                    loading.present();
                    this.service.addToCart(id, key)
                    .then((results) =>{
                        this.handleCart(results)
                        loading.dismiss();
                    });
                }
            }
        )
        /* for (let i = 0; i < array.length; i++) {
            const element = array[i];
            
        } */
        
    }
    updateCart(results) {
        this.service.loadCart()
            .then((results) => this.handleCart(results));
    }
    handleAddToCart(results) {
        this.service.loadCart()
            .then((results) => this.handleCart(results));
    }
    submitCoupon() {
        if (this.cart.coupon != undefined) {
            this.disableSubmitCoupon = true;
            this.Apply = "Apply";
            this.service.submitCoupon(this.cart.coupon)
                .then((results) => this.handleCoupon(results));
        }
    }
    removeCoupon() {
        this.service.removeCoupon(this.cart.applied_coupons)
            .then((results) => this.handleCoupon(results));
    }
    handleCoupon(results) {
        console.log(results);
        this.disableSubmitCoupon = false;
        this.Apply = "Apply";
        this.functions.showAlert("", results._body);
        this.service.loadCart()
            .then((results) => this.handleCart(results));
    }
    handleResults(a) {
        if (a.message.status == 'success') {
            this.functions.showAlert(a.message.status, a.message.text);
        }
        else {
            this.functions.showAlert(a.message.status, a.message.text);
        }
    }
    updateShipping(method) {
        this.chosen_shipping = method;
        this.service.updateShipping(method)
            .then((results) => this.handleShipping(results));
    }
    gohome(){
    this.nav.setRoot(Home);
    }
    handleShipping(results) {
        this.cart = results;
    }
}