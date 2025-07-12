import { Component, OnInit } from '@angular/core';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  allPosts: any[] = [];

  ngOnInit(): void {
    // Dummy data
    this.allPosts = [
      { type: 'Found', title: 'Phone', location: 'Library', category: 'Electronics' },
      { type: 'Lost', title: 'Wallet', location: 'Canteen', category: 'Accessories' }
    ];
  }

  deletePost(index: number): void {
    this.allPosts.splice(index, 1);
    alert('Post deleted by admin.');
  }
}
