import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface LostItem {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: Date | string;
  contact?: string;
  imageUrl: string;
  isClaimed?: boolean;
}

@Component({
  selector: 'app-lost-items',
  templateUrl: './lost-items.component.html',
  styleUrls: ['./lost-items.component.css'],
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
export class LostItemsComponent implements OnInit {
  items: LostItem[] = [];
  filteredItems: LostItem[] = [];
  searchText = '';
  selectedCategory = '';
  categories: string[] = [];

  isLoading = false;
  errorMessage: string | null = null;
  selectedItem: LostItem | null = null;

  isAdmin = false;
  currentUserEmail = '';
  showClaimForm = false;
  claimMessage = '';
  isSendingClaim = false;

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadItems();
    this.isAdmin = localStorage.getItem('userRole') === 'admin';
    this.currentUserEmail = localStorage.getItem('userEmail') || '';
  }

  loadItems(): void {
    this.isLoading = true;
    this.http.get<LostItem[]>('http://localhost:8888/api/items?status=lost').subscribe({
      next: (data) => {
        this.items = data;
        this.filteredItems = data;
        this.categories = [...new Set(data.map(item => item.category))];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = '⚠️ Failed to load lost items.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const searchLower = this.searchText.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      (item.title.toLowerCase().includes(searchLower) ||
       item.description.toLowerCase().includes(searchLower)) &&
      (this.selectedCategory === '' || item.category === this.selectedCategory)
    );
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  showItemDetail(item: LostItem): void {
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
    if (!this.claimMessage.trim() || !this.selectedItem) {
      this.showToastMessage('Please enter a claim message.', 'error');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      this.showToastMessage('You must be logged in to claim this item.', 'error');
      return;
    }

    this.isSendingClaim = true;
    const itemId = this.selectedItem._id || this.selectedItem.id;
    const headers = {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };

    const contactUrl = `http://localhost:8888/api/items/${itemId}/contact`;
    const claimUrl = `http://localhost:8888/api/items/${itemId}/claim`;

    this.http.post(contactUrl, { message: this.claimMessage }, headers).subscribe({
      next: () => {
       this.http.patch(claimUrl, {}, {
  headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
  responseType: 'text'  // 👈 prevent JSON parse error
}).subscribe({
  next: () => {
    this.isSendingClaim = false;
    this.showClaimForm = false;
    this.claimMessage = '';
    this.showToastMessage('🎉 Claim submitted and item marked as claimed!', 'success');
    if (this.selectedItem) {
      this.selectedItem.isClaimed = true;
      this.selectedItem.category = 'CLAIMED ✅';
    }
    this.closeDetail();
  },
  error: (err) => {
    this.isSendingClaim = false;
    const msg = this.extractErrorMessage(err);
    this.showToastMessage(`❌ Could not mark as claimed: ${msg}`, 'error');
  }
});

      },
      error: (err) => {
        this.isSendingClaim = false;
        const msg = this.extractErrorMessage(err);
        this.showToastMessage(`❌ Could not send message: ${msg}`, 'error');
      }
    });
  }

 private extractErrorMessage(err: any): string {
  if (!err) return 'Unknown error';

  // If it's plain text
  if (typeof err.error === 'string') return err.error;

  // If backend returns an object with a message
  if (err.error && typeof err.error === 'object') {
    if (err.error.message) return err.error.message;
    if (err.error.error) return err.error.error; // sometimes nested as `error`
  }

  // Fallback: stringify the whole object
  return JSON.stringify(err.error || err);
}


  deletePost(index: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.items.splice(index, 1);
      this.applyFilters();
      this.showToastMessage('✅ Post deleted successfully.', 'success');
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(): void {
    this.closeDetail();
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
