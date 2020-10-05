
import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterPage } from "../register/register.page";

import { IonicModule } from '@ionic/angular';

import { MapModalPageRoutingModule } from './map-modal-routing.module';



import { MapModalPage } from './map-modal.page';
@NgModule({
  imports: [ 

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    MapModalPageRoutingModule
  ],
  declarations: [MapModalPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapModalPageModule {}
