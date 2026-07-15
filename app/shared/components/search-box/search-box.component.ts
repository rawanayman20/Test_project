import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Search...';
  @Input() value: string = '';
  @Input() debounceTimeMs: number = 300;
  @Output() search = new EventEmitter<string>();

  private inputSubject = new Subject<string>();
  private subscription!: Subscription;

  ngOnInit() {
    this.subscription = this.inputSubject
      .pipe(
        debounceTime(this.debounceTimeMs),
        distinctUntilChanged()
      )
      .subscribe(val => {
        this.search.emit(val);
      });
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.inputSubject.next(this.value);
  }

  clearSearch() {
    this.value = '';
    this.inputSubject.next(this.value);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
