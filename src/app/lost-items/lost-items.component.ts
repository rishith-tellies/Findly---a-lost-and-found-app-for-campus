import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface LostItem {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  location: string;
  createdAt: string;
  image?: string;
  userEmail?: string;
  isClaimed?: boolean;
  status: string;
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
  selectedCategory: number | null = null;

  isLoading = false;
  errorMessage: string | null = null;
  selectedItem: LostItem | null = null;

  isAdmin = false;
  currentUserEmail = '';

  showClaimForm = false;
  claimMessage = '';
  isSendingClaim = false;

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  categories = [
    { id: 1, name: 'ID Card' },
    { id: 2, name: 'Electronics' },
    { id: 3, name: 'Books' },
    { id: 4, name: 'Clothing' },
    { id: 5, name: 'Other' }
  ];

  ngOnInit(): void {
    this.isAdmin = localStorage.getItem('userRole') === 'admin';
    this.currentUserEmail = localStorage.getItem('userEmail') || '';
    this.loadItems();
  }

  // ✅ Load from localStorage
  loadItems(): void {
    this.isLoading = true;

    try {
      const allItems = JSON.parse(localStorage.getItem('items') || '[]');

      this.items = allItems.filter(
        (item: any) => item.status === 'lost'
      );

      this.filteredItems = [...this.items];

      this.isLoading = false;
    } catch (error) {
      this.errorMessage = '⚠️ Failed to load lost items.';
      this.isLoading = false;
    }
  }

  // 🔍 Filters
  applyFilters(): void {
    const searchLower = this.searchText.toLowerCase();

    this.filteredItems = this.items.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower);

      const matchesCategory = this.selectedCategory
        ? item.categoryId == this.selectedCategory
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

  // 📦 Modal
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

  // 📨 Claim (frontend simulation)
  sendClaimRequest(): void {
    if (!this.claimMessage.trim() || !this.selectedItem) {
      this.showToastMessage('Please enter a claim message.', 'error');
      return;
    }

    this.isSendingClaim = true;

    setTimeout(() => {
      const allItems = JSON.parse(localStorage.getItem('items') || '[]');

      const updatedItems = allItems.map((item: any) =>
        item.id === this.selectedItem?.id
          ? { ...item, isClaimed: true }
          : item
      );

      localStorage.setItem('items', JSON.stringify(updatedItems));

      this.isSendingClaim = false;
      this.showClaimForm = false;
      this.claimMessage = '';

      this.showToastMessage('🎉 Claim submitted successfully!', 'success');

      this.closeDetail();
      this.loadItems();
    }, 1000);
  }

  // 🗑 Delete
  deletePost(index: number): void {
    if (!this.isAdmin) return;

    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const item = this.filteredItems[index];

    const allItems = JSON.parse(localStorage.getItem('items') || '[]');

    const updatedItems = allItems.filter((i: any) => i.id !== item.id);

    localStorage.setItem('items', JSON.stringify(updatedItems));

    this.loadItems();

    this.showToastMessage('✅ Post deleted successfully.', 'success');
  }

  // 🎯 Category Name
  getCategoryName(id: number): string {
    const category = this.categories.find(c => c.id == id);
    return category ? category.name : 'Other';
  }

  // ⌨️ ESC close
  @HostListener('document:keydown.escape')
  handleKeyboardEvent(): void {
    this.closeDetail();
  }

  // 🔔 Toast
  showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}