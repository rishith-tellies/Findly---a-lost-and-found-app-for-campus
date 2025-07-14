import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-found-items',
  templateUrl: './found-items.component.html'
})
export class FoundItemsComponent implements OnInit {
  items: any[] = [];
  searchText = '';
  selectedCategory = '';
  isAdmin: boolean = false;
  

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    // Check admin status on load
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log("Admin mode:", this.isAdmin); // For debugging

    // Load items
    this.itemService.getFoundItems().subscribe(data => {
      this.items = data;
    });
  }

  filteredItems() {
    return this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
      (this.selectedCategory === '' || item.category === this.selectedCategory)
    );
  }

  deletePost(index: number): void {
    this.items.splice(index, 1);
    alert('🗑️ Post deleted successfully.');
  }
}
