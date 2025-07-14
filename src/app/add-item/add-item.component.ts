import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html'
})
export class AddItemComponent implements OnInit {
  type: 'lost' | 'found' = 'found';
  itemName = '';
  description = '';
  location = '';
  category = '';
  imageUrl: string | null = null;

  categories: string[] = ['Electronics', 'Books', 'Cards', 'Others'];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const paramType = this.route.snapshot.paramMap.get('type');
    this.type = paramType === 'lost' ? 'lost' : 'found';
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.itemName || !this.description || !this.location || !this.category || !this.imageUrl) return;

    Swal.fire({
      icon: 'success',
      title: `${this.type === 'lost' ? 'Lost' : 'Found'} item submitted successfully!`,
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      const targetRoute = this.type === 'lost' ? 'lost' : 'found';
      this.router.navigate(['/dashboard', targetRoute]);
    });
  }
}
