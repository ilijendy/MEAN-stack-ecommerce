import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetails } from './pages/product-details/product-details';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { authGuard } from './core/guards/auth-guard';
import { Profile } from './pages/profile/profile';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { adminGuard } from './core/guards/admin-guard';
import { ManageProducts } from './pages/admin/manage-products/manage-products';
import { ManageOrders } from './pages/admin/manage-orders/manage-orders';
import { NotFound } from './pages/not-found/not-found';


export const routes: Routes = [
  //Default path
  {path:'', redirectTo:'home',pathMatch:'full'},

  //public
  {path:'home',component:Home},
  {path:'product',component:Products},
  {path:'product/:id',component:ProductDetails},
  {path:'login',component:Login},
  {path:'register',component:RegisterComponent},

  //protected
  {path:'cart',component:Cart,canActivate:[authGuard]},
  {path:'profile',component:Profile,canActivate:[authGuard]},

  //admin
  {path:'admin/dashboard',component:Dashboard,canActivate:[authGuard,adminGuard]},
  {path:'admin/manage-products',component:ManageProducts,canActivate:[authGuard,adminGuard]},
  {path:'admin/manage-orders',component:ManageOrders,canActivate:[authGuard,adminGuard]},

  //404
  {path:'**',component:NotFound}


];
  