import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent {

  constructor(private router: Router) {}

  onGetStarted(): void {
    const interfacePage = document.getElementById('interfacePage');

    if (interfacePage) {
      interfacePage.classList.add('scroll-up-out');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    } else {
      this.router.navigate(['/login']);
    }
  }
}