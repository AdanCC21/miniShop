import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard';
import { ProductsComponent } from './products/products';
import { ProductDetailsComponent } from './products/product-details/product-details';
import { CajeroComponent } from './cajero/cajero';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:code', component: ProductDetailsComponent },
  { path: 'cajero', component: CajeroComponent }
];
