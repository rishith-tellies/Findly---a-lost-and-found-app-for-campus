import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_BASE_URL = 'http://localhost:8888/api/items';

interface Category {
  _id: any;
  id: number;
  name: string;
  description: string;
}

interface NewItemResponse {
  _id: string;
  title: string;
  description: string;
  status: 'lost' | 'found';
  category: number;
  location?: string;
  imageUrl?: string;
  photoData?: string;
  createdAt: string;
}

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  type: 'lost' | 'found' = 'found';
  isLoading = false;
  loadingCategories = false;
  categoryError = '';
  showBase64 = false;

  // Toast Alert
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  // Form fields
  title = '';
  description = '';
  location = '';
  categoryId: number | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  base64Image: string | null = null;

  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type') === 'lost' ? 'lost' : 'found';
    this.loadCategories();
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.categoryError = '';

    this.http.get<Category[]>(`http://localhost:8888/api/categories`).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: () => {
        this.loadingCategories = false;
        this.showToast('Failed to load categories. Please try again.', 'error');
      }
    });
  }

  onCategoryChange(): void {
    const selectedCategory = this.categories.find(cat => cat._id.$oid === this.categoryId);
    if (selectedCategory) {
      this.categoryId = selectedCategory._id.$oid;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.base64Image = this.imagePreview.split(',')[1];
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.base64Image = null;
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  toggleBase64(): void {
    this.showBase64 = !this.showBase64;
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.isLoading = true;
    const token = localStorage.getItem('authToken');

    if (!token) {
      this.showToast('Please log in to submit an item.', 'error');
      this.router.navigate(['/login']);
      return;
    }

    const requestBody = {
      title: this.title,
      description: this.description,
      status: this.type,
      categoryId: this.categoryId,
      location: this.location,
      photoData: this.base64Image
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(`${API_BASE_URL}`, requestBody, {
  headers,
  responseType: 'text'
}).subscribe({
  next: (res) => {
    this.isLoading = false;
    this.showToast('Item posted successfully ✅', 'success');
    this.resetForm();
    setTimeout(() => this.router.navigate(['/dashboard', this.type]), 2000);
  },
  error: (err) => {
    this.isLoading = false;
    this.showToast('Failed to submit item', 'error');
    console.error(err);
  }
});

  }

  private validateForm(): boolean {
    const errors = [];

    if (!this.title.trim()) errors.push('Title is required');
    if (!this.description.trim()) errors.push('Description is required');
    if (!this.location.trim()) errors.push('Location is required');
    if (!this.categoryId) errors.push('Category is required');

    if (errors.length > 0) {
      this.showToast(errors.join(', '), 'error');
      return false;
    }
    return true;
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.location = '';
    this.categoryId = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.base64Image = null;
    this.showBase64 = false;
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  showToast(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 3000);
  }
}
