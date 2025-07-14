import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  allPosts: any[] = [];

  ngOnInit(): void {
    const posts = localStorage.getItem('allPosts');
    this.allPosts = posts ? JSON.parse(posts) : [];
  }

  deletePost(index: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      this.allPosts.splice(index, 1);
      alert('Post deleted by admin.');
      localStorage.setItem('allPosts', JSON.stringify(this.allPosts));
    }
  }
}
