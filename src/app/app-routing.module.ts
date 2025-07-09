import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FoundItemsComponent } from './found-items/found-items.component';
import { LostItemsComponent } from './lost-items/lost-items.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  // ✅ Show login on first load
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ✅ Login page route
  { path: 'login', component: LoginPageComponent },

  // ✅ Protected layout routes (after login)
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      { path: 'found', component: FoundItemsComponent },
      { path: 'lost', component: LostItemsComponent },
      { path: '', redirectTo: 'found', pathMatch: 'full' }
    ]
  },

  // ✅ Wildcard redirect
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
