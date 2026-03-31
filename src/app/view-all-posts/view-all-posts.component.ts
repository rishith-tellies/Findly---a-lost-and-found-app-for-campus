import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface Post {
  id: number;
  status: 'lost' | 'found';
  title: string;
  location: string;
  categoryId: number;
  image?: string;
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

  isAdmin = false;

  searchText = '';
  selectedCategory: number | null = null;

  categories = [
    { id: 1, name: 'ID Card' },
    { id: 2, name: 'Electronics' },
    { id: 3, name: 'Books' },
    { id: 4, name: 'Clothing' },
    { id: 5, name: 'Other' }
  ];

  showClaimForm = false;
  claimMessage = '';

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.isAdmin = localStorage.getItem('userRole') === 'admin';
    this.fetchPosts();
  }

  // ✅ Load from localStorage
  fetchPosts(): void {
    this.isLoading = true;

    try {
      const data = JSON.parse(localStorage.getItem('items') || '[]');

      this.allPosts = data;
      this.applyFilters();

      this.isLoading = false;
    } catch (err) {
      console.error(err);
      this.errorMessage = '⚠️ Failed to fetch posts.';
      this.isLoading = false;
    }
  }

  // 🔍 Filter
  applyFilters(): void {
    const text = this.searchText.toLowerCase();

    this.filteredPosts = this.allPosts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(text) ||
        post.location.toLowerCase().includes(text);

      const matchesCategory = this.selectedCategory
        ? post.categoryId == this.selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = null;
    this.applyFilters();
  }

  // 🗑 Delete (Admin)
  deletePost(index: number): void {
    if (!this.isAdmin) return;

    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const post = this.filteredPosts[index];

    const allItems = JSON.parse(localStorage.getItem('items') || '[]');

    const updatedItems = allItems.filter((item: any) => item.id !== post.id);

    localStorage.setItem('items', JSON.stringify(updatedItems));

    this.fetchPosts();
  }

  // 📦 Modal
  showPostDetail(post: Post): void {
    this.selectedPost = post;
    this.showClaimForm = false;
  }

  closePostDetail(): void {
    this.selectedPost = null;
    this.showClaimForm = false;
  }

  // 📨 Claim simulation
  sendClaimRequest(): void {
    if (!this.claimMessage.trim()) {
      alert('Please enter a message.');
      return;
    }

    setTimeout(() => {
      const items = JSON.parse(localStorage.getItem('items') || '[]');

      const updatedItems = items.map((item: any) =>
        item.id === this.selectedPost?.id
          ? { ...item, isClaimed: true }
          : item
      );

      localStorage.setItem('items', JSON.stringify(updatedItems));

      alert('✅ Claim request sent successfully');

      this.claimMessage = '';
      this.showClaimForm = false;

      this.closePostDetail();
      this.fetchPosts();
    }, 500);
  }

  // 🎯 Category name
  getCategoryName(id: number): string {
    const category = this.categories.find(c => c.id == id);
    return category ? category.name : 'Other';
  }

  // ⌨️ ESC close
  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closePostDetail();
  }
}