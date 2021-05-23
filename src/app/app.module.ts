import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { MyMapComponent } from './myMap/myMap.component';
import { MapMarkerListComponent } from './myMap/mapMarkerList/mapMarkerList.component';
import { MapMainComponent } from './myMap/mapMain/mapMain.component';

import { EmitService } from './unit/emit.service';
import { ConvexHullService } from './unit/convex_hull.service';


@NgModule({
  declarations: [
    AppComponent,
    MyMapComponent,
    MapMarkerListComponent,
    MapMainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [EmitService, ConvexHullService],
  bootstrap: [AppComponent]
})
export class AppModule { }
