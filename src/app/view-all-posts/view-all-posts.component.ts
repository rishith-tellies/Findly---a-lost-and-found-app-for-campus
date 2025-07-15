import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface Post {
  type: 'Found' | 'Lost';
  title: string;
  location: string;
  category: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-view-all-posts',
  templateUrl: './view-all-posts.component.html',
  styleUrls: ['./view-all-posts.component.css'],
  animations: [
    trigger('zoomIn', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'scale(0.5)', opacity: 0 }))
      ])
    ])
  ]
})
export class ViewAllPostsComponent implements OnInit {
  allPosts: Post[] = [];
  filteredPosts: Post[] = [];
  selectedPost: Post | null = null;
  isAdmin: boolean = false;
  searchText: string = '';
  selectedCategory: string = '';
  categories: string[] = [];

  // Claim-related
  showClaimForm: boolean = false;
  claimMessage: string = '';

  ngOnInit(): void {
    const role = localStorage.getItem('userRole');
    this.isAdmin = role === 'admin';

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

    this.categories = [...new Set(this.allPosts.map(p => p.category))];
    this.applyFilters();
  }

  applyFilters(): void {
    const text = this.searchText.toLowerCase();
    this.filteredPosts = this.allPosts.filter(post =>
      (post.title.toLowerCase().includes(text) || post.location.toLowerCase().includes(text)) &&
      (this.selectedCategory === '' || post.category === this.selectedCategory)
    );
  }

  deletePost(index: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.allPosts.splice(index, 1);
      this.applyFilters();
      alert('Post deleted successfully.');
    }
  }

  showPostDetail(post: Post): void {
    this.selectedPost = post;
    this.showClaimForm = false;
  }

  closePostDetail(): void {
    this.selectedPost = null;
    this.showClaimForm = false;
  }

  sendClaimRequest(): void {
    if (!this.claimMessage.trim()) {
      alert('Please enter a message.');
      return;
    }

    alert(`✅ Claim request for "${this.selectedPost?.title}" sent with message: "${this.claimMessage}"`);
    this.claimMessage = '';
    this.showClaimForm = false;
    this.closePostDetail();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    this.closePostDetail();
  }
}
