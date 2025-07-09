import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InterfaceComponent } from './interface/interface.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LayoutComponent } from './layout/layout.component';
import { FoundItemsComponent } from './found-items/found-items.component';
import { LostItemsComponent } from './lost-items/lost-items.component';

const routes: Routes = [
  // 🌟 Default landing page (Interface - Get Started)
  { path: '', component: InterfaceComponent },

  // 🔐 Login page
  { path: 'login', component: LoginPageComponent },

  // 📝 Registration page
  { path: 'register', component: RegistrationComponent },

  // 🗂️ Dashboard (admin/student views)
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      { path: 'found', component: FoundItemsComponent },
      { path: 'lost', component: LostItemsComponent },
      { path: '', redirectTo: 'found', pathMatch: 'full' }
    ]
  },

  // 🚫 Fallback route
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
