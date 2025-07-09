import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ItemService {
  private foundItems: any[] = [
    {
      name: 'iPhone 14',
      description: 'Found near library',
      category: 'Electronics',
      imageUrl: 'https://via.placeholder.com/300x200?text=iPhone'
    },
    {
      name: 'ID Card',
      description: 'Found in mess',
      category: 'Cards',
      imageUrl: 'https://via.placeholder.com/300x200?text=ID+Card'
    }
  ];

  private lostItems: any[] = [
    {
      name: 'Laptop',
      description: 'Lost in lecture hall',
      category: 'Electronics',
      imageUrl: 'https://via.placeholder.com/300x200?text=Laptop'
    },
    {
      name: 'Mess Card',
      description: 'Lost in canteen',
      category: 'Cards',
      imageUrl: 'https://via.placeholder.com/300x200?text=Mess+Card'
    }
  ];

  getFoundItems(): Observable<any[]> {
    return of(this.foundItems);
  }

  getLostItems(): Observable<any[]> {
    return of(this.lostItems);
  }
}