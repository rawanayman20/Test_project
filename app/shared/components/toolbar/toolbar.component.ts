import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  @Input() title!: string;
  @Input() subtitle: string = '';
  @Input() primaryActionLabel: string = '';
  @Input() primaryActionIcon: 'plus' | 'refresh' | '' = '';
  @Output() primaryActionClick = new EventEmitter<void>();
}
