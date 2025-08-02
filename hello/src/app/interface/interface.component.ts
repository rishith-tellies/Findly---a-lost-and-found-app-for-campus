import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent {
  constructor(private router: Router) {}

  // ✅ Navigate to Login Page
  onGetStarted(): void {

    const interfacePage = document.getElementById('interfacePage');

    if (interfacePage) {
      interfacePage.classList.add('scroll-up-out');

      // Wait for animation to finish before routing
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000); // must match animation duration
    }

    this.router.navigate(['/login']);

  }
}
