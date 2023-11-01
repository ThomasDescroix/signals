import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <input [ngModel]="searchInput$ | async" (ngModelChange)="searchItems($event)" placeholder="Search..." />

    <ul>
      <li *ngFor="let item of paginatedAndFilteredItems$ | async">{{ item.name }}</li>
    </ul>

    <button (click)="goToPreviousPage()">Previous</button>
    pag. {{ currentPage$ | async }}
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

  searchInput$ = new BehaviorSubject('');
  currentPage$ = new BehaviorSubject(this.firstPage);

  paginatedAndFilteredItems$ = combineLatest([this.searchInput$, this.currentPage$]).pipe(
    map(([searchInput, currentPage]) => {
      const filteredItems = this.items.filter((item) => item.name.includes(searchInput));
      const firstItemIndex = (currentPage - 1) * this.itemsPerPage;
      const lastItemIndex = firstItemIndex + this.itemsPerPage;
      return filteredItems.slice(firstItemIndex, lastItemIndex);
    }),
    distinctUntilChanged()
  );

  searchItems(searchInput: string) {
    this.searchInput$.next(searchInput);
    this.currentPage$.next(this.firstPage);
  }

  goToPreviousPage() {
    this.currentPage$.next(Math.max(this.currentPage$.value - 1, this.firstPage));
  }

  goToNextPage() {
    this.currentPage$.next(Math.min(this.currentPage$.value + 1, this.itemsPerPage + 1));
  }
}
