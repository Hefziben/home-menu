import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule,NavParams } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { MapApi } from "../../environments/environment";
import { SlickCarouselModule } from 'ngx-slick-carousel';



import { HomePage } from './home.page';

@NgModule({
  imports: [
    SlickCarouselModule,
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,    
  ],
  providers:[NavParams],
  declarations: [HomePage]
})
export class HomePageModule {}
