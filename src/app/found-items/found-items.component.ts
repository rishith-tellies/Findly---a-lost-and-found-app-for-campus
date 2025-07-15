import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // ✅ Add this

interface FoundItem {
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contact: string;
  imageUrl: string;
}

@Component({
  selector: 'app-found-items',
  templateUrl: './found-items.component.html',
})
export class FoundItemsComponent implements OnInit {
  foundItems: FoundItem[] = [];
  filteredItemsList: FoundItem[] = [];

  isLoading = false;
  errorMessage = '';
  selectedItem: FoundItem | null = null;
  searchText = '';
  selectedCategory = '';
  showClaimForm = false;
  isSendingClaim = false;
  claimMessage = '';
  isAdmin = false;

  categories: string[] = ['ID Card', 'Electronics', 'Books', 'Clothing', 'Other'];

  // ✅ Inject HttpClientersfvfd
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFoundItems();
    const role = localStorage.getItem('userRole');
    this.isAdmin = role === 'admin';
  }

  // ✅ Fetch from real API
  fetchFoundItems(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<FoundItem[]>('http://172.21.11.36:8888/api/items?status=found').subscribe({
      next: (data) => {
        this.foundItems = data;
        this.filteredItemsList = data;
        this.categories = [...new Set(data.map(item => item.category))]; // Unique categories
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = '⚠️ Failed to load found items.';
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchText.toLowerCase();
    const category = this.selectedCategory;

    this.filteredItemsList = this.foundItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
      const matchesCategory = category ? item.category === category : true;
      return matchesSearch && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  showItemDetail(item: FoundItem): void {
    this.selectedItem = item;
    this.showClaimForm = false;
    document.body.classList.add('modal-open');
  }

  closeDetail(): void {
    this.selectedItem = null;
    this.showClaimForm = false;
    document.body.classList.remove('modal-open');
  }

  sendClaimRequest(): void {
    if (!this.claimMessage.trim()) {
      alert('Please enter a claim message.');
      return;
    }

    this.isSendingClaim = true;

    setTimeout(() => {
      alert('Claim sent successfully!');
      this.claimMessage = '';
      this.isSendingClaim = false;
      this.closeDetail();
    }, 1000);
  }

  deletePost(index: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.foundItems.splice(index, 1);
      this.applyFilters();
    }
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/default-item.jpg';
  }
}
