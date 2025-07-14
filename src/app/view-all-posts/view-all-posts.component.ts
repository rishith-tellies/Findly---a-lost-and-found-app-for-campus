// src/app/dashboard/view-all-posts/view-all-posts.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-all-posts',
  templateUrl: './view-all-posts.component.html',
  styleUrls: ['./view-all-posts.component.css']
})
export class ViewAllPostsComponent implements OnInit {
  allPosts: any[] = [];
  isAdmin: boolean = false;

  ngOnInit(): void {
    // ✅ Check if admin from localStorage
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Dummy data
    this.allPosts = [
      {
        type: 'Found',
        title: 'Phone',
        location: 'Library',
        category: 'Electronics',
        imageUrl: 'https://via.placeholder.com/300x200?text=Phone'
      },
      {
        type: 'Lost',
        title: 'Wallet',
        location: 'Canteen',
        category: 'Accessories',
        imageUrl: 'https://via.placeholder.com/300x200?text=Wallet'
      },
      {
        type: 'Found',
        title: 'ID Card',
        location: 'Reception',
        category: 'Cards',
        imageUrl: 'https://via.placeholder.com/300x200?text=ID+Card'
      },
      {
        type: 'Lost',
        title: 'Notebook',
        location: 'Classroom',
        category: 'Stationery',
        imageUrl: 'https://via.placeholder.com/300x200?text=Notebook'
      }
    ];
  }

  // ✅ Admin-only delete function
  deletePost(index: number): void {
    this.allPosts.splice(index, 1);
    alert('Post deleted by admin.');
  }
}
