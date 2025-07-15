import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemComponent } from './add-item/add-item.component';
import { ResetComponent } from './reset/reset.component';
import { InterfaceComponent } from './interface/interface.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutComponent } from './layout/layout.component';
import { FoundItemsComponent } from './found-items/found-items.component';
import { LostItemsComponent } from './lost-items/lost-items.component';
import { MyPostsComponent } from './dashboard/my-posts/my-posts.component';
import { ViewAllPostsComponent } from './view-all-posts/view-all-posts.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminPageComponent } from './admin-page/admin-page.component'; // ✅ Import your new admin component

const routes: Routes = [
  // Public routes
  { path: '', component: InterfaceComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset', component: ResetComponent }, // ✅ Added reset route
  { path: 'add-item/:type', component: AddItemComponent },
  { path: 'layout', component: LayoutComponent },
  { path: 'profile', component: ProfileComponent },

  // Student dashboard
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      { path: 'found', component: FoundItemsComponent },
      { path: 'lost', component: LostItemsComponent },
      { path: 'my-posts', component: MyPostsComponent },
      { path: 'view-all', component: ViewAllPostsComponent },
      { path: '', redirectTo: 'found', pathMatch: 'full' }
    ]
  },

  

  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: 'found', component: AdminPageComponent },
      { path: 'lost', component: AdminPageComponent },
      { path: 'my-posts', component: AdminPageComponent },
      { path: 'view-all', component: AdminPageComponent },
      { path: '', redirectTo: 'view-all', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' } // Wildcard route to redirect unknown paths


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
