import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TableColumn, TableAction } from '../../models/crud.interface';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() currentSortKey: string = '';
  @Input() currentSortDir: 'asc' | 'desc' | '' = '';
  @Input() actions: TableAction[] = [];

  @Output() sortChange = new EventEmitter<{ key: string, dir: 'asc' | 'desc' }>();
  @Output() actionClick = new EventEmitter<{ actionId: string, row: any }>();

  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) {}

  onHeaderClick(col: TableColumn) {
    if (!col.sortable) return;
    let nextDir: 'asc' | 'desc' = 'asc';
    if (this.currentSortKey === col.key) {
      nextDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
    }
    this.sortChange.emit({ key: col.key, dir: nextDir });
  }

  getFormattedValue(col: TableColumn, row: any): string {
    const rawVal = row[col.key];
    if (col.transform) {
      return col.transform(rawVal, row);
    }

    if (rawVal === undefined || rawVal === null) return '-';

    switch (col.type) {
      case 'currency':
        return this.currencyPipe.transform(rawVal, 'USD', 'symbol', '1.0-0') || '$0';
      case 'date':
        return this.datePipe.transform(rawVal, 'mediumDate') || String(rawVal);
      default:
        return String(rawVal);
    }
  }

  getBadgeClass(col: TableColumn, row: any): string {
    const rawVal = row[col.key];
    if (col.badgeClassMap && rawVal !== undefined && rawVal !== null) {
      const cls = col.badgeClassMap[String(rawVal)];
      if (cls) return cls;
    }
    return 'badge-default';
  }

  shouldShowAction(act: TableAction, row: any): boolean {
    if (act.condition) {
      return act.condition(row);
    }
    return true;
  }

  onActionClick(actionId: string, row: any) {
    this.actionClick.emit({ actionId, row });
  }
}
