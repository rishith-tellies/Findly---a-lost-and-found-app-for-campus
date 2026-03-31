import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Category {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  type: 'lost' | 'found' = 'found';
  isLoading = false;
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type') === 'lost' ? 'lost' : 'found';
    this.loadCategories();
  }

  // ✅ STATIC categories (no API)
  loadCategories(): void {
    this.categories = [
      { id: 1, name: 'Electronics', description: 'Phones, gadgets' },
      { id: 2, name: 'Books', description: 'Notes, textbooks' },
      { id: 3, name: 'Accessories', description: 'Wallets, bags' },
      { id: 4, name: 'Clothing', description: 'Clothes and wearables' }
    ];
  }

  onCategoryChange(): void {
    // optional logic if needed
  }

  // ✅ File upload preview
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

  // ✅ MAIN SUBMIT (localStorage)
  onSubmit(): void {
    if (!this.validateForm()) return;

    const newItem = {
      id: Date.now(),
      title: this.title,
      description: this.description,
      status: this.type,
      categoryId: this.categoryId,
      location: this.location,
      image: this.base64Image,
      createdAt: new Date(),
      userEmail: localStorage.getItem('userEmail')
    };

    const items = JSON.parse(localStorage.getItem('items') || '[]');
    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));

    this.showToast('Item posted successfully ✅', 'success');
    this.resetForm();

    setTimeout(() => {
      this.router.navigate(['/dashboard', this.type]);
    }, 1000);
  }

  // ✅ Validation
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
    setTimeout(() => (this.showAlert = false), 3000);
  }
}