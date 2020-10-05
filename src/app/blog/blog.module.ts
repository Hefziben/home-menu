import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlogPageRoutingModule } from './blog-routing.module';

import { BlogPage } from './blog.page';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  imports: [
    SlickCarouselModule,
    CommonModule,
    FormsModule,
    IonicModule,
    BlogPageRoutingModule
  ],
  declarations: [BlogPage]
})
export class BlogPageModule {}
