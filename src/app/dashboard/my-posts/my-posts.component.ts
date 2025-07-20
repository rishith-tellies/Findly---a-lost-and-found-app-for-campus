import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {
  userPosts: any[] = [];
  showDeleteModal: boolean = false;
  selectedPostIndex: number | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserPosts();
  }

  fetchUserPosts(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:8888/api/items/mine').subscribe({
      next: (data) => {
        this.userPosts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user posts:', err);
        this.errorMessage = '⚠️ Failed to load your posts.';
        this.isLoading = false;
      }
    });
  }

  confirmDelete(index: number): void {
    this.selectedPostIndex = index;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedPostIndex = null;
  }

  deletePost(): void {
    if (this.selectedPostIndex !== null) {
      this.userPosts.splice(this.selectedPostIndex, 1);
      this.selectedPostIndex = null;
      this.showDeleteModal = false;
      alert('✅ Post deleted successfully!');
    }
  }
}
