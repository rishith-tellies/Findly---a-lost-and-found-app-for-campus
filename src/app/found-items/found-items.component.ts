import { Component, OnInit, HostListener } from '@angular/core';

interface FoundItem {
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
  selectedCategory: number | null = null;

  showClaimForm = false;
  isSendingClaim = false;
  claimMessage = '';

  isAdmin = false;
  userEmail: string = '';

  categories = [
    { id: 1, name: 'ID Card' },
    { id: 2, name: 'Electronics' },
    { id: 3, name: 'Books' },
    { id: 4, name: 'Clothing' },
    { id: 5, name: 'Other' }
  ];

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.isAdmin = localStorage.getItem('userRole') === 'admin';

    this.fetchFoundItems();
  }

  // ✅ Load from localStorage
  fetchFoundItems(): void {
    this.isLoading = true;

    try {
      const allItems = JSON.parse(localStorage.getItem('items') || '[]');

      this.foundItems = allItems.filter(
        (item: any) => item.status === 'found'
      );

      this.filteredItemsList = [...this.foundItems];

      this.isLoading = false;
    } catch (error) {
      this.errorMessage = '⚠️ Failed to load found items.';
      this.isLoading = false;
    }
  }

  // 🔍 Search + Filter
  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchText.toLowerCase();

    this.filteredItemsList = this.foundItems.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search);

      const matchesCategory = this.selectedCategory
        ? item.categoryId == this.selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = null;
    this.applyFilters();
  }

  // 📦 Modal
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

  // 📨 Claim (Frontend simulation)
  sendClaimRequest(): void {
    if (!this.claimMessage.trim() || !this.selectedItem) {
      alert('Please enter a message to claim this item.');
      return;
    }

    this.isSendingClaim = true;

    setTimeout(() => {
      const items = JSON.parse(localStorage.getItem('items') || '[]');

      const updatedItems = items.map((item: any) =>
        item.id === this.selectedItem?.id
          ? { ...item, isClaimed: true }
          : item
      );

      localStorage.setItem('items', JSON.stringify(updatedItems));

      this.isSendingClaim = false;
      this.claimMessage = '';
      this.showClaimForm = false;

      alert('✅ Claim request sent (simulated)');
      this.closeDetail();
      this.fetchFoundItems();
    }, 1000);
  }

  // 🗑 Admin Delete
  deletePost(index: number): void {
    if (!this.isAdmin) return;

    const item = this.filteredItemsList[index];
    const confirmDelete = confirm('Are you sure you want to delete this item?');

    if (!confirmDelete) return;

    const allItems = JSON.parse(localStorage.getItem('items') || '[]');

    const updatedItems = allItems.filter((i: any) => i.id !== item.id);

    localStorage.setItem('items', JSON.stringify(updatedItems));

    this.fetchFoundItems();

    alert('🗑️ Item deleted.');
  }

  // 🎯 Category Name Helper
  getCategoryName(id: number): string {
    const category = this.categories.find(c => c.id == id);
    return category ? category.name : 'Other';
  }

  // ⌨️ ESC key close modal
  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeDetail();
  }

  // 🖼️ Fallback image
  handleImageError(event: any): void {
    event.target.src = 'assets/default-item.jpg';
  }
}