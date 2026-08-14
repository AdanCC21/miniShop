import { Routes } from '@angular/router';

import { AuthPageComponent } from './auth-page/auth-page';
import { DashboardComponent } from './dashboard/dashboard';
import { EsperandoComponent } from './esperando/esperando';
import { OrdersComponent } from './orders/orders';
import { ProductsComponent } from './products/products';
import { ProductDetailsComponent } from './products/product-details/product-details';
import { CajeroComponent } from './cajero/cajero';
import { TienditaComponent } from './tiendita/tiendita';
import { EmpleadosComponent } from './empleados/empleados';
import { AdminComponent } from './admin/admin';
import { StoreDetailsComponent } from './admin/store-details/store-details';

import { adminGuard } from './auth/admin.guard';
import { encargadoGuard } from './auth/encargado.guard';
import { pendingGuard } from './auth/pending.guard';
import { storeMemberGuard } from './auth/store-member.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'auth', component: AuthPageComponent },
  { path: 'esperando', component: EsperandoComponent, canActivate: [pendingGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [storeMemberGuard]
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [storeMemberGuard]
  },
  {
    path: 'products/:code',
    component: ProductDetailsComponent,
    canActivate: [storeMemberGuard]
  },
  {
    path: 'cajero',
    component: CajeroComponent,
    canActivate: [storeMemberGuard]
  },
  {
    path: 'pedidos',
    component: OrdersComponent,
    canActivate: [storeMemberGuard]
  },
  {
    path: 'tiendita',
    component: TienditaComponent,
    canActivate: [encargadoGuard]
  },
  {
    path: 'empleados',
    component: EmpleadosComponent,
    canActivate: [encargadoGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/:id',
    component: StoreDetailsComponent,
    canActivate: [adminGuard]
  }
];
