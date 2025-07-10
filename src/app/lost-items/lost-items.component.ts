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
  styleUrls: ['./lost-items.component.css'] // optional if you use CSS
})
export class LostItemsComponent implements OnInit {
  items: LostItem[] = [];
  searchText: string = '';
  selectedCategory: string = '';

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getLostItems().subscribe((data: LostItem[]) => {
      this.items = data;
    });
  }

  filteredItems(): LostItem[] {
    const searchLower = this.searchText.toLowerCase();
    return this.items.filter(item =>
      item.name.toLowerCase().includes(searchLower) &&
      (this.selectedCategory === '' || item.category === this.selectedCategory)
    );
  }

  // Optional: reset filter
  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = '';
  }
}