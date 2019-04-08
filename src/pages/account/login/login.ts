import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';
import { Home } from '../../home/home';
import { AccountForgotten } from '../forgotten/forgotten';

@Component({
    templateUrl: 'login.html'
})
export class AccountLogin {
    loginData: any;
    loadLogin: any;
    status: any;
    error: any;
    nonce: any;
    public disableSubmit: boolean = false;
    buttonText: any;
    constructor(public nav: NavController, public service: Service, public functions: Functions, public values: Values, public platform:Platform) {
        this.loginData = {};
        this.buttonText = "Login";
        this.service.getNonce()
            .then((results) => this.nonce = results);
            this.platform.ready().then(()=>{
                platform.registerBackButtonAction(()=>this.nav.setRoot(Home));
            })
    }
    login() {
        if (this.validateForm()) {
            this.disableSubmit = true;
            this.buttonText = "Logging In...";
            this.service.login(this.loginData)
                .then((results) => this.handleResults(results));
        }
    }
    validateForm() {
        if (this.loginData.username == undefined || this.loginData.username == "") {
            return false
        }
        if (this.loginData.password == undefined || this.loginData.password == "") {
            return false
        }
        else {
            return true
        }
    }
    handleResults(results) {
        this.disableSubmit = false;
        this.buttonText = "Iniciar sesión";

        
        if (!results.errors) {
            this.functions.showAlert('', 'Ha iniciado sesión con éxito');
            this.nav.setRoot(Home);
        }
        else if (results.errors) {
            this.functions.showAlert('', 'Usuario o contraseña inválido');
        }
    }
    forgotten(loginData) {
        this.nav.push(AccountForgotten);
    }
}