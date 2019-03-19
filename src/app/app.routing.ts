import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {ImageComponent} from './image/image.component';


export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'image/:id', component: ImageComponent},
  {path: '**', component: HomeComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
