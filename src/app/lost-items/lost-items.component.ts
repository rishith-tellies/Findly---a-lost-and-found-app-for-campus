import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';

interface LostItem {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-lost-items',
  templateUrl: './lost-items.component.html',
  styleUrls: ['./lost-items.component.css'] // Optional
})
export class LostItemsComponent implements OnInit {
  items: LostItem[] = [];
  searchText: string = '';
  selectedCategory: string = '';
  isAdmin: boolean = false;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getLostItems().subscribe((data: LostItem[]) => {
      this.items = data;
    });

    // Check if the user is admin from localStorage
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
  }

  filteredItems(): LostItem[] {
    const searchLower = this.searchText.toLowerCase();
    return this.items.filter(item =>
      item.name.toLowerCase().includes(searchLower) &&
      (this.selectedCategory === '' || item.category === this.selectedCategory)
    );
  }

  // ✅ Admin delete function
  deletePost(index: number): void {
    this.items.splice(index, 1);
    alert('Post deleted by admin.');
  }

  // Optional: reset filter
  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = '';
  }
}
