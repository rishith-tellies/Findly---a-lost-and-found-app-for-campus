import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {
    this.fetchUserPosts();
  }

  // ✅ Load from localStorage instead of API
  fetchUserPosts(): void {
    this.isLoading = true;

    try {
      const allItems = JSON.parse(localStorage.getItem('items') || '[]');
      const userEmail = localStorage.getItem('userEmail');

      this.userPosts = allItems.filter(
        (item: any) => item.userEmail === userEmail
      );

      this.isLoading = false;
    } catch (err) {
      console.error('Error loading posts:', err);
      this.errorMessage = '⚠️ Failed to load your posts.';
      this.isLoading = false;
    }
  }

  confirmDelete(index: number): void {
    this.selectedPostIndex = index;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedPostIndex = null;
  }

  // ✅ Delete from localStorage
  deletePost(): void {
    if (this.selectedPostIndex !== null) {
      const allItems = JSON.parse(localStorage.getItem('items') || '[]');

      const postToDelete = this.userPosts[this.selectedPostIndex];

      const updatedItems = allItems.filter(
        (item: any) => item.id !== postToDelete.id
      );

      localStorage.setItem('items', JSON.stringify(updatedItems));

      // refresh UI
      this.fetchUserPosts();

      this.selectedPostIndex = null;
      this.showDeleteModal = false;

      alert('✅ Post deleted successfully!');
    }
  }
}