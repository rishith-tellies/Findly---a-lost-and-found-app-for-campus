import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface LostItem {
  id: number;
  name: string;
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
        animate('300ms ease-out', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', 
          style({ transform: 'scale(0.5)', opacity: 0 }))
      ])
    ])
  ]
})
export class LostItemsComponent implements OnInit {
  items: LostItem[] = [];
  filteredItems: LostItem[] = [];
  searchText = '';
  selectedCategory = '';
  selectedItem: LostItem | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  
  // Claim functionality
  showClaimForm = false;
  claimMessage = '';
  isSendingClaim = false;

  categories = ['ID Card', 'Electronics', 'Books', 'Mess Card'];

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.items = this.getSampleData();
      this.applyFilters();
      this.isLoading = false;
    }, 1000); // Simulate loading delay
  }

  private getSampleData(): LostItem[] {
    return [
      {
        id: 1,
        name: 'Student ID Card',
        category: 'ID Card',
        description: 'Lost near the library, has photo and 2023 batch details',
        location: 'Library entrance',
        date: '2023-05-15',
        contact: 'john.doe@college.edu',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTioKTYh4Rt-jdwsOfaTQb_BMAHqY-TVNLLVg&s'
      },
      {
        id: 2,
        name: 'Wireless Earbuds',
        category: 'Electronics',
        description: 'Black wireless earbuds in a charging case',
        location: 'Computer lab',
        date: '2023-06-20',
        contact: 'sarah.smith@college.edu',
        imageUrl: 'https://images-cdn.ubuy.co.in/67d6979fc38f365f8c3f8352-wireless-earbuds-bluetooth-5-3-built-in.jpg'
      },
      {
        id: 3,
        name: 'Physics Textbook',
        category: 'Books',
        description: 'University Physics 15th edition with handwritten notes',
        location: 'Lecture Hall A',
        date: '2023-06-18',
        contact: 'mike.johnson@college.edu',
        imageUrl: 'https://www.vivadigital.in/vupload/books/book_160419153403_73.jpg'
      },
      {
        id: 4,
        name: 'Library Card',
        category: 'ID Card',
        description: 'College library card with barcode sticker',
        location: 'Library study area',
        date: '2023-06-22',
        contact: 'alex.wilson@college.edu',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxTWTMLoQwfJmNV1m6bqBjX7z4gUbMf8LZtQ&s'
      }
    ];
  }

  applyFilters(): void {
    const searchLower = this.searchText.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      (item.name.toLowerCase().includes(searchLower) ||
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
    
    // Simulate API call
    setTimeout(() => {
      console.log('Claim submitted for:', this.selectedItem?.name);
      console.log('Message:', this.claimMessage);
      console.log('Would send to:', this.selectedItem?.contact);
      
      this.isSendingClaim = false;
      this.showClaimForm = false;
      this.claimMessage = '';
      alert('Claim request submitted successfully!');
    }, 1500);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    this.closeDetail();
  }
}