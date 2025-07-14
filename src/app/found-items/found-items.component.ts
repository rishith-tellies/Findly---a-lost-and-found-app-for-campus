import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface FoundItem {
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
  selector: 'app-found-items',
  templateUrl: './found-items.component.html',
  styleUrls: ['./found-items.component.css'],
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
export class FoundItemsComponent implements OnInit {
  items: FoundItem[] = [];
  filteredItems: FoundItem[] = [];
  searchText = '';
  selectedCategory = '';

  isAdmin: boolean = true; // 🔁 hardcoded for now (remove localStorage)

  selectedItem: FoundItem | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  
  // Claim functionality
  showClaimForm = false;
  claimMessage = '';
  isSendingClaim = false;


  categories = ['ID Card', 'Electronics', 'Books', 'Mess Card'];

  ngOnInit(): void {

    // ✅ Just fetch items — no localStorage check
    this.itemService.getFoundItems().subscribe(data => {
      this.items = data;
    });

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

  private getSampleData(): FoundItem[] {
    return [
      {
        id: 1,
        name: 'Student ID Card',
        category: 'ID Card',
        description: 'Found near the cafeteria, has photo and 2023 batch details',
        location: 'Cafeteria entrance',
        date: '2023-05-15',
        contact: 'found-items@college.edu',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEpJHSx4mOEDVxzoGQ1tLbhdPogcu-XEJO7g&s'
      },
      {
        id: 2,
        name: 'Wireless Earbuds',
        category: 'Electronics',
        description: 'White wireless earbuds found in computer lab',
        location: 'Computer lab',
        date: '2023-06-20',
        contact: 'found-items@college.edu',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmmFgY_e-pwSeA5zA9q9V34Y3H4Z3PmtI9ww&s'
      },
      {
        id: 3,
        name: 'Chemistry Textbook',
        category: 'Books',
        description: 'Organic Chemistry 12th edition, marked with notes',
        location: 'Library',
        date: '2023-06-10',
        contact: 'library@college.edu',
        imageUrl: 'https://chemistryhall.com/wp-content/uploads/2019/06/clayden.jpg'
      },
      {
        id: 4,
        name: 'Mess Card',
        category: 'Mess Card',
        description: 'Found near hostel block A, has student photo and ID',
        location: 'Hostel Block A',
        date: '2023-06-05',
        contact: 'hostel-admin@college.edu',
        imageUrl: 'https://www.printasia.in/pub/media/catalog/product/m/e/mess_catering_tiffin_food_joint_images_background_psd_designs_5_.jpg'
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


  deletePost(index: number): void {
    this.items.splice(index, 1);
    alert(' Post deleted successfully.');
  }
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

 showItemDetail(item: FoundItem): void {
  console.log('Showing item:', item); // Debug log
  this.selectedItem = { ...item }; // Create a new object to ensure change detection
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
  handleImageError(event: any): void {
  event.target.src = 'assets/default-item.jpg';
}
}

