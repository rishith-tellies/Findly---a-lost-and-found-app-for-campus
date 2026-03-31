import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private storageKey = 'items';

  constructor() {}

  // ✅ Get all items
  getItems(type: 'lost' | 'found') {
    const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return items.filter((item: any) => item.status === type);
  }

  // ✅ Add new item
  createItem(itemData: any) {
    const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

    const newItem = {
      id: Date.now(),
      ...itemData,
      createdAt: new Date()
    };

    items.push(newItem);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  // ✅ Get user's items (optional)
  getMyItems() {
    const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const userEmail = localStorage.getItem('userEmail');

    return items.filter((item: any) => item.userEmail === userEmail);
  }

  // ✅ Delete item
  deleteItem(itemId: number) {
    let items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    items = items.filter((item: any) => item.id !== itemId);

    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}