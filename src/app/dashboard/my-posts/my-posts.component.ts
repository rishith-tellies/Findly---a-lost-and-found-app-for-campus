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

  ngOnInit(): void {
    // Dummy data (replace with actual API/localStorage logic)
    this.userPosts = [
      { type: 'Lost', title: 'Lost Wallet', date: '2025-07-10' },
      { type: 'Found', title: 'Found Keys', date: '2025-07-09' }
    ];
  }

  // Trigger modal with selected post
  confirmDelete(index: number): void {
    this.selectedPostIndex = index;
    this.showDeleteModal = true;
  }

  // Cancel modal
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedPostIndex = null;
  }

  // Delete post
  deletePost(): void {
    if (this.selectedPostIndex !== null) {
      this.userPosts.splice(this.selectedPostIndex, 1);
      this.selectedPostIndex = null;
      this.showDeleteModal = false;
      alert('✅ Post deleted successfully!');
    }
  }
}
