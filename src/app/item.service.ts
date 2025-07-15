import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8888/api/items'; // Your backend API endpoint

  constructor(private http: HttpClient) { }

  // Get all items (lost or found)
  getItems(type: 'lost' | 'found'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?status=${type}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Create new item (with file upload)
  createItem(itemData: {
    title: string;
    description: string;
    location: string;
    category: string;
    status: 'lost' | 'found';
    file?: File;
  }): Observable<any> {
    const formData = new FormData();
    formData.append('title', itemData.title);
    formData.append('description', itemData.description);
    formData.append('location', itemData.location);
    formData.append('category', itemData.category);
    formData.append('status', itemData.status);
    
    if (itemData.file) {
      formData.append('file', itemData.file);
    }

    return this.http.post(this.apiUrl, formData, {
      headers: this.getAuthHeaders(false) // false = don't set Content-Type
    });
  }

  // Get items posted by current user
  getMyItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mine`, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete an item
  deleteItem(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${itemId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Helper method to get authorization headers
  private getAuthHeaders(includeContentType: boolean = true): HttpHeaders {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    return new HttpHeaders(headers);
  }
}