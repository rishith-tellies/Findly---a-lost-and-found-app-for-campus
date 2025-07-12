import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import all your components
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AddItemComponent } from './add-item/add-item.component';
import { LayoutComponent } from './layout/layout.component';
import { FoundItemsComponent } from './found-items/found-items.component';
import { LostItemsComponent } from './lost-items/lost-items.component';
import { ViewAllPostsComponent } from './view-all-posts/view-all-posts.component';
import { MyPostsComponent } from './dashboard/my-posts/my-posts.component';
import { ProfileComponent } from './profile/profile.component';
import { InterfaceComponent } from './interface/interface.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    AddItemComponent,
    LayoutComponent,
    FoundItemsComponent,
    LostItemsComponent,
    ViewAllPostsComponent,
    MyPostsComponent,
    ProfileComponent,
    InterfaceComponent,
    AdminDashboardComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,              // ✅ Required for ngModel
    ReactiveFormsModule       // ✅ Required for formGroup
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
