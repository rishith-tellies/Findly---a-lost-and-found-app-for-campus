import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:8888/api/items';

interface Category {
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
    
    this.http.get<Category[]>(`${API_BASE_URL}/categories`).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Failed to load categories', error);
        this.loadingCategories = false;
        this.categoryError = 'Failed to load categories. Please try again.';
        
        Swal.fire({
          icon: 'error',
          title: 'Category Error',
          text: this.categoryError,
          confirmButtonColor: '#d33',
          showCancelButton: true,
          cancelButtonText: 'Dismiss',
          confirmButtonText: 'Retry'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadCategories();
          }
        });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    this.selectedFile = file;
    
    // Create preview and convert to Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = reader.result as string;
      this.base64Image = this.imagePreview.split(',')[1]; // Extract Base64 part
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
      this.showAuthError();
      this.isLoading = false;
      return;
    }

    // Prepare the request body with Base64 data
    const requestBody = {
      title: this.title,
      description: this.description,
      status: this.type,
      category: this.categoryId,
      location: this.location,
      photoData: this.base64Image
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post<NewItemResponse>(`${API_BASE_URL}/items`, requestBody, { headers })
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            html: `Item submitted successfully!<br><small>ID: ${response._id}</small>`,
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.resetForm();
            this.router.navigate(['/dashboard', this.type]);
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.handleApiError(error);
        }
      });
  }

  private validateForm(): boolean {
    const errors = [];
    
    if (!this.title?.trim()) errors.push('Title is required');
    if (!this.description?.trim()) errors.push('Description is required');
    if (!this.location?.trim()) errors.push('Location is required');
    if (!this.categoryId) errors.push('Category is required');
    // Removed image validation
    // if (!this.base64Image) errors.push('Image is required');

    if (errors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        html: errors.join('<br>'),
        confirmButtonColor: '#d33'
      });
      return false;
    }
    return true;
  }

  private handleApiError(error: any): void {
    let errorMessage = 'An error occurred while submitting the item';
    
    if (error.status === 400) {
      errorMessage = error.error?.message || 'Missing or invalid fields';
    } else if (error.status === 401) {
      errorMessage = 'Please log in to submit items';
      this.router.navigate(['/login']);
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check your connection.';
    } else if (error.error?.details) {
      errorMessage += `<br><small>${error.error.details}</small>`;
    }

    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      html: errorMessage,
      confirmButtonColor: '#d33'
    });
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

  private showAuthError(): void {
    Swal.fire({
      icon: 'error',
      title: 'Authentication Required',
      text: 'Please log in to submit an item',
      confirmButtonColor: '#d33'
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }
}