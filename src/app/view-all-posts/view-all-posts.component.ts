import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  showClaimForm = false;
  claimMessage = '';
  isLoading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const role = localStorage.getItem('userRole');
    this.isAdmin = role === 'admin';

    this.fetchPosts();
  }

  fetchPosts(): void {
    this.isLoading = true;
    this.http.get<Post[]>('http://172.21.11.36:8888/api/items').subscribe({
      next: (data) => {
        this.allPosts = data;
        this.categories = [...new Set(data.map(p => p.category))];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = '⚠️ Failed to fetch posts.';
        this.isLoading = false;
      }
    });
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
