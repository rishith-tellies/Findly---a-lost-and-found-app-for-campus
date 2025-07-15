import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http'; // ✅ Add this

interface LostItem {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  date: Date | string;
  contact?: string;
  imageUrl: string;
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
  searchText: string = '';
  selectedCategory: string = '';
  categories: string[] = [];

  isLoading = false;
  errorMessage: string | null = null;
  selectedItem: LostItem | null = null;

  isAdmin: boolean = false;
  currentUserEmail: string = '';

  showClaimForm = false;
  claimMessage = '';
  isSendingClaim = false;

  constructor(private http: HttpClient) {} // ✅ Inject HttpClient

  ngOnInit(): void {
    this.loadItems();
    const role = localStorage.getItem('userRole');
    this.isAdmin = role === 'admin';
    this.currentUserEmail = localStorage.getItem('userEmail') || '';
  }

  loadItems(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.http.get<LostItem[]>('http://172.21.11.36:8888/api/items?status=lost').subscribe({
      next: (data) => {
        this.items = data;
        this.filteredItems = data;
        this.categories = [...new Set(data.map(item => item.category))]; // Get unique categories
        this.isLoading = false;
      },
      error: (err) => {
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
    if (!this.claimMessage.trim()) {
      alert('Please enter a claim message.');
      return;
    }

    this.isSendingClaim = true;

    setTimeout(() => {
      console.log('Claim submitted for:', this.selectedItem?.title);
      console.log('Message:', this.claimMessage);
      console.log('Would send to:', this.selectedItem?.contact);

      this.isSendingClaim = false;
      this.showClaimForm = false;
      this.claimMessage = '';
      alert('Claim request submitted successfully!');
    }, 1500);
  }

  deletePost(index: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.items.splice(index, 1);
      this.applyFilters();
      alert('Post deleted successfully.');
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    this.closeDetail();
  }
}
