import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

interface Post {
  _id: string;
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
  isAdmin: boolean = true; // Set this based on actual admin status
  searchText: string = '';
  selectedCategory: string = '';
  categories: string[] = [];
  showClaimForm = false;
  claimMessage = '';
  isLoading = false;
  isDeleting = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkAdminStatus();
    this.fetchPosts();
  }

  checkAdminStatus(): void {
    // Implement your actual admin check logic here
    // For example, check a token or user role
    const token = localStorage.getItem('authToken');
    this.isAdmin = !!token; // Simple example - adjust according to your auth system
  }

  fetchPosts(): void {
    this.isLoading = true;
    this.http.get<Post[]>('http://localhost:8888/api/items').subscribe({
      next: (data) => {
        this.allPosts = data;
        this.categories = [...new Set(data.map(p => p.category))];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.errorMessage = '⚠️ Failed to fetch posts.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const text = this.searchText.toLowerCase();
    this.filteredPosts = this.allPosts.filter(post =>
      (post.title.toLowerCase().includes(text) || 
       post.location.toLowerCase().includes(text)) &&
      (this.selectedCategory === '' || post.category === this.selectedCategory)
    );
  }

  deletePost(id: string, index: number): void {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    this.isDeleting = true;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.delete(`http://172.21.11.36:8888/api/admin/items/:id/inappropriate ${id}`, { headers })
      .subscribe({
        next: () => {
          this.allPosts = this.allPosts.filter(post => post._id !== id);
          this.applyFilters();
          this.isDeleting = false;
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert(`⚠️ Failed to delete post. Error: ${err.message || 'Unknown error'}`);
          this.isDeleting = false;
        }
      });
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