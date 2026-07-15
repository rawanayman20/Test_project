import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-searchable-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchable-dropdown.component.html',
  styleUrl: './searchable-dropdown.component.css'
})
export class SearchableDropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Select item';
  @Input() label: string = '';
  @Input() selectedValue: any = null;
  @Input() disabled: boolean = false;
  @Output() selectionChange = new EventEmitter<any>();

  isOpen: boolean = false;
  searchText: string = '';
  filteredOptions: DropdownOption[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnChanges() {
    this.filterOptions();
  }

  get selectedLabel(): string {
    const selected = this.options.find(opt => opt.value === this.selectedValue);
    return selected ? selected.label : '';
  }

  toggleDropdown() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchText = '';
      this.filterOptions();
      // focus input next cycle
      setTimeout(() => {
        const input = this.elementRef.nativeElement.querySelector('.search-input');
        if (input) input.focus();
      }, 50);
    }
  }

  filterOptions() {
    if (!this.searchText) {
      this.filteredOptions = this.options;
    } else {
      const q = this.searchText.toLowerCase();
      this.filteredOptions = this.options.filter(opt =>
        opt.label.toLowerCase().includes(q)
      );
    }
  }

  selectOption(option: DropdownOption) {
    this.selectedValue = option.value;
    this.selectionChange.emit(option.value);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
