import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-lost-items',
  templateUrl: './lost-items.component.html'
})
export class LostItemsComponent implements OnInit {
  items: any[] = [];
  searchText: string = '';
  selectedCategory: string = '';

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getLostItems().subscribe((data: any[]) => {
      this.items = data;
    });
  }

  filteredItems() {
    return this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
      (this.selectedCategory === '' || item.category === this.selectedCategory)
    );
  }
}
