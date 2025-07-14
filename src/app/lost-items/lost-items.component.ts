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
  styleUrls: ['./lost-items.component.css']
})
export class LostItemsComponent implements OnInit {
  items: LostItem[] = [];
  searchText: string = '';
  selectedCategory: string = '';
  isAdmin: boolean = true; // ✅ Hardcoded for now (API role-based later)

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

  deletePost(index: number): void {
    this.items.splice(index, 1);
    alert(' Post deleted successfully by admin.');
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = '';
  }
}
