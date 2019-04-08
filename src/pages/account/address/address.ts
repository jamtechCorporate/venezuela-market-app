import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Values } from '../../../providers/service/values';
import { EditAddressForm } from '../edit-address-form/edit-address-form';
import { Home } from '../../home/home';

@Component({
    templateUrl: 'address.html',
})
export class Address {
    addresses: any;
    address: any;
    status: any;
    form: any;
    constructor(public nav: NavController, public service: Service, public values: Values, public platform:Platform) {
        this.service.getAddress()
            .then((results) => this.addresses = results);
            this.platform.ready().then(()=>{
                platform.registerBackButtonAction(()=>this.nav.setRoot(Home));
            })
    }

    doRefresh(refresher) {
        this.service.getAddress()
            .then((results) => this.addresses = results);
        setTimeout(() => {
            //console.log('Async operation has ended');
            refresher.complete();
          }, 1000);
    }
    onPageWillEnter() {
        this.loadData();
    }
    loadData() {
        this.service.getAddress()
            .then((results) => {this.addresses = results});
    }
    editAddress() {
        /* this.nav.push(EditAddressForm, this.addresses.customer); */
        this.nav.push(EditAddressForm,{item:this.addresses.customer,callback:this.loadData()});
    }
}