import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <input [ngModel]="searchInput()" (ngModelChange)="searchItems($event)" placeholder="Search..." />

    <ul>
      <li *ngFor="let item of paginatedAndFilteredItems()">{{ item.name }}</li>
    </ul>

    <button (click)="goToPreviousPage()">Previous</button>
    pag. {{ currentPage() }}
    <button (click)="goToNextPage()">Next</button>
  `,
  styles: [],
})
export class AppComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
  ];

  readonly firstPage = 1;
  itemsPerPage = 2;

  searchInput = signal('');
  currentPage = signal(this.firstPage);

  paginatedAndFilteredItems = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    return this.items.filter(
      item => item.name.toLocaleLowerCase().includes(this.searchInput().toLocaleLowerCase())
    ).slice(startIndex, endIndex);
  });

  searchItems(searchInput: string) {
    this.searchInput.set(searchInput);
    if (this.currentPage() > this.firstPage) {
      this.currentPage.set(this.firstPage);
    }
  }

  goToPreviousPage() {
    this.currentPage.update((currentPage) => Math.max(currentPage - 1, 1));
  }

  goToNextPage() {
    this.currentPage.update((currentPage) => Math.min(currentPage + 1, this.itemsPerPage + 1));
  }
}
