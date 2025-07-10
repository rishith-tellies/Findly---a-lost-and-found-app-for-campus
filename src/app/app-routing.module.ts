import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InterfaceComponent } from './interface/interface.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutComponent } from './layout/layout.component';
import { FoundItemsComponent } from './found-items/found-items.component';
import { LostItemsComponent } from './lost-items/lost-items.component';

const routes: Routes = [
  { path: '', component: InterfaceComponent }, // Landing page
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      { path: 'found', component: FoundItemsComponent },
      { path: 'lost', component: LostItemsComponent },
      { path: '', redirectTo: 'found', pathMatch: 'full' } // default dashboard route
    ]
  },

  { path: '**', redirectTo: '' } // wildcard fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
