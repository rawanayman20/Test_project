import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 10;
  @Input() totalItems: number = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Output() pageChange = new EventEmitter<{ pageIndex: number, pageSize: number }>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get startItem(): number {
    if (this.totalItems === 0) return 0;
    return this.pageIndex * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalItems);
  }

  goToPage(index: number) {
    if (index >= 0 && index < this.totalPages && index !== this.pageIndex) {
      this.pageChange.emit({ pageIndex: index, pageSize: this.pageSize });
    }
  }

  onPageSizeChange(newSize: number) {
    const size = parseInt(newSize as any, 10);
    this.pageChange.emit({ pageIndex: 0, pageSize: size });
  }
}
