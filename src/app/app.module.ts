import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module'; // ✅ Must come after declarations

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { FoundItemsComponent } from './found-items/found-items.component';
import { LostItemsComponent } from './lost-items/lost-items.component';
import { LayoutComponent } from './layout/layout.component';
import { RegistrationComponent } from './registration/registration.component';
import { InterfaceComponent } from './interface/interface.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ResetComponent } from './reset/reset.component';

@NgModule({
  declarations: [
    AppComponent,
    AddItemComponent,
    LoginPageComponent,
    FoundItemsComponent,
    LostItemsComponent,
    LayoutComponent,
    RegistrationComponent,
    InterfaceComponent,
    ForgotPasswordComponent,
    ResetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule  // ✅ Keep this at the bottom of imports if possible
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
