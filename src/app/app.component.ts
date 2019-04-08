import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Home } from '../pages/home/home';
import { Service } from '../providers/service/service';
import { Values } from '../providers/service/values';
import { Config } from '../providers/service/config';
import { TranslateService } from '@ngx-translate/core';
import { ProductsPage } from '../pages/products/products';
import { CartPage } from '../pages/cart/cart';
import { AccountLogin } from '../pages/account/login/login';
import { Address } from '../pages/account/address/address';
import { Orders } from '../pages/account/orders/orders';
import { AccountRegister } from '../pages/account/register/register';
import { WishlistPage } from '../pages/account/wishlist/wishlist';
import { Post } from '../pages/post/post';
import { AppRate } from '@ionic-native/app-rate';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = Home;
    status: any;
    items: any = {};
    buttonLanguagesSettings: boolean = false;
    constructor(statusBar: StatusBar, splashScreen: SplashScreen, public alertCtrl: AlertController, public config: Config, private emailComposer: EmailComposer, private appRate: AppRate, public platform: Platform, public service: Service, public values: Values, public translateService: TranslateService, private socialSharing: SocialSharing, private push: Push) {
        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();
            this.platform.setDir(this.config.appDir, true);
            this.translateService.setDefaultLang(this.config.language);
            this.service.load().then((results) => {});
/*             if (platform.is('cordova')) {
                this.oneSignal.startInit(this.config.oneSignalAppId, this.config.googleProjectId);
                this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
                this.oneSignal.handleNotificationReceived().subscribe(result => {
                    console.log(result);
                });
                this.oneSignal.handleNotificationOpened().subscribe(result => {
                    if (result.notification.payload.additionalData.category) {
                        this.items.id = result.notification.payload.additionalData.category;
                        this.nav.push(ProductsPage, this.items);
                    } else if (result.notification.payload.additionalData.product) {
                        this.items.id = result.notification.payload.additionalData.product;
                        this.nav.push(ProductPage, this.items.id);
                    } else if (result.notification.payload.additionalData.post) {
                        this.items.id = result.notification.payload.additionalData.post;
                        this.post(this.items.id);
                    }
                });
                this.oneSignal.endInit();
            } */
            this.pushSetup();
        });
    }
    pushSetup() {
        const options: PushOptions = {
            android: {
                senderID: '1093288882278'
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            }
         };
         
         const pushObject: PushObject = this.push.init(options);
         
         
         pushObject.on('notification').subscribe((notification: any) => {
             if (notification.additionalData.foreground) {
                 let youralert = this.alertCtrl.create({
                    title: '¡Mensaje nuevo!',
                    message: notification.message
                 });
                 youralert.present();
             }
         });
         
         pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
         
         pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }

    openPage(page) {
        this.nav.setRoot(page);
    }
    getCategory(id, slug, name) {
        this.items = [];
        this.items.id = id;
        this.items.slug = slug;
        this.items.name = name;
        this.items.categories = this.service.categories;
        this.nav.setRoot(ProductsPage, this.items);
    }
    getCart() {
        this.nav.setRoot(CartPage);
    }
    logout() {
        this.service.logout();
        this.values.wishlistId = [];
        this.nav.setRoot(AccountLogin);
    }
    login() {
        this.nav.setRoot(AccountLogin);
    }
    register() {
        this.nav.setRoot(AccountRegister);
    }
    address() {
        this.nav.setRoot(Address);
    }
    order() {
        this.nav.setRoot(Orders);
    }
    cart() {
        this.nav.setRoot(CartPage);
    }
    wishlist() {
        this.nav.setRoot(WishlistPage);
    }
    shop() {
        this.nav.setRoot(Home);
    }
    rateApp() {
        this.appRate.preferences.storeAppURL = {
            ios: this.config.appRateIosAppId,
            android: this.config.appRateAndroidLink,
            windows: 'ms-windows-store://review/?ProductId=' + this.config.appRateWindowsId
        };
        this.appRate.promptForRating(true);
    }
    shareApp() {
        var options = {
            message: this.config.shareAppMessage,
            subject: this.config.shareAppSubject,
            files: ['', ''],
            url: this.config.shareAppURL,
            chooserTitle: this.config.shareAppChooserTitle
        }
        this.socialSharing.shareWithOptions(options);
    }
    contact() {
        let email = {
            to: this.config.supportEmail,
            subject: '',
            body: '',
            isHtml: true
        };
        this.emailComposer.open(email);
    }
    post(id) {
        this.nav.setRoot(Post, id);
    }
}