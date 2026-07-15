import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  @Input() visible: boolean = false;
  @Input() message: string = 'Loading data...';
  @Input() isEmbedded: boolean = false; // can be used within a card instead of full viewport overlay if needed
}
