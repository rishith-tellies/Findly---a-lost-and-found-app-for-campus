import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module'; // ✅ Must come after declarations


import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'; // ✅ For router-outlet

import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { AddItemComponent } from './add-item/add-item.component';
import { ResetComponent } from './reset/reset.component';



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
    ResetComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,  
    AdminPageComponent,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule  // ✅ Keep this at the bottom of imports if possible
    BrowserAnimationsModule // ✅ Only this is needed for routing


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
