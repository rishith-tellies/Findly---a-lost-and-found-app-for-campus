
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { InterfaceComponent } from './interface/interface.component';

import { LoginPageComponent } from './login-page/login-page.component';

import { RegistrationComponent } from './registration/registration.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LayoutComponent } from './layout/layout.component';
import { FoundItemsComponent } from './found-items/found-items.component';
import { LostItemsComponent } from './lost-items/lost-items.component';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: InterfaceComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      { path: 'found', component: FoundItemsComponent },
      { path: 'lost', component: LostItemsComponent },
      { path: '', redirectTo: 'found', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }

import { FoundItemsComponent } from './found-items/found-items.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

// ✅ Correct way (declare only once)
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'found-items', component: FoundItemsComponent },
  { path: 'lost-items', component: LostItemsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
