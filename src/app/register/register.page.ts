import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ApiService } from "../api.service";
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  locations;
  i;
  signupForm: FormGroup;
  selected;
  type;
  occupation;
  deal;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private apiService:ApiService,
    private loading:LoadingController,
    private toast:ToastController  ) {

    this.signupForm = this.fb.group({
      email: [""],
      name: [""],
      phone: [""],
      company:[""]
    });
  }

  ngOnInit() {
    this.occupation = "Professional";
    this.deal = "this is a Professional deal"
      }

  
  changeType(val){
    this.occupation = val.detail.value;
    this.dealType(this.occupation);

  }
  dealType(type){
    if(type == "Employer"){
      this.deal = "This is an Employer deal"
    }

    if(type == "Professional"){
      this.deal = "this is a Professional deal"
    }
  }

  register(form) {
    this.presentLoading().then(()=>{
      var data = form.value
      console.log(form.value);
      if (this.occupation == "Employer" || this.occupation == "Professional") {
        var lead = {
          contact: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            properties: {
                    occupation: this.occupation,
                    companyName:data.company
                }
          },
          status: "open",
          name : this.deal,
          path:"leads"
        }
        console.log(lead);
        return
          this.apiService.apiPostRequest(lead).then( res =>{
          console.log(res.data);
          this.loading.dismiss();
          this.presentToast()
          
        }).catch(err =>{
          console.log(err);          
        })
      
        
      }
      if (this.occupation == "Landlord" || this.occupation == "Developer"|| this.occupation == "Other") {
        var contact = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: 'contact',
          path:"members",
          properties: {
                  occupation: this.occupation,
                  companyName:data.company
              }
        }
        console.log(contact);
        return
         this.apiService.apiPostRequest(contact).then( res =>{
          console.log(res.data);
          this.loading.dismiss();
          this.presentToast() 
          
          
        }).catch(err =>{
          console.log(err);
  
          
        })
      
        
      }
      

    })
    
      
    //  this.router.navigate(['home'])
  }

  async presentLoading() {
    const loading = await this.loading.create({
      cssClass:"loader",
    
         });
    await loading.present();
  }
  async presentToast() {
    const toast = await this.toast.create({
      message: 'Your information was sent, thanks!',
      duration: 2000
    });
  }

}
