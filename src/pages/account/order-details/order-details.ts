import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage,AlertController} from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Values } from '../../../providers/service/values';

@Component({
    templateUrl: 'order-details.html',
})
export class OrderDetails {
    orderDetails: any;
    id: any;
    public url:any;
    public ci=localStorage.getItem('CI');
    constructor(public nav: NavController, public service: Service, params: NavParams, public values: Values,private alertCtrl: AlertController) {
        this.id = params.data;
        this.service.getOrder(this.id)
            .then((results) =>{ 
                this.orderDetails = results;
                //console.log(this.orderDetails);       
        });
        
    }
    public pagar(){
        //redireccion
        window.open(this.url);
    }
    public presentPrompt() {
        let alert = this.alertCtrl.create({
          title: 'Ingrese su número de cédula',
          inputs: [
            {
              name: 'CI',
              placeholder: 'Cédula de identidad'
            }
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: data => {
                alert.dismiss();
              }
            },
            {
              text: 'Guardar',
              handler: data => {
                this.url = 'https://123pago.net/msBotonDePago/index.jsp?'+
                'nbproveedor=Venezuela+market&'+
                'nb='+this.orderDetails.order.billing_address.first_name+'&'+
                'ap='+this.orderDetails.order.billing_address.last_name+'&'+
                'ci='+data.CI+'&'+
                'em='+this.orderDetails.order.billing_address.email+'&'+
                'cs=f5eae3c69ddfc62bfbe6bf149ec19a68&'+
                'co=Tienda%3A+Venezuela+Market+Shop+-+Orden+%23+'+this.orderDetails.order.order_number+'&'+
                'tl='+this.orderDetails.order.billing_address.phone+'&'+
                'mt='+this.orderDetails.order.total+'&'+
                'nai='+this.orderDetails.order.order_number+'&'+
                'ip='+this.orderDetails.order.customer_ip+'&'+
                'ancho=190px';
                var patron = /^\d*$/;
                if(!data.CI.search(patron)&&data.CI>=2000000&&data.CI<=40000000){
                    this.pagar();
                }else{
                    let alertError = this.alertCtrl.create({
                        title:'Error',
                        subTitle:'La cédula introducida no es valida',
                        buttons:[
                            {
                                text:'Aceptar',
                                handler:()=>{
                                    alertError.dismiss();
                                }
                            }
                        ]
                    });
                    alertError.present();
                }
              }
            }
          ]
        });
        alert.present();
      }
}