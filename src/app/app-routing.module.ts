
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { LayoutComponent } from './layout/layout.component';
import { LostItemsComponent } from './lost-items/lost-items.component';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: InterfaceComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

import { FoundItemsComponent } from './found-items/found-items.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegistrationComponent },


  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'lost-items', component: LostItemsComponent },
      { path: 'found-items', component: FoundItemsComponent }
    ]

  },
  { path: '**', redirectTo: '' }

  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
