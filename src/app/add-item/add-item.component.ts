import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html'
})
export class AddItemComponent implements OnInit {
  type: 'lost' | 'found' = 'found';
  isLoading = false;

  // Form fields
  title = '';
  description = '';
  location = '';
  category = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  categories: string[] = ['Electronics', 'Books', 'Cards', 'Others'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type') === 'lost' ? 'lost' : 'found';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload a JPEG, JPG, or PNG image',
        confirmButtonColor: '#d33'
      });
      input.value = ''; // Clear the file input
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Maximum file size is 5MB',
        confirmButtonColor: '#d33'
      });
      input.value = ''; // Clear the file input
      return;
    }

    this.selectedFile = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
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

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('location', this.location);
    formData.append('category', this.category);
    formData.append('status', this.type);
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Let browser set Content-Type with boundary
    });

    this.http.post('http://localhost:8888/api/items', formData, { headers })
      .subscribe({
        next: () => this.handleSuccess(),
        error: (error) => {
          console.error('API Error:', error);
          this.handleError(error);
        }
      });
  }

  private validateForm(): boolean {
    const errors = [];
    
    if (!this.title) errors.push('Title is required');
    if (!this.description) errors.push('Description is required');
    if (!this.location) errors.push('Location is required');
    if (!this.category) errors.push('Category is required');
    if (!this.selectedFile) errors.push('Image is required');

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

  private handleSuccess(): void {
    this.isLoading = false;
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: `Item marked as ${this.type} has been submitted`,
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/dashboard', this.type]);
    });
  }

  private handleError(error: any): void {
    this.isLoading = false;
    
    let errorMessage = 'An error occurred while submitting the item';
    
    if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check your connection.';
    } else if (error.status === 401) {
      errorMessage = 'Your session has expired. Please log in again.';
      this.router.navigate(['/login']);
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: errorMessage,
      confirmButtonColor: '#d33'
    });
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