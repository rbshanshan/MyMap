import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyMapComponent } from './myMap/myMap.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mymap',
    pathMatch: 'full'
  },
  { 
    path: 'mymap', 
    component: MyMapComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
