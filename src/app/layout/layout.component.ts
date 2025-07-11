import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
// import { ToastrService } from 'ngx-toastr'; // Uncomment if using Toastr

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  sidebarOpen = false;
  showDropdown = false;
  showLogoutModal = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    // private toastr: ToastrService // Uncomment if using Toastr
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // Called when logout button is clicked
  confirmLogout(): void {
    this.showLogoutModal = true;
  }

  // Called when "No" is clicked in modal
  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  // Called when "Yes" is clicked in modal
  logoutConfirmed(): void {
    this.authService.logout();
    this.showLogoutModal = false;
    this.sidebarOpen = false;

    // ✅ Option 1: Simple alert
    alert('✅ Logged out successfully');

    // ✅ Option 2: Toast (if using ngx-toastr)
    // this.toastr.success('Logged out successfully');

    this.router.navigate(['/login']);
  }
}
