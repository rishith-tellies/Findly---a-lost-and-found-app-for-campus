import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { FoundItemsComponent } from './found-items/found-items.component';
import { LostItemsComponent } from './lost-items/lost-items.component';
import { LayoutComponent } from './layout/layout.component';
import { RegistrationComponent } from './registration/registration.component';
import { InterfaceComponent } from './interface/interface.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// ✅ Import routing module that contains all route definitions
import { AppRoutingModule } from './app-routing.module';
import { AddItemComponent } from './add-item/add-item.component';

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
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule // ✅ Only this is needed for routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
