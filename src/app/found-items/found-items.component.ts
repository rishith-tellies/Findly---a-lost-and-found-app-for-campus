import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface FoundItem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contact: string;
  imageUrl: string;
  postedBy?: string;
  isClaimed?: boolean; // Add this line if needed
}

@Component({
  selector: 'app-found-items',
  templateUrl: './found-items.component.html',
  styleUrls: ['./found-items.component.css']
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
  token: string = '';
  userEmail: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.isAdmin = localStorage.getItem('userRole') === 'admin';
    this.fetchFoundItems();
  }

  fetchFoundItems(): void {
    this.isLoading = true;
    this.http.get<FoundItem[]>('http://localhost:8888/api/items?status=found').subscribe({
      next: (data) => {
        this.foundItems = data;
        this.filteredItemsList = data;
        this.categories = [...new Set(data.map(item => item.category))];
        this.isLoading = false;
      },
      error: () => {
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
    this.claimMessage = '';
    document.body.classList.add('modal-open');
  }

  closeDetail(): void {
    this.selectedItem = null;
    this.showClaimForm = false;
    this.claimMessage = '';
    document.body.classList.remove('modal-open');
  }

  sendClaimRequest(): void {
    if (!this.claimMessage.trim() || !this.selectedItem) {
      alert('Please enter a message to claim this item.');
      return;
    }

    if (!this.token) {
      alert('⚠️ You are not logged in.');
      return;
    }

    this.isSendingClaim = true;

    const itemId = this.selectedItem.id;
    const contactUrl = `http://localhost:8888/api/items/${itemId}/contact`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      message: this.claimMessage,
      email: this.userEmail
    };

    // Step 1: Send contact message
    this.http.post(contactUrl, body, { headers }).subscribe({
      next: () => {
        // Step 2: Mark as claimed
        this.markItemAsClaimed(itemId);
      },
      error: (err) => {
        this.isSendingClaim = false;
        if (err.status === 400) {
          alert('⚠️ You may already be the poster or haven’t contacted properly.');
        } else if (err.status === 401 || err.status === 403) {
          alert('🔒 Unauthorized. Please login.');
        } else {
          alert('❌ Failed to send claim message.');
        }
      }
    });
  }

  private markItemAsClaimed(itemId: number): void {
    const claimUrl = `http://localhost:8888/api/items/${itemId}/claim`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.http.patch(claimUrl, {}, { headers }).subscribe({
      next: () => {
        this.isSendingClaim = false;
        this.claimMessage = '';
        this.showClaimForm = false;
        alert('✅ Item successfully claimed and marked in backend!');
        this.closeDetail();
        this.fetchFoundItems(); // Refresh UI
      },
      error: (err) => {
        this.isSendingClaim = false;
        if (err.status === 400) {
          alert('⚠️ You must contact before claiming, or item is already yours.');
        } else {
          alert('❌ Failed to mark item as claimed.');
        }
      }
    });
  }

  deletePost(index: number): void {
    if (!this.isAdmin) return;
    const item = this.filteredItemsList[index];
    const confirmDelete = confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.http.delete(`http://localhost:8888/api/items/${item.id}`, { headers }).subscribe({
      next: () => {
        this.foundItems = this.foundItems.filter(i => i.id !== item.id);
        this.applyFilters();
        alert('🗑️ Item deleted.');
      },
      error: () => {
        alert('❌ Failed to delete item.');
      }
    });
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeDetail();
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/default-item.jpg';
  }
}
